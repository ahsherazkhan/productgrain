import { z } from "zod";

export const markets = ["us", "uk", "international"] as const;
export const currentConsentPolicyVersion = "2026-08-14";

export const roles = [
  "business-owner",
  "founder",
  "executive",
  "consultant",
  "industry-professional",
  "product-operations",
  "technical-founder",
  "student-researcher",
  "other",
] as const;

export const projectTypes = [
  "b2b-saas",
  "internal-tool",
  "client-portal",
  "ai-application",
  "workflow-automation",
  "marketplace",
  "mobile-application",
  "existing-product-improvement",
  "not-sure",
  "other",
] as const;

export const aiExpectationLevels = [
  "ai-core",
  "ai-enhancement",
  "ai-exploratory",
  "ai-unsure",
  "ai-maybe-not-needed",
] as const;

export const discussionLevels = [
  "yes",
  "informal",
  "not-yet",
  "primary-user",
] as const;

export const userAccessLevels = [
  "yes",
  "probably",
  "not-currently",
  "not-applicable",
] as const;

export const problemImpacts = [
  "financial-loss",
  "manual-cost",
  "sales-delivery-delay",
  "business-risk",
  "moderate-inefficiency",
  "opportunity",
] as const;

export const productStages = [
  "existing-process",
  "existing-product",
  "validated-idea",
  "prototype",
  "early-idea",
] as const;

export const budgetRanges = [
  "us-under-2500",
  "us-2500-5000",
  "us-5000-10000",
  "us-10000-25000",
  "us-25000-50000",
  "us-above-50000",
  "uk-under-2000",
  "uk-2000-4000",
  "uk-4000-8000",
  "uk-8000-20000",
  "uk-20000-40000",
  "uk-above-40000",
  "not-sure",
] as const;

export const timelines = [
  "as-soon-as-possible",
  "within-one-month",
  "within-three-months",
  "within-six-months",
  "more-than-six-months",
  "exploring",
] as const;

export const decisionAuthorities = [
  "final-decision",
  "shared-decision",
  "researching-for-someone",
  "not-sure",
] as const;

const repeatedInlineWhitespace = /[\t ]+/g;
const repeatedBlankLines = /\n{3,}/g;

function stripControlCharacters(value: string): string {
  return Array.from(value)
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return (
        codePoint === 9 ||
        codePoint === 10 ||
        codePoint === 13 ||
        (codePoint >= 32 && codePoint !== 127)
      );
    })
    .join("");
}

export function normalizeText(value: string): string {
  return stripControlCharacters(value.normalize("NFKC"))
    .replace(/\r\n?/g, "\n")
    .replace(repeatedInlineWhitespace, " ")
    .replace(repeatedBlankLines, "\n\n")
    .trim();
}

function requiredText(min: number, max: number, label: string) {
  return z
    .string({ error: `${label} is required.` })
    .transform(normalizeText)
    .pipe(
      z
        .string()
        .min(min, `${label} is too short.`)
        .max(max, `${label} is too long.`),
    );
}

function optionalText(max: number) {
  return z
    .string()
    .max(max)
    .transform((value) => {
      const normalized = normalizeText(value);
      return normalized.length > 0 ? normalized : undefined;
    })
    .optional();
}

function requiredSingleLine(min: number, max: number, label: string) {
  return requiredText(min, max, label).transform((value) => value.replace(/\s*\n\s*/g, " "));
}

function optionalSingleLine(max: number) {
  return optionalText(max).transform((value) => value?.replace(/\s*\n\s*/g, " "));
}

const trackingValue = optionalText(200);
const pageValue = optionalText(500);

export const attributionSnapshotSchema = z
  .object({
    capturedAt: z.iso.datetime().optional(),
    landingPage: pageValue,
    referrer: pageValue,
    utmSource: trackingValue,
    utmMedium: trackingValue,
    utmCampaign: trackingValue,
    utmContent: trackingValue,
    utmTerm: trackingValue,
    fbclid: trackingValue,
  })
  .strict();

const phoneSchema = optionalText(40).refine(
  (value) => value === undefined || /^[+()\d\s.-]{6,40}$/.test(value),
  "Enter a valid phone number.",
);

