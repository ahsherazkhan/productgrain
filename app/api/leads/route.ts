import { MetaConversionsClient, MetaLeadAnalyticsSink } from "@/src/lib/analytics";
import { ResendEmailService } from "@/src/lib/email";
import {
  CrmWebhookSink,
  SignedWebhookLeadRepository,
  submitLeadApplication,
  SupabaseLeadRepository,
  type LeadRepository,
} from "@/src/lib/leads";
import {
  InMemoryRateLimiter,
  IntegrationError,
  readLimitedJson,
  requestClientKey,
  RequestBodyError,
  verifyTurnstile,
} from "@/src/lib/security";
import { LeadSubmissionError } from "@/src/lib/leads/service";

export const runtime = "edge";

function positiveInteger(value: string | undefined, fallback: number): number {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : fallback;
}

const rateLimiter = new InMemoryRateLimiter(
  positiveInteger(process.env.LEAD_RATE_LIMIT_MAX_REQUESTS, 5),
  positiveInteger(process.env.LEAD_RATE_LIMIT_WINDOW_SECONDS, 60) * 1_000,
);

function json(body: unknown, status: number, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
      ...headers,
    },
  });
}

function createRepository(): LeadRepository {
  const provider = (process.env.LEAD_STORAGE_PROVIDER ?? "supabase").toLowerCase();
  if (provider === "supabase") {
    return new SupabaseLeadRepository(
      process.env.SUPABASE_URL ?? "",
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    );
  }
  if (provider === "webhook") {
    return new SignedWebhookLeadRepository(
      process.env.CRM_WEBHOOK_URL ?? "",
      process.env.CRM_WEBHOOK_SECRET,
    );
  }
  throw new IntegrationError("storage", "unknown-provider");
}

function optionalEmailService(): ResendEmailService | undefined {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) return undefined;
  try {
    return new ResendEmailService(
      process.env.RESEND_API_KEY,
      process.env.EMAIL_FROM,
    );
  } catch {
    return undefined;
  }
}

function optionalCrmSink(storageProvider: string) {
  if (storageProvider === "webhook" || !process.env.CRM_WEBHOOK_URL) {
    return undefined;
  }
  try {
    return new CrmWebhookSink(
      process.env.CRM_WEBHOOK_URL,
      process.env.CRM_WEBHOOK_SECRET,
    );
  } catch {
    return undefined;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return json({ error: "Content-Type must be application/json." }, 415);
  }
  if (process.env.NODE_ENV === "production" && (!process.env.TURNSTILE_SECRET_KEY || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)) {
    return json({ error: "Applications are temporarily unavailable. Please try again later." }, 503);
  }
  const clientKey = requestClientKey(request);
  const rateLimit = rateLimiter.check(clientKey);
  if (!rateLimit.allowed) {
    return json(
      { error: "Too many requests. Please wait before trying again." },
      429,
      { "retry-after": String(rateLimit.retryAfterSeconds) },
    );
  }

  let rawInput: unknown;
  try {
    rawInput = await readLimitedJson(request);
  } catch (error) {
    if (error instanceof RequestBodyError) {
      return json(
        { error: error.message },
        error.code === "payload-too-large" ? 413 : 400,
      );
    }
    return json({ error: "Unable to read the request." }, 400);
  }

  let repository: LeadRepository;
  try {
    repository = createRepository();
  } catch {
    return json(
      { error: "Applications are temporarily unavailable. Please try again later." },
      503,
    );
  }

  const storageProvider = (
    process.env.LEAD_STORAGE_PROVIDER ?? "supabase"
  ).toLowerCase();
  const metaClient = new MetaConversionsClient(
    process.env.META_DATASET_ID,
    process.env.META_ACCESS_TOKEN,
    process.env.META_TEST_EVENT_CODE,
    fetch,
    process.env.META_API_VERSION,
  );

  try {
    const result = await submitLeadApplication(
      rawInput,
      {
        repository,
        verifyHuman: async (token, clientIp) => {
          const result = await verifyTurnstile({
            token,
            remoteIp: clientIp,
            secret: process.env.TURNSTILE_SECRET_KEY,
          });
          return result.success;
        },
        emailService: optionalEmailService(),
        internalLeadEmail: process.env.INTERNAL_LEAD_EMAIL,
        crmSink: optionalCrmSink(storageProvider),
        analyticsSink: new MetaLeadAnalyticsSink(metaClient),
        bookingUrls: {
          us: process.env.BOOKING_URL_US ?? process.env.NEXT_PUBLIC_BOOKING_URL_US,
          uk: process.env.BOOKING_URL_UK ?? process.env.NEXT_PUBLIC_BOOKING_URL_UK,
          default:
            process.env.BOOKING_URL_DEFAULT ??
            process.env.NEXT_PUBLIC_BOOKING_URL_DEFAULT,
        },
        retentionDays: positiveInteger(process.env.LEAD_RETENTION_DAYS, 365),
        onOptionalFailure(service, code) {
          console.error("Optional lead integration failed.", { service, code });
        },
      },
      {
        clientIp: clientKey,
        userAgent: request.headers.get("user-agent")?.slice(0, 500),
        eventSourceUrl: request.headers.get("referer") ?? undefined,
      },
    );
    return json(result, 201);
  } catch (error) {
    if (error instanceof LeadSubmissionError) {
      if (error.code === "invalid-payload") {
        return json(
          {
            error: "Please check the highlighted fields.",
            issues: error.validationIssues,
          },
          422,
        );
      }
      if (error.code === "human-verification-failed") {
        return json(
          { error: "Verification failed. Please refresh and try again." },
          400,
        );
      }
    }
    return json(
      { error: "We could not save your application. Please try again later." },
      503,
    );
  }
}
