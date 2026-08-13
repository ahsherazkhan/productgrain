import { attributionFromLeadInput } from "../attribution";
import { emailStatusMessage, sendLeadEmails, type EmailService } from "../email";
import { calculateLeadScore } from "../scoring";
import { buildBookingUrl, integrationErrorCode } from "../security";
import {
  leadSubmissionSchema,
  publicValidationIssues,
  type LeadValidationIssue,
} from "../validation";
import type {
  LeadAnalyticsSink,
  LeadNotificationSink,
  LeadRecord,
  LeadRepository,
  LeadSubmissionContext,
  LeadSubmissionResult,
} from "./types";

export type LeadSubmissionDependencies = {
  repository: LeadRepository;
  verifyHuman?: (token: string | undefined, clientIp?: string) => Promise<boolean>;
  emailService?: EmailService;
  internalLeadEmail?: string;
  crmSink?: LeadNotificationSink;
  analyticsSink?: LeadAnalyticsSink;
  bookingUrls?: {
    us?: string;
    uk?: string;
    default?: string;
  };
  retentionDays?: number;
  now?: () => Date;
  createId?: () => string;
  onOptionalFailure?: (service: "email" | "crm" | "meta", code: string) => void;
};

export class LeadSubmissionError extends Error {
  constructor(
    public readonly code:
      | "invalid-payload"
      | "human-verification-failed"
      | "storage-failed",
    public readonly validationIssues?: LeadValidationIssue[],
  ) {
    super(code);
    this.name = "LeadSubmissionError";
  }
}

function retentionDate(now: Date, requestedDays: number | undefined): string {
  const days = Math.min(3_650, Math.max(30, requestedDays ?? 365));
  return new Date(now.getTime() + days * 86_400_000).toISOString();
}

function bookingDestination(
  market: "us" | "uk" | "international",
  urls: LeadSubmissionDependencies["bookingUrls"],
): string | undefined {
  if (market === "us") return urls?.us ?? urls?.default;
  if (market === "uk") return urls?.uk ?? urls?.default;
  return urls?.default;
}

export async function submitLeadApplication(
  rawInput: unknown,
  dependencies: LeadSubmissionDependencies,
  context: LeadSubmissionContext = {},
): Promise<LeadSubmissionResult> {
  const parsed = leadSubmissionSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new LeadSubmissionError(
      "invalid-payload",
      publicValidationIssues(parsed.error),
    );
  }
  const input = parsed.data;

  if (dependencies.verifyHuman) {
    const verified = await dependencies.verifyHuman(
      input.turnstileToken,
      context.clientIp,
    );
    if (!verified) throw new LeadSubmissionError("human-verification-failed");
  }

  const now = dependencies.now?.() ?? new Date();
  const id = dependencies.createId?.() ?? crypto.randomUUID();
  const submissionId = input.submissionId ?? id;
  const score = calculateLeadScore(input);
  const attribution = attributionFromLeadInput(input, now);
  const { eventId, fbp, fbc } = input;
  const leadFields = { ...input };
  delete leadFields.turnstileToken;
  delete leadFields.eventId;
  delete leadFields.fbp;
  delete leadFields.fbc;
  delete leadFields.firstTouch;
  delete leadFields.lastTouch;
  delete leadFields.submissionId;

  const lead: LeadRecord = {
    ...leadFields,
    landingPage:
      attribution.lastTouch.landingPage ?? attribution.firstTouch.landingPage,
    referrer:
      attribution.lastTouch.referrer ?? attribution.firstTouch.referrer,
    utmSource:
      leadFields.utmSource ?? attribution.lastTouch.utmSource ?? attribution.firstTouch.utmSource,
    utmMedium:
      leadFields.utmMedium ?? attribution.lastTouch.utmMedium ?? attribution.firstTouch.utmMedium,
    utmCampaign:
      leadFields.utmCampaign ??
      attribution.lastTouch.utmCampaign ??
      attribution.firstTouch.utmCampaign,
    utmContent:
      leadFields.utmContent ?? attribution.lastTouch.utmContent ?? attribution.firstTouch.utmContent,
    utmTerm:
      leadFields.utmTerm ?? attribution.lastTouch.utmTerm ?? attribution.firstTouch.utmTerm,
    fbclid:
      leadFields.fbclid ?? attribution.lastTouch.fbclid ?? attribution.firstTouch.fbclid,
    id,
    submissionId,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    score: score.total,
    scoreBreakdown: score.breakdown,
    qualificationStatus: score.status,
    leadStatus: "new",
    firstTouch: attribution.firstTouch,
    lastTouch: attribution.lastTouch,
    retentionUntil: retentionDate(now, dependencies.retentionDays),
  };

  let stored: { id: string };
  try {
    stored = await dependencies.repository.save(lead);
  } catch {
    throw new LeadSubmissionError("storage-failed");
  }

  const storedLead = stored.id === lead.id ? lead : { ...lead, id: stored.id };
  const bookingUrl =
    score.status === "qualified"
      ? buildBookingUrl(
          bookingDestination(input.market, dependencies.bookingUrls),
          stored.id,
        )
      : undefined;

  const emailPromise = sendLeadEmails({
    service: dependencies.emailService,
    lead: storedLead,
    bookingUrl,
    internalAddress: dependencies.internalLeadEmail,
  }).then((failures) => {
    for (const failure of failures) {
      dependencies.onOptionalFailure?.(
        "email",
        integrationErrorCode(failure.error),
      );
    }
  });

  const crmPromise = dependencies.crmSink
    ? dependencies.crmSink.send(storedLead)
    : Promise.resolve();
  const analyticsPromise = dependencies.analyticsSink
    ? dependencies.analyticsSink.trackLead({
        lead: storedLead,
        eventId: eventId ?? `lead:${stored.id}`,
        eventSourceUrl: context.eventSourceUrl,
        fbp,
        fbc,
        clientIp: context.clientIp,
        userAgent: context.userAgent,
      })
    : Promise.resolve();

  const [, crmResult, analyticsResult] = await Promise.allSettled([
    emailPromise,
    crmPromise,
    analyticsPromise,
  ]);
  if (crmResult.status === "rejected") {
    dependencies.onOptionalFailure?.(
      "crm",
      integrationErrorCode(crmResult.reason),
    );
  }
  if (analyticsResult.status === "rejected") {
    dependencies.onOptionalFailure?.(
      "meta",
      integrationErrorCode(analyticsResult.reason),
    );
  }

  return {
    leadId: stored.id,
    status: score.status,
    bookingUrl,
    message: emailStatusMessage(score.status),
  };
}
