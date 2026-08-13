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
import { validLead } from "../fixtures/lead";

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
  assert.equal(repository.records[0].score, 100);
  assert.equal(repository.records[0].qualificationStatus, "qualified");
  assert.equal(repository.records[0].retentionUntil, "2027-08-14T12:00:00.000Z");
  assert.equal(email.messages.length, 2);
  assert.equal(email.messages[0].to[0], "alex@example.com");
  assert.doesNotMatch(email.messages[1].text, /problem repeatedly transfers/i);
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
      role: "technical-founder",
      productStage: "early-idea",
      budgetRange: "not-sure",
      timeline: "within-six-months",
      userAccess: "probably",
      problemImpact: "moderate-inefficiency",
    }),
    dependencies(),
  );

  assert.equal(result.status, "review");
  assert.equal(result.bookingUrl, undefined);
});

test("routes a nurture application without exposing a booking URL", async () => {
  const result = await submitLeadApplication(
    validLead({
      role: "student-researcher",
      productStage: "early-idea",
      budgetRange: "us-under-2500",
      timeline: "exploring",
      userAccess: "not-currently",
      userDiscussions: "not-yet",
      problemImpact: "opportunity",
    }),
    dependencies(),
  );

  assert.equal(result.status, "nurture");
  assert.equal(result.bookingUrl, undefined);
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
