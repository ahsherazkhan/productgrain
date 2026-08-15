import type { LeadSubmissionInput } from "../../src/lib/validation/lead";

export function validLead(
  overrides: Partial<LeadSubmissionInput> = {},
): LeadSubmissionInput {
  return {
    fullName: "Alex Morgan",
    email: "alex@example.com",
    market: "us",
    problemDescription:
      "Our team repeatedly transfers the same project details between disconnected systems.",
    budgetRange: "us-25000-50000",
    timeline: "within-one-month",
    contactConsent: true,
    marketingConsent: false,
    advertisingConsent: false,
    ...overrides,
  };
}

export function enrichedLead(
  overrides: Partial<LeadSubmissionInput> = {},
): LeadSubmissionInput {
  return validLead({
    submissionId: "55a9a252-522e-4b50-8da7-f1e812c1ef32",
    phone: "+1 555 123 4567",
    company: "Example Works",
    country: "United States",
    role: "founder",
    industry: "Professional services",
    projectType: "workflow-automation",
    aiExpectation: "ai-enhancement",
    packageInterest: "focused-mvp",
    currentWorkaround:
      "The operations team copies information between spreadsheets.",
    intendedUsers: "Operations managers and client delivery teams.",
    userDiscussions: "yes",
    userAccess: "yes",
    problemImpact: "manual-cost",
    productStage: "existing-process",
    decisionAuthority: "final-decision",
    landingPage: "/mvp-development/us?utm_source=meta",
    referrer: "https://example.org/article",
    utmSource: "meta",
    utmMedium: "paid-social",
    utmCampaign: "workflow-2026",
    ...overrides,
  });
}
