import type { MarketKey } from "./markets";

export const leadStorageProviders = ["supabase", "webhook"] as const;
export type LeadStorageProvider = (typeof leadStorageProviders)[number];

export const metaEvents = [
  "PageView",
  "ViewContent",
  "LeadFormStart",
  "Lead",
  "QualifiedLead",
  "Schedule",
  "Contact",
  "ProposalRequested",
  "ClientWon",
] as const;
export type MetaEventName = (typeof metaEvents)[number];

export const analyticsEvents = [
  "page_view",
  "pricing_view",
  "form_start",
  "form_step_complete",
  "lead_submitted",
  "qualified_lead",
  "booking_view",
  "booking_click",
  "case_study_view",
  "cta_click",
] as const;
export type AnalyticsEventName = (typeof analyticsEvents)[number];

export const integrationEnvironmentVariables = {
  public: {
    siteUrl: "NEXT_PUBLIC_SITE_URL",
    defaultMarket: "NEXT_PUBLIC_MARKET_DEFAULT",
    bookingUrlDefault: "NEXT_PUBLIC_BOOKING_URL_DEFAULT",
    bookingUrlUs: "NEXT_PUBLIC_BOOKING_URL_US",
    bookingUrlUk: "NEXT_PUBLIC_BOOKING_URL_UK",
    turnstileSiteKey: "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
    metaPixelId: "NEXT_PUBLIC_META_PIXEL_ID",
    gaMeasurementId: "NEXT_PUBLIC_GA_MEASUREMENT_ID",
    founderLinkedIn: "NEXT_PUBLIC_FOUNDER_LINKEDIN",
    companyLinkedIn: "NEXT_PUBLIC_COMPANY_LINKEDIN",
    contactEmail: "NEXT_PUBLIC_CONTACT_EMAIL",
  },
  server: {
    bookingUrlDefault: "BOOKING_URL_DEFAULT",
    bookingUrlUs: "BOOKING_URL_US",
    bookingUrlUk: "BOOKING_URL_UK",
    leadStorageProvider: "LEAD_STORAGE_PROVIDER",
    supabaseUrl: "SUPABASE_URL",
    supabaseServiceRoleKey: "SUPABASE_SERVICE_ROLE_KEY",
    crmWebhookUrl: "CRM_WEBHOOK_URL",
    crmWebhookSecret: "CRM_WEBHOOK_SECRET",
    resendApiKey: "RESEND_API_KEY",
    emailFrom: "EMAIL_FROM",
    internalLeadEmail: "INTERNAL_LEAD_EMAIL",
    turnstileSecretKey: "TURNSTILE_SECRET_KEY",
    metaAccessToken: "META_ACCESS_TOKEN",
    metaDatasetId: "META_DATASET_ID",
    metaTestEventCode: "META_TEST_EVENT_CODE",
  },
} as const;

export const integrationConfig = {
  leadStorage: {
    defaultProvider: "supabase" as LeadStorageProvider,
    supportedProviders: leadStorageProviders,
  },
  email: {
    provider: "resend",
    failWithoutLosingLead: true,
  },
  spamProtection: {
    provider: "cloudflare-turnstile",
    verifyServerSide: true,
  },
  booking: {
    provider: "external",
    qualifiedLeadsOnly: true,
    defaultEnvironmentVariable:
      integrationEnvironmentVariables.server.bookingUrlDefault,
    environmentVariableByMarket: {
      uk: integrationEnvironmentVariables.server.bookingUrlUk,
      us: integrationEnvironmentVariables.server.bookingUrlUs,
    } satisfies Record<MarketKey, string>,
  },
  meta: {
    browserAndServerEvents: true,
    deduplicateWithSharedEventId: true,
    requiresMarketingConsent: true,
    events: metaEvents,
  },
  analytics: {
    requiresAnalyticsConsent: true,
    events: analyticsEvents,
  },
} as const;

export function isLeadStorageProvider(
  value: unknown,
): value is LeadStorageProvider {
  return (
    typeof value === "string" &&
    leadStorageProviders.includes(value as LeadStorageProvider)
  );
}