const eventIdSchema = z
  .string()
  .trim()
  .min(8)
  .max(100)
  .regex(/^[A-Za-z0-9._:-]+$/)
  .optional();

export const leadSubmissionSchema = z
  .object({
    submissionId: z.uuid().optional(),
    fullName: requiredSingleLine(2, 100, "Full name"),
    email: z.email("Enter a valid work email.").max(254).transform((email) => email.toLowerCase()),
    phone: phoneSchema,
    company: optionalSingleLine(120),
    country: requiredSingleLine(2, 80, "Country"),
    market: z.enum(markets).default("international"),
    role: z.enum(roles),
    industry: requiredSingleLine(2, 120, "Industry"),
    projectType: z.enum(projectTypes),
    aiExpectation: z.enum(aiExpectationLevels).optional(),
    packageInterest: z.enum(["blueprint-prototype", "focused-mvp", "custom-product"]).optional(),
    problemDescription: requiredText(20, 2_000, "Problem description"),
    currentWorkaround: requiredText(2, 1_200, "Current workaround"),
    intendedUsers: requiredText(2, 800, "Intended users"),
    userDiscussions: z.enum(discussionLevels),
    userAccess: z.enum(userAccessLevels),
    problemImpact: z.enum(problemImpacts),
    productStage: z.enum(productStages),
    budgetRange: z.enum(budgetRanges),
    timeline: z.enum(timelines),
    decisionAuthority: z.enum(decisionAuthorities),
    landingPage: pageValue,
    referrer: pageValue,
    utmSource: trackingValue,
    utmMedium: trackingValue,
    utmCampaign: trackingValue,
    utmContent: trackingValue,
    utmTerm: trackingValue,
    fbclid: trackingValue,
    firstTouch: attributionSnapshotSchema.optional(),
    lastTouch: attributionSnapshotSchema.optional(),
    contactConsent: z.literal(true, {
      error: "Consent to reply to this enquiry is required.",
    }),
    marketingConsent: z.boolean().default(false),
    advertisingConsent: z.boolean().default(false),
    advertisingConsentUpdatedAt: z.iso.datetime().optional(),
    consentPolicyVersion: optionalText(40),
    turnstileToken: optionalText(2_048),
    eventId: eventIdSchema,
    fbp: trackingValue,
    fbc: trackingValue,
  })
  .strict()
  .superRefine((value, context) => {
    if (value.advertisingConsent && (!value.advertisingConsentUpdatedAt || value.consentPolicyVersion !== currentConsentPolicyVersion)) {
      context.addIssue({
        code: "custom",
        path: ["advertisingConsent"],
        message: "Advertising consent could not be verified.",
      });
    }
    if (value.market === "us" && value.budgetRange.startsWith("uk-")) {
      context.addIssue({
        code: "custom",
        path: ["budgetRange"],
        message: "Select a US budget range.",
      });
    }
    if (value.market === "uk" && value.budgetRange.startsWith("us-")) {
      context.addIssue({
        code: "custom",
        path: ["budgetRange"],
        message: "Select a UK budget range.",
      });
    }
  });

export type AttributionSnapshotInput = z.infer<typeof attributionSnapshotSchema>;
export type LeadSubmissionInput = z.infer<typeof leadSubmissionSchema>;

export const leadSubmissionResultSchema = z.object({
  leadId: z.uuid(),
  status: z.enum(["qualified", "review", "nurture"]),
  bookingUrl: z.url().refine((value) => new URL(value).protocol === "https:", "Invalid booking URL.").optional(),
  message: z.string().max(500).optional(),
}).strict().superRefine((value, context) => {
  if (value.status !== "qualified" && value.bookingUrl) {
    context.addIssue({ code: "custom", path: ["bookingUrl"], message: "Booking is available only for qualified results." });
  }
});

export type LeadSubmissionResult = z.infer<typeof leadSubmissionResultSchema>;

export type LeadValidationIssue = {
  field: string;
  message: string;
};

export function publicValidationIssues(error: z.ZodError): LeadValidationIssue[] {
  return error.issues.slice(0, 20).map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));
}
