import { hmacSha256Hex, IntegrationError, safeExternalUrl } from "../security";
import type {
  LeadNotificationSink,
  LeadRecord,
  LeadRepository,
} from "./types";

type Fetcher = typeof fetch;

function databaseRecord(lead: LeadRecord): Record<string, unknown> {
  return {
    id: lead.id,
    submission_id: lead.submissionId,
    created_at: lead.createdAt,
    updated_at: lead.updatedAt,
    full_name: lead.fullName,
    email: lead.email,
    phone: lead.phone ?? null,
    company: lead.company ?? null,
    country: lead.country,
    market: lead.market,
    role: lead.role,
    industry: lead.industry,
    project_type: lead.projectType,
    package_interest: lead.packageInterest ?? null,
    problem_description: lead.problemDescription,
    current_workaround: lead.currentWorkaround,
    intended_users: lead.intendedUsers,
    user_discussions: lead.userDiscussions,
    user_access: lead.userAccess,
    problem_impact: lead.problemImpact,
    product_stage: lead.productStage,
    budget_range: lead.budgetRange,
    timeline: lead.timeline,
    decision_authority: lead.decisionAuthority,
    score: lead.score,
    score_breakdown_json: lead.scoreBreakdown,
    qualification_status: lead.qualificationStatus,
    lead_status: lead.leadStatus,
    landing_page: lead.landingPage ?? null,
    referrer: lead.referrer ?? null,
    utm_source: lead.utmSource ?? null,
    utm_medium: lead.utmMedium ?? null,
    utm_campaign: lead.utmCampaign ?? null,
    utm_content: lead.utmContent ?? null,
    utm_term: lead.utmTerm ?? null,
    fbclid: lead.fbclid ?? null,
    first_touch_json: lead.firstTouch,
    last_touch_json: lead.lastTouch,
    contact_consent: lead.contactConsent,
    marketing_consent: lead.marketingConsent,
    advertising_consent: lead.advertisingConsent,
    advertising_consent_updated_at: lead.advertisingConsentUpdatedAt ?? null,
    consent_policy_version: lead.consentPolicyVersion ?? null,
    retention_until: lead.retentionUntil,
  };
}

export class SupabaseLeadRepository implements LeadRepository {
  private readonly baseEndpoint: URL;
  private readonly endpoint: URL;

  constructor(
    baseUrl: string,
    private readonly serviceRoleKey: string,
    private readonly fetcher: Fetcher = fetch,
  ) {
    const verified = safeExternalUrl(baseUrl);
    if (!verified || !serviceRoleKey) {
      throw new IntegrationError("storage", "invalid-supabase-configuration");
    }
    this.baseEndpoint = new URL("/rest/v1/leads", verified);
    this.endpoint = new URL(this.baseEndpoint);
    this.endpoint.searchParams.set("on_conflict", "submission_id");
    this.endpoint.searchParams.set("select", "id");
  }

  async save(lead: LeadRecord): Promise<{ id: string }> {
    let response: Response;
    try {
      response = await this.fetcher(this.endpoint, {
        method: "POST",
        headers: {
          apikey: this.serviceRoleKey,
          authorization: `Bearer ${this.serviceRoleKey}`,
          "content-type": "application/json",
          prefer: "resolution=ignore-duplicates,return=representation",
        },
        body: JSON.stringify(databaseRecord(lead)),
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new IntegrationError("storage", "request-failed");
    }

    if (!response.ok) {
      throw new IntegrationError("storage", `http-${response.status}`);
    }

    try {
      const rows = (await response.json()) as Array<{ id?: unknown }>;
      const id = rows[0]?.id;
      if (typeof id === "string") return { id };
    } catch {
      // An ignored duplicate may have an empty or non-JSON response.
    }

    return { id: await this.findExistingId(lead.submissionId) };
  }

  private async findExistingId(submissionId: string): Promise<string> {
    const endpoint = new URL(this.baseEndpoint);
    endpoint.searchParams.set("submission_id", `eq.${submissionId}`);
    endpoint.searchParams.set("select", "id");
    endpoint.searchParams.set("limit", "1");
    try {
      const response = await this.fetcher(endpoint, {
        headers: {
          apikey: this.serviceRoleKey,
          authorization: `Bearer ${this.serviceRoleKey}`,
        },
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) {
        throw new IntegrationError("storage", `lookup-http-${response.status}`);
      }
      const rows = (await response.json()) as Array<{ id?: unknown }>;
      if (typeof rows[0]?.id === "string") return rows[0].id;
    } catch (error) {
      if (error instanceof IntegrationError) throw error;
      throw new IntegrationError("storage", "duplicate-lookup-failed");
    }
    throw new IntegrationError("storage", "duplicate-not-found");
  }
}

export class SignedWebhookLeadRepository implements LeadRepository {
  private readonly endpoint: URL;

  constructor(
    endpoint: string,
    private readonly secret: string | undefined,
    private readonly fetcher: Fetcher = fetch,
    private readonly service: "storage" | "crm" = "storage",
  ) {
    const verified = safeExternalUrl(endpoint, {
      allowLocalhost: process.env.NODE_ENV !== "production",
    });
    if (!verified || !secret) {
      throw new IntegrationError(service, "invalid-webhook-configuration");
    }
    this.endpoint = verified;
  }

  async save(lead: LeadRecord): Promise<{ id: string }> {
    const body = JSON.stringify({ type: "lead.created", lead: databaseRecord(lead) });
    const headers: Record<string, string> = {
      "content-type": "application/json",
      "idempotency-key": lead.submissionId,
    };
    if (this.secret) {
      const signature = await hmacSha256Hex(this.secret, body);
      headers["x-needfoundry-signature"] = `sha256=${signature}`;
    }

    let response: Response;
    try {
      response = await this.fetcher(this.endpoint, {
        method: "POST",
        headers,
        body,
        signal: AbortSignal.timeout(10_000),
      });
    } catch {
      throw new IntegrationError(this.service, "request-failed");
    }
    if (!response.ok) {
      throw new IntegrationError(this.service, `http-${response.status}`);
    }
    return { id: lead.id };
  }
}

export class CrmWebhookSink implements LeadNotificationSink {
  private readonly repository: SignedWebhookLeadRepository;

  constructor(endpoint: string, secret?: string, fetcher: Fetcher = fetch) {
    this.repository = new SignedWebhookLeadRepository(
      endpoint,
      secret,
      fetcher,
      "crm",
    );
  }

  async send(lead: LeadRecord): Promise<void> {
    await this.repository.save(lead);
  }
}

export class MemoryLeadRepository implements LeadRepository {
  readonly records: LeadRecord[] = [];

  async save(lead: LeadRecord): Promise<{ id: string }> {
    const existing = this.records.find(
      (record) => record.submissionId === lead.submissionId,
    );
    if (!existing) this.records.push(lead);
    return { id: existing?.id ?? lead.id };
  }
}
