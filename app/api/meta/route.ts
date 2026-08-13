import { MetaConversionsClient } from "@/src/lib/analytics";
import {
  InMemoryRateLimiter,
  readLimitedJson,
  requestClientKey,
  RequestBodyError,
} from "@/src/lib/security";
import { metaEventSchema, publicValidationIssues } from "@/src/lib/validation";

export const runtime = "edge";

const rateLimiter = new InMemoryRateLimiter(30, 60_000);

function json(body: unknown, status: number, headers?: HeadersInit): Response {
  return Response.json(body, {
    status,
    headers: { "cache-control": "no-store", ...headers },
  });
}

export async function POST(request: Request): Promise<Response> {
  const clientKey = requestClientKey(request);
  const rateLimit = rateLimiter.check(clientKey);
  if (!rateLimit.allowed) {
    return json(
      { error: "Too many events." },
      429,
      { "retry-after": String(rateLimit.retryAfterSeconds) },
    );
  }

  let rawInput: unknown;
  try {
    rawInput = await readLimitedJson(request, 8 * 1024);
  } catch (error) {
    const status =
      error instanceof RequestBodyError && error.code === "payload-too-large"
        ? 413
        : 400;
    return json({ error: "Invalid event payload." }, status);
  }

  const parsed = metaEventSchema.safeParse(rawInput);
  if (!parsed.success) {
    return json(
      {
        error: "Invalid event payload.",
        issues: publicValidationIssues(parsed.error),
      },
      422,
    );
  }

  const client = new MetaConversionsClient(
    process.env.META_DATASET_ID,
    process.env.META_ACCESS_TOKEN,
    process.env.META_TEST_EVENT_CODE,
    fetch,
    process.env.META_API_VERSION,
  );
  try {
    await client.send(
      {
        eventName: parsed.data.eventName,
        eventId: parsed.data.eventId,
        eventSourceUrl: parsed.data.eventSourceUrl,
        externalId: parsed.data.leadId,
        fbp: parsed.data.fbp,
        fbc: parsed.data.fbc,
        clientIp: clientKey,
        userAgent: request.headers.get("user-agent")?.slice(0, 500),
        customData: parsed.data.market ? { market: parsed.data.market } : undefined,
      },
      parsed.data.marketingConsent,
    );
    return json({ accepted: true }, 202);
  } catch {
    // Analytics must never interrupt the site journey.
    return json({ accepted: true }, 202);
  }
}
