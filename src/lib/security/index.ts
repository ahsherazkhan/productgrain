const DEFAULT_MAX_BODY_BYTES = 32 * 1024;

export class RequestBodyError extends Error {
  constructor(
    public readonly code: "invalid-json" | "payload-too-large",
    message: string,
  ) {
    super(message);
    this.name = "RequestBodyError";
  }
}

export async function readLimitedJson(
  request: Request,
  maxBytes = DEFAULT_MAX_BODY_BYTES,
): Promise<unknown> {
  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (Number.isFinite(contentLength) && contentLength > maxBytes) {
    throw new RequestBodyError("payload-too-large", "Request body is too large.");
  }

  const body = await request.text();
  if (new TextEncoder().encode(body).byteLength > maxBytes) {
    throw new RequestBodyError("payload-too-large", "Request body is too large.");
  }

  try {
    return JSON.parse(body) as unknown;
  } catch {
    throw new RequestBodyError("invalid-json", "Request body must be valid JSON.");
  }
}

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

export interface RateLimiter {
  check(key: string, now?: number): RateLimitResult;
}

export class InMemoryRateLimiter implements RateLimiter {
  private readonly attempts = new Map<string, number[]>();

  constructor(
    private readonly maxAttempts = 5,
    private readonly windowMilliseconds = 60_000,
    private readonly maxKeys = 10_000,
  ) {}

  check(key: string, now = Date.now()): RateLimitResult {
    if (this.attempts.size >= this.maxKeys && !this.attempts.has(key)) {
      this.removeExpiredKeys(now);
    }

    const windowStart = now - this.windowMilliseconds;
    const recent = (this.attempts.get(key) ?? []).filter(
      (timestamp) => timestamp > windowStart,
    );

    if (recent.length >= this.maxAttempts) {
      const retryAfterMilliseconds = recent[0] + this.windowMilliseconds - now;
      this.attempts.set(key, recent);
      return {
        allowed: false,
        retryAfterSeconds: Math.max(1, Math.ceil(retryAfterMilliseconds / 1_000)),
      };
    }

    recent.push(now);
    this.attempts.set(key, recent);
    return { allowed: true, retryAfterSeconds: 0 };
  }

  private removeExpiredKeys(now: number): void {
    const windowStart = now - this.windowMilliseconds;
    for (const [key, timestamps] of this.attempts) {
      if (timestamps.every((timestamp) => timestamp <= windowStart)) {
        this.attempts.delete(key);
      }
    }
  }
}

export function requestClientKey(request: Request): string {
  const candidate =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0] ??
    "unknown";
  const normalized = candidate.trim().slice(0, 100);
  return normalized || "unknown";
}

export type TurnstileVerification = {
  success: boolean;
  skipped: boolean;
};

type TurnstileResponse = {
  success?: boolean;
  "error-codes"?: unknown;
};

export async function verifyTurnstile(options: {
  token?: string;
  remoteIp?: string;
  secret?: string;
  fetcher?: typeof fetch;
}): Promise<TurnstileVerification> {
  if (!options.secret) return { success: true, skipped: true };
  if (!options.token) return { success: false, skipped: false };

  const body = new URLSearchParams({
    secret: options.secret,
    response: options.token,
  });
  if (options.remoteIp && options.remoteIp !== "unknown") {
    body.set("remoteip", options.remoteIp);
  }

  try {
    const response = await (options.fetcher ?? fetch)(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body,
        signal: AbortSignal.timeout(8_000),
      },
    );
    if (!response.ok) return { success: false, skipped: false };
    const result = (await response.json()) as TurnstileResponse;
    return { success: result.success === true, skipped: false };
  } catch {
    return { success: false, skipped: false };
  }
}

export function safeExternalUrl(
  value: string | undefined,
  options: { allowLocalhost?: boolean } = {},
): URL | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    const local = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (url.protocol !== "https:" && !(options.allowLocalhost && local)) {
      return undefined;
    }
    if (url.username || url.password) return undefined;
    return url;
  } catch {
    return undefined;
  }
}

export function buildBookingUrl(
  value: string | undefined,
  leadId: string,
): string | undefined {
  const url = safeExternalUrl(value, {
    allowLocalhost: process.env.NODE_ENV !== "production",
  });
  if (!url) return undefined;
  url.searchParams.set("lead_id", leadId);
  return url.toString();
}

export function escapeHtml(value: string): string {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        '"': "&quot;",
      })[character] ?? character,
  );
}

export async function hmacSha256Hex(
  secret: string,
  payload: string,
): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export function integrationErrorCode(error: unknown): string {
  if (error instanceof Error) {
    if (error.name === "AbortError" || error.name === "TimeoutError") {
      return "timeout";
    }
    if (error instanceof IntegrationError) return error.code;
  }
  return "unexpected-error";
}

export class IntegrationError extends Error {
  constructor(
    public readonly service: "storage" | "crm" | "email" | "meta",
    public readonly code: string,
  ) {
    super(`${service} integration failed (${code}).`);
    this.name = "IntegrationError";
  }
}
