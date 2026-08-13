import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const leads = sqliteTable(
  "leads",
  {
    id: text("id").primaryKey(),
    submissionId: text("submission_id").notNull(),
    createdAt: text("created_at").notNull(),
    updatedAt: text("updated_at").notNull(),
    fullName: text("full_name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    company: text("company"),
    country: text("country").notNull(),
    market: text("market").notNull(),
    role: text("role").notNull(),
    industry: text("industry").notNull(),
    projectType: text("project_type").notNull(),
    packageInterest: text("package_interest"),
    problemDescription: text("problem_description").notNull(),
    currentWorkaround: text("current_workaround").notNull(),
    intendedUsers: text("intended_users").notNull(),
    userDiscussions: text("user_discussions").notNull(),
    userAccess: text("user_access").notNull(),
    problemImpact: text("problem_impact").notNull(),
    productStage: text("product_stage").notNull(),
    budgetRange: text("budget_range").notNull(),
    timeline: text("timeline").notNull(),
    decisionAuthority: text("decision_authority").notNull(),
    score: integer("score").notNull(),
    scoreBreakdownJson: text("score_breakdown_json", { mode: "json" })
      .$type<Record<string, number>>()
      .notNull(),
    qualificationStatus: text("qualification_status").notNull(),
    leadStatus: text("lead_status").notNull().default("new"),
    landingPage: text("landing_page"),
    referrer: text("referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    fbclid: text("fbclid"),
    firstTouchJson: text("first_touch_json", { mode: "json" })
      .$type<Record<string, unknown>>()
      .notNull(),
    lastTouchJson: text("last_touch_json", { mode: "json" })
      .$type<Record<string, unknown>>()
      .notNull(),
    contactConsent: integer("contact_consent", { mode: "boolean" }).notNull(),
    marketingConsent: integer("marketing_consent", { mode: "boolean" })
      .notNull()
      .default(false),
    advertisingConsent: integer("advertising_consent", { mode: "boolean" })
      .notNull()
      .default(false),
    advertisingConsentUpdatedAt: text("advertising_consent_updated_at"),
    consentPolicyVersion: text("consent_policy_version"),
    retentionUntil: text("retention_until").notNull(),
  },
  (table) => [
    uniqueIndex("leads_submission_id_unique").on(table.submissionId),
    index("leads_created_at_idx").on(table.createdAt),
    index("leads_qualification_status_idx").on(table.qualificationStatus),
    index("leads_retention_until_idx").on(table.retentionUntil),
  ],
);
