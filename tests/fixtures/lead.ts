import type { LeadSubmissionInput } from "../../src/lib/validation/lead";

export function validLead(
  overrides: Partial<LeadSubmissionInput> = {},
): LeadSubmissionInput {
  return {
    submissionId: "55a9a252-522e-4b50-8da7-f1e812c1ef32",
    fullName: "Alex Morgan",
    email: "alex@example.com",
    phone: "+1 555 123 4567",
    company: "Example Works",
    country: "United States",
    market: "us",
    role: "founder",
    industry: "Professional services",
    projectType: "workflow-automation",
    problemDescription:
      "Our team repeatedly transfers the same project details between disconnected systems.",
    currentWorkaround: "The operations team copies information between spreadsheets.",
    intendedUsers: "Operations managers and client delivery teams.",
    userDiscussions: "yes",
    userAccess: "yes",
    problemImpact: "manual-cost",
    productStage: "existing-process",
    budgetRange: "us-25000-50000",
    timeline: "within-one-month",
    decisionAuthority: "final-decision",
    landingPage: "/mvp-development/us?utm_source=meta",
    referrer: "https://example.org/article",
    utmSource: "meta",
    utmMedium: "paid-social",
    utmCampaign: "workflow-2026",
    contactConsent: true,
    marketingConsent: false,
    advertisingConsent: false,
    ...overrides,
  };
}
