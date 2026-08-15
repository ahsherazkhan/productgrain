import assert from "node:assert/strict";
import test from "node:test";

const publishedWorkSlugs = [
  "claimdeck",
  "cpap",
  "callpotential",
  "built-by-girls",
  "cost-plus-drugs",
  "fuze-health",
  "children-health",
  "mantl",
];

const retiredWorkSlugs = [
  "ticketrev",
  "tributi",
  "loopple",
];

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
  assert.match(html, /Digital products shaped around real operating problems/i);
  assert.match(html, /ClaimDeck/i);
  assert.match(html, /Founder-authorized Codal projects/i);
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

test("server-renders approved Codal references and keeps independent profiles retired", async () => {
  const workResponse = await render("/work");
  assert.equal(workResponse.status, 200);
  const workHtml = await workResponse.text();
  assert.match(workHtml, /Project portfolio/i);
  assert.match(workHtml, /delivered and documented by Codal/i);

  for (const slug of publishedWorkSlugs) {
    assert.match(workHtml, new RegExp(`/work/${slug}`));
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 200, slug);
  }

  const cpapHtml = await (await render("/work/cpap")).text();
  assert.match(cpapHtml, /How the workflow fits together/i);
  assert.match(cpapHtml, /cpap-ui\.webp/i);
  assert.doesNotMatch(cpapHtml, /player\.vimeo\.com/i);

  const costPlusHtml = await (await render("/work/cost-plus-drugs")).text();
  assert.match(costPlusHtml, /cost-plus-prescription\.webp/i);
  assert.doesNotMatch(costPlusHtml, /player\.vimeo\.com/i);

  for (const slug of retiredWorkSlugs) {
    assert.doesNotMatch(workHtml, new RegExp(`/work/${slug}`));
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 404, slug);
    const detailHtml = await detailResponse.text();
    assert.doesNotMatch(detailHtml, /Project record|Profile type/i);
  }

  const missingResponse = await render("/work/not-a-real-project");
  assert.equal(missingResponse.status, 404);
});
