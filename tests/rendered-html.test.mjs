import assert from "node:assert/strict";
import test from "node:test";

const publishedWorkSlugs = [
  "claimdeck",
  "cpap",
  "callpotential",
  "built-by-girls",
  "fuze-health",
  "children-health",
  "mantl",
];
const archivedWorkSlugs = [
  "ticketrev",
  "tributi",
  "loopple",
];
const removedWorkSlug = "cost-plus-drugs";
const legacyReferenceFraming =
  /Codal|\breferences?\b|\/work\/codal(?:\/|%2f)/i;
const verifiedProjectDisclosure =
  /Delivered by NeedFoundry and published with founder authorization\./i;

function readStructuredData(html, type) {
  const scripts = [...html.matchAll(
    /<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi,
  )].map((match) => JSON.parse(match[1]));
  const structuredData = scripts.find(
    (item) => item["@type"] === type,
  );
  assert.ok(structuredData, `${type} JSON-LD script`);
  return structuredData;
}

function assertConciseEnquiryForm(html, selectedCurrency) {
  assert.match(html, /About 2 minutes/i);
  assert.match(html, /No technical brief required/i);
  assert.match(html, /Tell us what you(?:’|&#x27;)d like to build or improve/i);
  assert.match(html, /Company or project name/i);
  assert.match(html, /What would you like to build or improve\?/i);
  assert.match(html, /Approximate first-phase budget/i);
  assert.match(html, /When would you like to start\?/i);
  assert.match(html, /I consent to NeedFoundry contacting me about this enquiry/i);
  assert.match(html, /Optional and unchecked by default/i);
  assert.match(html, /Send project enquiry/i);
  assert.match(
    html,
    new RegExp(`aria-pressed="true"[^>]*>${selectedCurrency}</button>`, "i"),
  );
  assert.equal([...html.matchAll(/<form\b/gi)].length, 1);
  assert.equal([...html.matchAll(/aria-required="true"/gi)].length, 6);
  assert.doesNotMatch(html, />Continue</i);
  assert.doesNotMatch(
    html,
    /id="(?:country|role|industry|projectType|aiExpectation|currentWorkaround|intendedUsers|userDiscussions|userAccess|problemImpact|productStage|decisionAuthority)"/i,
  );
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
  assert.match(html, /Selected work/i);
  assert.match(html, /Focused products, shaped around real operating problems/i);
  assert.match(html, /Products designed and built by NeedFoundry/i);
  assert.match(html, /NeedFoundry project/i);
  assert.match(html, /ClaimDeck/i);
  assert.match(html, /\/work\/projects\//i);
  assert.doesNotMatch(html, legacyReferenceFraming);
  assert.doesNotMatch(html, /Know what you are committing to before development begins/i);
  for (const slug of publishedWorkSlugs) {
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
  assert.match(uk, /£8,000–£20,000/);
  assert.doesNotMatch(uk, /\$10,000–\$25,000/);
  assert.match(us, /\$10,000–\$25,000/);
  assert.doesNotMatch(us, /£8,000–£20,000/);
  assertConciseEnquiryForm(uk, "GBP");
  assertConciseEnquiryForm(us, "USD");
});

test("server-renders required core routes", async () => {
  for (const route of ["/services", "/process", "/pricing", "/work", "/about", "/apply", "/privacy", "/terms", "/cookies"]) {
    const response = await render(route);
    assert.equal(response.status, 200, route);
  }

  const applyResponse = await render("/apply");
  assert.equal(applyResponse.status, 200);
  const applyHtml = await applyResponse.text();
  assert.match(applyHtml, /A short note is enough to start/i);
  assert.match(applyHtml, /No technical specification/i);
});

test("server-renders seven verified NeedFoundry projects and archives unpublished profiles", async () => {
  const workResponse = await render("/work");
  assert.equal(workResponse.status, 200);
  const workHtml = await workResponse.text();
  assert.match(workHtml, /Selected work/i);
  assert.match(workHtml, /Focused products, shaped around real operating problems/i);
  assert.match(workHtml, /Products designed and built by NeedFoundry/i);
  assert.match(workHtml, /NeedFoundry project/i);
  assert.match(workHtml, /\/work\/projects\//i);
  assert.doesNotMatch(workHtml, legacyReferenceFraming);
  assert.doesNotMatch(workHtml, /Unifying pharmacy operations for faster fulfillment and product iteration/i);

  const workStructuredData = readStructuredData(workHtml, "CollectionPage");
  assert.equal(workStructuredData["@type"], "CollectionPage");
  assert.equal(workStructuredData.hasPart.length, 7);
  for (const item of workStructuredData.hasPart) {
    assert.equal(item["@type"], "Article");
    assert.equal(item.author?.name, "NeedFoundry");
    assert.equal(item.publisher?.name, "NeedFoundry");
    assert.equal(item.about?.["@type"], "SoftwareApplication");
    assert.equal(item.about?.creator?.name, "NeedFoundry");
    assert.ok(!("citation" in item));
    assert.ok(!("isBasedOn" in item));
  }

  for (const slug of publishedWorkSlugs) {
    assert.match(workHtml, new RegExp(`/work/${slug}`), slug);
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 200, slug);
    const detailHtml = await detailResponse.text();
    assert.match(detailHtml, /NeedFoundry project/i);
    assert.match(detailHtml, verifiedProjectDisclosure);
    assert.match(detailHtml, /Project record/i);
    assert.match(detailHtml, /Client/i);
    assert.match(detailHtml, /Engagement/i);
    assert.match(detailHtml, /\/work\/projects\//i);
    assert.doesNotMatch(detailHtml, legacyReferenceFraming);
    assert.doesNotMatch(detailHtml, /Source:|Profile type|Published outcomes/i);

    const detailStructuredData = readStructuredData(detailHtml, "Article");
    assert.equal(detailStructuredData["@type"], "Article");
    assert.equal(detailStructuredData.author?.name, "NeedFoundry");
    assert.equal(detailStructuredData.publisher?.name, "NeedFoundry");
    assert.equal(detailStructuredData.about?.["@type"], "SoftwareApplication");
    assert.equal(detailStructuredData.about?.creator?.name, "NeedFoundry");
    assert.ok(!("citation" in detailStructuredData));
    assert.ok(!("isBasedOn" in detailStructuredData));
  }

  const cpapHtml = await (await render("/work/cpap")).text();
  assert.match(cpapHtml, /How the workflow fits together/i);
  assert.match(cpapHtml, /\/work\/projects\/cpap-ui\.webp/i);
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
