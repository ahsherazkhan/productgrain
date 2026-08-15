import assert from "node:assert/strict";
import test from "node:test";

const publishedWork = [
  { slug: "claimdeck", sourceUrl: "https://codal.com/work/claimdeck/" },
  { slug: "cpap", sourceUrl: "https://codal.com/work/cpap-com/" },
  { slug: "callpotential", sourceUrl: "https://codal.com/work/callpotential/" },
  { slug: "built-by-girls", sourceUrl: "https://codal.com/work/built-by-girls/" },
  { slug: "fuze-health", sourceUrl: "https://codal.com/work/truepill-fuze-health/" },
  { slug: "children-health", sourceUrl: "https://codal.com/work/childrens-health/" },
  { slug: "mantl", sourceUrl: "https://codal.com/work/mantl/" },
];
const archivedWorkSlugs = [
  "ticketrev",
  "tributi",
  "loopple",
];
const removedWorkSlug = "cost-plus-drugs";
const falseNeedFoundryDeliveryClaim =
  /NeedFoundry client (?:work|projects?|engagements?)|(?:delivered|built|designed|developed|created) by NeedFoundry|NeedFoundry (?:delivered|built|designed|developed|created)/i;
const referenceDisclosure =
  /Industry reference compiled from Codal's public case study and credited product media\./i;

function readStructuredData(html) {
  const match = html.match(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/i,
  );
  assert.ok(match, "JSON-LD script");
  return JSON.parse(match[1]);
}

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${pathname}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the NeedFoundry homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /The product-first studio for AI-native software/i);
  assert.match(html, /research real problems, validate product/i);
  assert.match(html, /Discuss your product idea/i);
  assert.match(html, /AI should improve the workflow/i);
  assert.match(html, /Start with the right level of product certainty/i);
  assert.match(html, /Industry references/i);
  assert.match(html, /Digital products shaped around real operating problems/i);
  assert.match(html, /ClaimDeck/i);
  assert.doesNotMatch(html, falseNeedFoundryDeliveryClaim);
  assert.doesNotMatch(html, /Know what you are committing to before development begins/i);
  for (const { slug } of publishedWork) {
    assert.match(html, new RegExp(`/work/${slug}`), slug);
  }
  for (const slug of [...archivedWorkSlugs, removedWorkSlug]) {
    assert.doesNotMatch(html, new RegExp(`/work/${slug}`), slug);
  }
  assert.doesNotMatch(html, /decision-map|Founder and team|Product possibilities/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});

test("server-renders market-specific campaign pricing", async () => {
  const [ukResponse, usResponse] = await Promise.all([
    render("/mvp-development/uk"),
    render("/mvp-development/us"),
  ]);
  assert.equal(ukResponse.status, 200);
  assert.equal(usResponse.status, 200);
  const [uk, us] = await Promise.all([ukResponse.text(), usResponse.text()]);
  assert.match(uk, /From £8,000/);
  assert.doesNotMatch(uk, /From \$10,000/);
  assert.match(us, /From \$10,000/);
  assert.doesNotMatch(us, /From £8,000/);
  assert.doesNotMatch(uk, /workflow-window|A familiar starting point|Founder and team/);
});

test("server-renders required core routes", async () => {
  for (const route of ["/services", "/process", "/pricing", "/work", "/about", "/apply", "/privacy", "/terms", "/cookies"]) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
  }
});

test("server-renders seven sourced industry references and archives unverified profiles", async () => {
  const workResponse = await render("/work");
  assert.equal(workResponse.status, 200);
  const workHtml = await workResponse.text();
  assert.match(workHtml, /Industry references/i);
  assert.match(workHtml, /Digital products shaped around real operating problems/i);
  assert.match(workHtml, /Every profile links to its original source/i);
  assert.doesNotMatch(workHtml, falseNeedFoundryDeliveryClaim);
  assert.doesNotMatch(workHtml, /Unifying pharmacy operations for faster fulfillment and product iteration/i);

  const workStructuredData = readStructuredData(workHtml);
  assert.equal(workStructuredData["@type"], "CollectionPage");
  assert.deepEqual(
    workStructuredData.hasPart.map((item) => item.citation),
    publishedWork.map((item) => item.sourceUrl),
  );

  for (const { slug, sourceUrl } of publishedWork) {
    assert.match(workHtml, new RegExp(`/work/${slug}`), slug);
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 200, slug);
    const detailHtml = await detailResponse.text();
    assert.match(detailHtml, /Industry reference/i);
    assert.match(detailHtml, /Source: Codal/i);
    assert.match(detailHtml, referenceDisclosure);
    assert.match(detailHtml, /Project record|Profile type/i);
    assert.doesNotMatch(detailHtml, falseNeedFoundryDeliveryClaim);

    const detailStructuredData = readStructuredData(detailHtml);
    assert.equal(detailStructuredData["@type"], "Article");
    assert.equal(detailStructuredData.citation, sourceUrl);
    assert.equal(detailStructuredData.isBasedOn, sourceUrl);
  }

  const cpapHtml = await (await render("/work/cpap")).text();
  assert.match(cpapHtml, /How the workflow fits together/i);
  assert.match(cpapHtml, /cpap-ui\.webp/i);
  assert.doesNotMatch(cpapHtml, /player\.vimeo\.com/i);

  for (const slug of archivedWorkSlugs) {
    assert.doesNotMatch(workHtml, new RegExp(`/work/${slug}`));
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 404, slug);
    const detailHtml = await detailResponse.text();
    assert.doesNotMatch(detailHtml, /Project record|Profile type|Published outcomes/i);
  }

  assert.doesNotMatch(workHtml, new RegExp(`/work/${removedWorkSlug}`));
  const removedResponse = await render(`/work/${removedWorkSlug}`);
  assert.equal(removedResponse.status, 404, removedWorkSlug);
  const removedHtml = await removedResponse.text();
  assert.doesNotMatch(
    removedHtml,
    /Project record|Profile type|Published outcomes|Unifying pharmacy operations/i,
  );

  const missingResponse = await render("/work/not-a-real-project");
  assert.equal(missingResponse.status, 404);
});
