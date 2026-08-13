import assert from "node:assert/strict";
import test from "node:test";

import {
  MetaConversionsClient,
  MetaLeadAnalyticsSink,
} from "../../src/lib/analytics/meta";
import { MemoryLeadRepository } from "../../src/lib/leads/repositories";
import { submitLeadApplication } from "../../src/lib/leads/service";
import { validLead } from "../fixtures/lead";

test("Meta lead events contain only consented, privacy-safe fields", async () => {
  const requests: Array<{ url: string; init?: RequestInit }> = [];
  const fetcher: typeof fetch = async (input, init) => {
    requests.push({ url: String(input), init });
    return new Response(JSON.stringify({ events_received: 1 }), { status: 200 });
  };
  const client = new MetaConversionsClient(
    "123456789",
    "private-access-token",
    "TEST123",
    fetcher,
  );

  await submitLeadApplication(
    validLead({ advertisingConsent: true, advertisingConsentUpdatedAt: "2026-08-14T12:00:00.000Z", consentPolicyVersion: "2026-08-14" }),
    {
      repository: new MemoryLeadRepository(),
      analyticsSink: new MetaLeadAnalyticsSink(client),
      verifyHuman: async () => true,
      createId: () => "32d989c2-1753-4d36-93a6-96a95486ca75",
    },
    {
      eventSourceUrl: "https://needfoundry.example/apply?email=private%40example.com#secret",
      clientIp: "192.0.2.10",
      userAgent: "Analytics test",
    },
  );

  assert.equal(requests.length, 2);
  assert.equal(requests[0].url.includes("private-access-token"), false);
  assert.equal(
    new Headers(requests[0].init?.headers).get("authorization"),
    "Bearer private-access-token",
  );
  const body = String(requests[0].init?.body);
  assert.doesNotMatch(body, /alex@example\.com/i);
  assert.doesNotMatch(body, /repeatedly transfers|spreadsheets/i);
  assert.match(body, /qualification_status/);
  assert.match(body, /"Lead"/);
  assert.match(String(requests[1].init?.body), /"QualifiedLead"/);
  const leadPayload = JSON.parse(String(requests[0].init?.body)) as { data: Array<{ event_id: string; event_source_url: string }> };
  const qualifiedPayload = JSON.parse(String(requests[1].init?.body)) as { data: Array<{ event_id: string }> };
  assert.equal(qualifiedPayload.data[0].event_id, leadPayload.data[0].event_id);
  assert.equal(leadPayload.data[0].event_source_url, "https://needfoundry.example/apply");
});

test("Meta lead events are not sent without advertising consent", async () => {
  let requestCount = 0;
  const fetcher: typeof fetch = async () => {
    requestCount += 1;
    return new Response(null, { status: 200 });
  };
  const client = new MetaConversionsClient(
    "123456789",
    "private-access-token",
    undefined,
    fetcher,
  );

  await submitLeadApplication(validLead({ marketingConsent: true, advertisingConsent: false }), {
    repository: new MemoryLeadRepository(),
    analyticsSink: new MetaLeadAnalyticsSink(client),
    verifyHuman: async () => true,
  });

  assert.equal(requestCount, 0);
});
