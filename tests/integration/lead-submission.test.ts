import assert from "node:assert/strict";
import test from "node:test";

import type { EmailMessage, EmailService } from "../../src/lib/email/index";
import {
  LeadSubmissionError,
  submitLeadApplication,
} from "../../src/lib/leads/service";
import type {
  LeadAnalyticsSink,
  LeadNotificationSink,
} from "../../src/lib/leads/types";
import { MemoryLeadRepository } from "../../src/lib/leads/repositories";
import { enrichedLead, validLead } from "../fixtures/lead";

const fixedId = "a46bfdd6-ce5e-461a-b339-59d67d0338e0";
const fixedNow = new Date("2026-08-14T12:00:00.000Z");

class RecordingEmailService implements EmailService {
  readonly messages: EmailMessage[] = [];

  constructor(private readonly failure?: Error) {}

  async send(message: EmailMessage): Promise<void> {
    this.messages.push(message);
    if (this.failure) throw this.failure;
  }
}

class FailingSink implements LeadNotificationSink {
  async send(): Promise<void> {
    throw new Error("deliberate downstream failure");
  }
}

class FailingAnalyticsSink implements LeadAnalyticsSink {
  async trackLead(): Promise<void> {
    throw new Error("deliberate analytics failure");
  }
}

function dependencies(repository = new MemoryLeadRepository()) {
  return {
    repository,
    now: () => fixedNow,
    createId: () => fixedId,
    verifyHuman: async () => true,
    bookingUrls: {
      us: "https://calendar.example/us",
      uk: "https://calendar.example/uk",
      default: "https://calendar.example/call",
    },
  };
}

test("valid submission is scored, saved, notified, and routed", async () => {
  const repository = new MemoryLeadRepository();
  const email = new RecordingEmailService();

  const result = await submitLeadApplication(
    validLead(),
    {
      ...dependencies(repository),
      emailService: email,
      internalLeadEmail: "team@needfoundry.example",
    },
    {
      clientIp: "192.0.2.10",
      userAgent: "Integration test",
      eventSourceUrl: "https://needfoundry.example/apply",
    },
  );

  assert.deepEqual(result, {
    leadId: fixedId,
    status: "qualified",
    bookingUrl: `https://calendar.example/us?lead_id=${fixedId}`,
    message:
      "Your project looks like a potential fit. Choose a suitable time for a free product discussion.",
  });
  assert.equal(repository.records.length, 1);
  assert.equal(repository.records[0].score, 70);
  assert.deepEqual(repository.records[0].scoreBreakdown, {
    budget: 50,
    timeline: 20,
  });
  assert.equal(repository.records[0].qualificationStatus, "qualified");
  assert.equal(repository.records[0].role, undefined);
  assert.equal(repository.records[0].productStage, undefined);
  assert.equal(repository.records[0].decisionAuthority, undefined);
  assert.equal(repository.records[0].retentionUntil, "2027-08-14T12:00:00.000Z");
  assert.equal(email.messages.length, 2);
  assert.equal(email.messages[0].to[0], "alex@example.com");
  assert.doesNotMatch(
    email.messages[1].text,
    /repeatedly transfers the same project details/i,
  );
  assert.doesNotMatch(email.messages[1].text, /undefined/i);
});

test("Turnstile rejection stops before storage", async () => {
  const repository = new MemoryLeadRepository();

  await assert.rejects(
    submitLeadApplication(validLead(), {
      ...dependencies(repository),
      verifyHuman: async () => false,
    }),
    (error: unknown) =>
      error instanceof LeadSubmissionError &&
      error.code === "human-verification-failed",
  );
  assert.equal(repository.records.length, 0);
});

test("invalid form data stops before verification and storage", async () => {
  const repository = new MemoryLeadRepository();
  let verificationCalled = false;

  await assert.rejects(
    submitLeadApplication(
      { ...validLead(), email: "not-an-email" },
      {
        ...dependencies(repository),
        verifyHuman: async () => {
          verificationCalled = true;
          return true;
        },
      },
    ),
    (error: unknown) =>
      error instanceof LeadSubmissionError && error.code === "invalid-payload",
  );
  assert.equal(verificationCalled, false);
  assert.equal(repository.records.length, 0);
});

test("routes a review application without exposing a booking URL", async () => {
  const result = await submitLeadApplication(
    validLead({
      budgetRange: "not-sure",
      timeline: "exploring",
    }),
    dependencies(),
  );

  assert.equal(result.status, "review");
  assert.equal(result.bookingUrl, undefined);
});

test("routes a nurture application without exposing a booking URL", async () => {
  const result = await submitLeadApplication(
    validLead({
      budgetRange: "us-under-2500",
      timeline: "exploring",
    }),
    dependencies(),
  );

  assert.equal(result.status, "nurture");
  assert.equal(result.bookingUrl, undefined);
});

test("continues to store optional legacy enrichment when it is provided", async () => {
  const repository = new MemoryLeadRepository();
  await submitLeadApplication(enrichedLead(), dependencies(repository));

  assert.equal(repository.records[0].role, "founder");
  assert.equal(repository.records[0].projectType, "workflow-automation");
  assert.equal(
    repository.records[0].currentWorkaround,
    "The operations team copies information between spreadsheets.",
  );
  assert.equal(repository.records[0].score, 70);
  assert.deepEqual(repository.records[0].scoreBreakdown, {
    budget: 50,
    timeline: 20,
  });
});

test("email, CRM, and analytics failures do not lose a saved lead", async () => {
  const repository = new MemoryLeadRepository();
  const failures: Array<{ service: string; code: string }> = [];

  const result = await submitLeadApplication(validLead(), {
    ...dependencies(repository),
    emailService: new RecordingEmailService(new Error("email unavailable")),
    crmSink: new FailingSink(),
    analyticsSink: new FailingAnalyticsSink(),
    onOptionalFailure(service, code) {
      failures.push({ service, code });
    },
  });

  assert.equal(result.status, "qualified");
  assert.equal(repository.records.length, 1);
  assert.deepEqual(
    failures.map(({ service }) => service).sort(),
    ["crm", "email", "meta"],
  );
});

test("storage failure returns a generic domain error", async () => {
  await assert.rejects(
    submitLeadApplication(validLead(), {
      repository: {
        async save() {
          throw new Error("private database detail");
        },
      },
      verifyHuman: async () => true,
    }),
    (error: unknown) =>
      error instanceof LeadSubmissionError && error.code === "storage-failed",
  );
});

test("honors a reviewed short retention period", async () => {
  const repository = new MemoryLeadRepository();
  await submitLeadApplication(validLead(), {
    ...dependencies(repository),
    retentionDays: 7,
  });
  assert.equal(repository.records[0].retentionUntil, "2026-08-21T12:00:00.000Z");
});

test("drops advertising identifiers at the server boundary without consent", async () => {
  const repository = new MemoryLeadRepository();
  await submitLeadApplication(validLead({
    advertisingConsent: false,
    fbclid: "direct-client-id",
    landingPage: "/apply?utm_source=meta&fbclid=direct-client-id",
    firstTouch: {
      capturedAt: fixedNow.toISOString(),
      landingPage: "/?fbclid=direct-client-id",
      fbclid: "direct-client-id",
    },
  }), dependencies(repository));
  assert.equal(repository.records[0].fbclid, undefined);
  assert.equal(repository.records[0].landingPage, "/apply?utm_source=meta");
  assert.equal(repository.records[0].firstTouch.fbclid, undefined);
  assert.doesNotMatch(repository.records[0].firstTouch.landingPage ?? "", /fbclid/i);
});
