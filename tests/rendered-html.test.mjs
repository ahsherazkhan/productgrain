import assert from "node:assert/strict";
import test from "node:test";

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
  assert.match(html, /Product references/i);
  assert.match(html, /Building a litigation platform with AI-assisted workflows/i);
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

test("server-renders the reference index and every published product profile", async () => {
  const workResponse = await render("/work");
  assert.equal(workResponse.status, 200);
  const workHtml = await workResponse.text();
  for (const slug of ["claimdeck", "cpap", "callpotential", "built-by-girls", "cost-plus-drugs", "fuze-health", "children-health", "mantl", "ticketrev", "tributi", "loopple"]) {
    assert.match(workHtml, new RegExp(`/work/${slug}`));
    const detailResponse = await render(`/work/${slug}`);
    assert.equal(detailResponse.status, 200, slug);
    const detailHtml = await detailResponse.text();
    assert.match(detailHtml, /Project record/);
    assert.match(detailHtml, /Profile type/);
    assert.match(detailHtml, /not (?:as|presented as) (?:verified )?NeedFoundry client work/i);
  }

  const costPlusResponse = await render("/work/cost-plus-drugs");
  const costPlusHtml = await costPlusResponse.text();
  assert.match(costPlusHtml, /player\.vimeo\.com\/video\/1120947017/);
  assert.doesNotMatch(costPlusHtml, /autoplay=1/);

  const cpapResponse = await render("/work/cpap");
  const cpapHtml = await cpapResponse.text();
  assert.match(cpapHtml, /player\.vimeo\.com\/video\/1078017296/);
  assert.doesNotMatch(cpapHtml, /autoplay=1/);

  const missingResponse = await render("/work/not-a-real-project");
  assert.equal(missingResponse.status, 404);
});
