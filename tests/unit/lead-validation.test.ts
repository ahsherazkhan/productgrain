import assert from "node:assert/strict";
import test from "node:test";

import {
  leadSubmissionSchema,
  type LeadSubmissionInput,
} from "../../src/lib/validation/lead";
import { enrichedLead, validLead } from "../fixtures/lead";

test("accepts the concise enquiry contract and applies only consent defaults", () => {
  const raw: Record<string, unknown> = { ...validLead() };
  delete raw.marketingConsent;
  delete raw.advertisingConsent;
  const result = leadSubmissionSchema.parse(raw);

  assert.equal(result.marketingConsent, false);
  assert.equal(result.advertisingConsent, false);
  for (const field of [
    "phone",
    "company",
    "country",
    "role",
    "industry",
    "projectType",
    "aiExpectation",
    "packageInterest",
    "currentWorkaround",
    "intendedUsers",
    "userDiscussions",
    "userAccess",
    "problemImpact",
    "productStage",
    "decisionAuthority",
  ] as const) {
    assert.equal(result[field], undefined, field);
  }
});

test("requires all five enquiry answers, market, and reply consent", () => {
  const requiredFields = [
    "fullName",
    "email",
    "problemDescription",
    "budgetRange",
    "timeline",
    "market",
    "contactConsent",
  ] as const satisfies ReadonlyArray<keyof LeadSubmissionInput>;

  for (const field of requiredFields) {
    const raw: Record<string, unknown> = { ...validLead() };
    delete raw[field];
    const result = leadSubmissionSchema.safeParse(raw);
    assert.equal(result.success, false, field);
    if (!result.success) {
      assert.ok(
        result.error.issues.some((issue) => issue.path[0] === field),
        field,
      );
    }
  }
});

test("continues to accept optional legacy enrichment", () => {
  const result = leadSubmissionSchema.parse(enrichedLead());

  assert.equal(result.role, "founder");
  assert.equal(result.projectType, "workflow-automation");
  assert.equal(result.aiExpectation, "ai-enhancement");
  assert.equal(
    result.currentWorkaround,
    "The operations team copies information between spreadsheets.",
  );
  assert.equal(result.decisionAuthority, "final-decision");
});

test("accepts and normalizes a complete application", () => {
  const result = leadSubmissionSchema.parse(
    enrichedLead({
      fullName: "  Alex\tMorgan  ",
      email: "ALEX@EXAMPLE.COM",
      company: "  Example   Works  ",
    }),
  );

  assert.equal(result.fullName, "Alex Morgan");
  assert.equal(result.email, "alex@example.com");
  assert.equal(result.company, "Example Works");
  assert.equal(result.marketingConsent, false);
});

test("normalizes single-line identity fields for safe headers", () => {
  const result = leadSubmissionSchema.parse(enrichedLead({
    fullName: "Alex\nBcc: injected@example.test",
    company: "Example\r\nWorks",
  }));
  assert.equal(result.fullName, "Alex Bcc: injected@example.test");
  assert.equal(result.company, "Example Works");
  assert.doesNotMatch(result.fullName, /[\r\n]/);
});

test("rejects missing enquiry consent and capped free text", () => {
  const result = leadSubmissionSchema.safeParse({
    ...validLead(),
    contactConsent: false,
    problemDescription: "x".repeat(1_201),
  });

  assert.equal(result.success, false);
  if (result.success) return;
  assert.ok(result.error.issues.some((issue) => issue.path[0] === "contactConsent"));
  assert.ok(
    result.error.issues.some((issue) => issue.path[0] === "problemDescription"),
  );
});

test("rejects a budget range from the wrong market", () => {
  const result = leadSubmissionSchema.safeParse(
    validLead({ market: "uk", budgetRange: "us-10000-25000" }),
  );

  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0].path[0], "budgetRange");
  }
});

test("rejects unexpected fields rather than persisting them", () => {
  const result = leadSubmissionSchema.safeParse({
    ...validLead(),
    admin: true,
  });

  assert.equal(result.success, false);
});

test("requires current, timestamped advertising consent", () => {
  for (const overrides of [
    { advertisingConsent: true },
    { advertisingConsent: true, advertisingConsentUpdatedAt: "2026-08-14T12:00:00.000Z", consentPolicyVersion: "old-policy" },
  ] as const) {
    const result = leadSubmissionSchema.safeParse(validLead(overrides));
    assert.equal(result.success, false);
    if (!result.success) {
      assert.ok(result.error.issues.some((issue) => issue.path[0] === "advertisingConsent"));
    }
  }
});
