import assert from "node:assert/strict";
import { after, before, test } from "node:test";

import { POST } from "../../app/api/leads/route";
import { validLead } from "../fixtures/lead";

const originalFetch = globalThis.fetch;
const mutableEnvironment = process.env as unknown as Record<string, string | undefined>;
const originalEnvironment = {
  NODE_ENV: process.env.NODE_ENV,
  LEAD_STORAGE_PROVIDER: process.env.LEAD_STORAGE_PROVIDER,
  CRM_WEBHOOK_URL: process.env.CRM_WEBHOOK_URL,
  CRM_WEBHOOK_SECRET: process.env.CRM_WEBHOOK_SECRET,
  TURNSTILE_SECRET_KEY: process.env.TURNSTILE_SECRET_KEY,
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  BOOKING_URL_US: process.env.BOOKING_URL_US,
  NEXT_PUBLIC_BOOKING_URL_US: process.env.NEXT_PUBLIC_BOOKING_URL_US,
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  EMAIL_FROM: process.env.EMAIL_FROM,
  META_ACCESS_TOKEN: process.env.META_ACCESS_TOKEN,
  META_DATASET_ID: process.env.META_DATASET_ID,
};

before(() => {
  process.env.LEAD_STORAGE_PROVIDER = "webhook";
  process.env.CRM_WEBHOOK_URL = "https://crm.example.test/leads";
  process.env.CRM_WEBHOOK_SECRET = "test-secret";
  process.env.BOOKING_URL_US = "https://calendar.example.test/us";
  delete process.env.NEXT_PUBLIC_BOOKING_URL_US;
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;
  delete process.env.META_ACCESS_TOKEN;
  delete process.env.META_DATASET_ID;
});

after(() => {
  globalThis.fetch = originalFetch;
  for (const [key, value] of Object.entries(originalEnvironment)) {
    if (value === undefined) delete process.env[key];
    else process.env[key] = value;
  }
});

test("POST /api/leads returns the public result after storage", async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  globalThis.fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    return new Response(null, { status: 202 });
  };
  delete process.env.TURNSTILE_SECRET_KEY;

  const response = await POST(
    new Request("https://needfoundry.example/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": "192.0.2.31",
        referer: "https://needfoundry.example/apply",
      },
      body: JSON.stringify(validLead()),
    }),
  );
  const result = (await response.json()) as Record<string, unknown>;

  assert.equal(response.status, 201);
  assert.equal(result.status, "qualified");
  assert.match(String(result.leadId), /^[0-9a-f-]{36}$/i);
  assert.equal(
    result.bookingUrl,
    `https://calendar.example.test/us?lead_id=${result.leadId}`,
  );
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, "https://crm.example.test/leads");
  assert.ok(new Headers(requests[0].init?.headers).has("x-needfoundry-signature"));
});

test("POST /api/leads returns field-safe validation issues", async () => {
  let requestCount = 0;
  globalThis.fetch = async () => {
    requestCount += 1;
    return new Response(null, { status: 202 });
  };
  delete process.env.TURNSTILE_SECRET_KEY;

  const response = await POST(
    new Request("https://needfoundry.example/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": "192.0.2.32",
      },
      body: JSON.stringify({ ...validLead(), email: "invalid" }),
    }),
  );
  const result = (await response.json()) as {
    error?: string;
    issues?: Array<{ field: string }>;
  };

  assert.equal(response.status, 422);
  assert.equal(result.error, "Please check the highlighted fields.");
  assert.ok(result.issues?.some(({ field }) => field === "email"));
  assert.equal(requestCount, 0);
});

test("POST /api/leads supports isolated in-memory storage in development", async () => {
  const previousProvider = process.env.LEAD_STORAGE_PROVIDER;
  const previousNodeEnvironment = process.env.NODE_ENV;
  const previousCrmWebhook = process.env.CRM_WEBHOOK_URL;
  const previousBookingUrl = process.env.BOOKING_URL_US;
  process.env.LEAD_STORAGE_PROVIDER = "memory";
  mutableEnvironment.NODE_ENV = "development";
  delete process.env.CRM_WEBHOOK_URL;
  delete process.env.BOOKING_URL_US;
  delete process.env.TURNSTILE_SECRET_KEY;
  globalThis.fetch = async () => {
    throw new Error("Local memory storage must not call an external provider.");
  };

  try {
    const response = await POST(
      new Request("http://localhost:3000/api/leads", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-real-ip": "127.0.0.1",
        },
        body: JSON.stringify(validLead()),
      }),
    );
    const result = (await response.json()) as Record<string, unknown>;

    assert.equal(response.status, 201);
    assert.equal(result.status, "qualified");
    assert.match(String(result.leadId), /^[0-9a-f-]{36}$/i);
    assert.match(String(result.message), /follow up using the work email/i);
  } finally {
    if (previousProvider === undefined) delete process.env.LEAD_STORAGE_PROVIDER;
    else process.env.LEAD_STORAGE_PROVIDER = previousProvider;
    if (previousNodeEnvironment === undefined) delete mutableEnvironment.NODE_ENV;
    else mutableEnvironment.NODE_ENV = previousNodeEnvironment;
    if (previousCrmWebhook === undefined) delete process.env.CRM_WEBHOOK_URL;
    else process.env.CRM_WEBHOOK_URL = previousCrmWebhook;
    if (previousBookingUrl === undefined) delete process.env.BOOKING_URL_US;
    else process.env.BOOKING_URL_US = previousBookingUrl;
  }
});

test("POST /api/leads rejects in-memory storage in production", async () => {
  const previousProvider = process.env.LEAD_STORAGE_PROVIDER;
  const previousNodeEnvironment = process.env.NODE_ENV;
  process.env.LEAD_STORAGE_PROVIDER = "memory";
  mutableEnvironment.NODE_ENV = "production";
  process.env.TURNSTILE_SECRET_KEY = "configured-secret";
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "configured-site-key";
  let fetchCalls = 0;
  globalThis.fetch = async () => {
    fetchCalls += 1;
    return Response.json({ success: true });
  };

  try {
    const response = await POST(
      new Request("https://needfoundry.example/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json", "x-real-ip": "192.0.2.34" },
        body: JSON.stringify(validLead({ turnstileToken: "valid-token" })),
      }),
    );

    assert.equal(response.status, 503);
    assert.equal(fetchCalls, 0);
  } finally {
    if (previousProvider === undefined) delete process.env.LEAD_STORAGE_PROVIDER;
    else process.env.LEAD_STORAGE_PROVIDER = previousProvider;
    if (previousNodeEnvironment === undefined) delete mutableEnvironment.NODE_ENV;
    else mutableEnvironment.NODE_ENV = previousNodeEnvironment;
  }
});

test("POST /api/leads stops when Turnstile rejects the token", async () => {
  const urls: string[] = [];
  globalThis.fetch = async (input) => {
    urls.push(String(input));
    return Response.json({ success: false });
  };
  process.env.TURNSTILE_SECRET_KEY = "turnstile-secret";
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY = "turnstile-site-key";

  const response = await POST(
    new Request("https://needfoundry.example/api/leads", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-real-ip": "192.0.2.33",
      },
      body: JSON.stringify(validLead({ turnstileToken: "invalid-token" })),
    }),
  );

  assert.equal(response.status, 400);
  assert.deepEqual(urls, [
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
  ]);
});
