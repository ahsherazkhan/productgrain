import assert from "node:assert/strict";
import test from "node:test";

import { leadSubmissionSchema } from "../../src/lib/validation/lead";
import { validLead } from "../fixtures/lead";

test("accepts and normalizes a complete application", () => {
  const result = leadSubmissionSchema.parse(
    validLead({
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
  const result = leadSubmissionSchema.parse(validLead({
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
    problemDescription: "x".repeat(2_001),
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
