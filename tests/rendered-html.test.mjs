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
  assert.match(html, /MVP and Custom Software Product Studio/);
  assert.match(html, /Turn a real business problem into focused software/);
  assert.match(html, /Tell us about your project/);
  assert.match(html, /Start with the problem—not a feature list/);
  assert.match(html, /Choose the right first step/);
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
