import { IntegrationError, safeExternalUrl } from "../security";
import type { LeadAnalyticsSink, LeadRecord } from "../leads/types";

export const metaEventNames = [
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

export type MetaEventName = (typeof metaEventNames)[number];

export type MetaEvent = {
  eventName: MetaEventName;
  eventId: string;
  eventSourceUrl?: string;
  eventTime?: Date;
  email?: string;
  externalId?: string;
  fbp?: string;
  fbc?: string;
  clientIp?: string;
  userAgent?: string;
  customData?: Record<string, string | number | boolean>;
};

export type MetaSendResult = {
  sent: boolean;
  reason?: "not-configured" | "no-consent";
};

async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value.trim().toLowerCase());
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function safeEventSourceUrl(value: string | undefined): string | undefined {
  const url = safeExternalUrl(value, {
    allowLocalhost: process.env.NODE_ENV !== "production",
  });
  if (url) {
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
  }
  return url?.toString();
}

export class MetaConversionsClient {
  private readonly endpoint?: URL;

  constructor(
    datasetId: string | undefined,
    private readonly accessToken: string | undefined,
    private readonly testEventCode?: string,
    private readonly fetcher: typeof fetch = fetch,
    graphVersion = "v23.0",
  ) {
    if (datasetId && accessToken && /^\d+$/.test(datasetId)) {
      const version = /^v\d+\.\d+$/.test(graphVersion) ? graphVersion : "v23.0";
      this.endpoint = new URL(
        `https://graph.facebook.com/${version}/${datasetId}/events`,
      );
    }
  }

  get configured(): boolean {
    return Boolean(this.endpoint && this.accessToken);
  }

  async send(
    event: MetaEvent,
    marketingConsent: boolean,
  ): Promise<MetaSendResult> {
    if (!marketingConsent) return { sent: false, reason: "no-consent" };
    if (!this.endpoint) return { sent: false, reason: "not-configured" };

    const userData: Record<string, string | string[]> = {};
    if (event.email) userData.em = [await sha256(event.email)];
    if (event.externalId) userData.external_id = [await sha256(event.externalId)];
    if (event.fbp) userData.fbp = event.fbp;
    if (event.fbc) userData.fbc = event.fbc;
    if (event.clientIp) userData.client_ip_address = event.clientIp;
    if (event.userAgent) userData.client_user_agent = event.userAgent.slice(0, 500);

    const eventData = {
      event_name: event.eventName,
      event_time: Math.floor((event.eventTime ?? new Date()).getTime() / 1_000),
      event_id: event.eventId,
      event_source_url: safeEventSourceUrl(event.eventSourceUrl),
      action_source: "website",
      user_data: userData,
      custom_data: event.customData,
    };
    const body: Record<string, unknown> = { data: [eventData] };
    if (this.testEventCode) body.test_event_code = this.testEventCode;

    let response: Response;
    try {
      response = await this.fetcher(this.endpoint, {
        method: "POST",
        headers: {
          authorization: `Bearer ${this.accessToken}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8_000),
      });
    } catch {
      throw new IntegrationError("meta", "request-failed");
    }
    if (!response.ok) {
      throw new IntegrationError("meta", `http-${response.status}`);
    }
    return { sent: true };
  }
}

export class MetaLeadAnalyticsSink implements LeadAnalyticsSink {
  constructor(private readonly client: MetaConversionsClient) {}

  async trackLead(input: {
    lead: LeadRecord;
    eventId: string;
    eventSourceUrl?: string;
    fbp?: string;
    fbc?: string;
    clientIp?: string;
    userAgent?: string;
  }): Promise<void> {
    if (!input.lead.advertisingConsent) return;

    const common: Omit<MetaEvent, "eventName" | "eventId"> = {
      eventSourceUrl: input.eventSourceUrl,
      email: input.lead.email,
      externalId: input.lead.id,
      fbp: input.fbp,
      fbc: input.fbc,
      clientIp: input.clientIp,
      userAgent: input.userAgent,
      customData: {
        market: input.lead.market,
        qualification_status: input.lead.qualificationStatus,
      },
    };

    await this.client.send(
      { ...common, eventName: "Lead", eventId: input.eventId },
      true,
    );
    if (input.lead.qualificationStatus === "qualified") {
      await this.client.send(
        {
          ...common,
          eventName: "QualifiedLead",
          eventId: input.eventId,
        },
        true,
      );
    }
  }
}
