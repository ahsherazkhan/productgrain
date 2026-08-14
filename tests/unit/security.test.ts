import assert from "node:assert/strict";
import test from "node:test";

import {
  buildBookingUrl,
  InMemoryRateLimiter,
  verifyTurnstile,
  readLimitedJson,
  RequestBodyError,
} from "../../src/lib/security/index";

test("rate limiter enforces a rolling window", () => {
  const limiter = new InMemoryRateLimiter(2, 1_000);
  assert.equal(limiter.check("client", 0).allowed, true);
  assert.equal(limiter.check("client", 100).allowed, true);
  assert.equal(limiter.check("client", 200).allowed, false);
  assert.equal(limiter.check("client", 1_100).allowed, true);
});

test("rate limiter does not grow beyond its key cap", () => {
  const limiter = new InMemoryRateLimiter(2, 1_000, 1);
  assert.equal(limiter.check("first", 0).allowed, true);
  assert.equal(limiter.check("second", 100).allowed, false);
  assert.equal(limiter.check("second", 1_100).allowed, true);
});

test("stops streaming request bodies at the configured byte limit", async () => {
  const encoder = new TextEncoder();
  const request = new Request("https://needfoundry.example/api/leads", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('{"value":"'));
        controller.enqueue(encoder.encode("x".repeat(128)));
        controller.close();
      },
    }),
    duplex: "half",
  } as RequestInit & { duplex: "half" });
  await assert.rejects(readLimitedJson(request, 32), (error: unknown) =>
    error instanceof RequestBodyError && error.code === "payload-too-large");
});

test("booking URL accepts HTTPS and adds only the opaque lead id", () => {
  assert.equal(
    buildBookingUrl("https://calendar.example/book?team=product", "lead-id"),
    "https://calendar.example/book?team=product&lead_id=lead-id",
  );
  assert.equal(buildBookingUrl("javascript:alert(1)", "lead-id"), undefined);
  assert.equal(buildBookingUrl("https://user:pass@example.com", "lead-id"), undefined);
});

test("Turnstile is skipped only when no server secret is configured", async () => {
  assert.deepEqual(await verifyTurnstile({ token: undefined }), {
    success: true,
    skipped: true,
  });
  assert.deepEqual(await verifyTurnstile({ token: undefined, secret: "secret" }), {
    success: false,
    skipped: false,
  });
});
