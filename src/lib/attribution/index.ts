import type { AttributionSnapshotInput } from "../validation/lead";

export type AttributionState = {
  firstTouch: AttributionSnapshotInput;
  lastTouch: AttributionSnapshotInput;
};

export const attributionMaxAgeMilliseconds = 90 * 24 * 60 * 60 * 1_000;

const trackingKeys = {
  utm_source: "utmSource",
  utm_medium: "utmMedium",
  utm_campaign: "utmCampaign",
  utm_content: "utmContent",
  utm_term: "utmTerm",
  fbclid: "fbclid",
} as const;

const pageContextKeys = new Set(["market", "package"]);

export function safePagePath(pageUrl: URL): string {
  const allowed = new URLSearchParams();
  for (const key of Object.keys(trackingKeys)) {
    const value = clean(pageUrl.searchParams.get(key));
    if (value) allowed.set(key, value);
  }
  for (const key of pageContextKeys) {
    const value = clean(pageUrl.searchParams.get(key), 80);
    if (value) allowed.set(key, value);
  }
  const query = allowed.toString();
  return `${pageUrl.pathname}${query ? `?${query}` : ""}`.slice(0, 500);
}

function clean(value: string | null | undefined, max = 200): string | undefined {
  if (!value) return undefined;
  const normalized = Array.from(value.normalize("NFKC"))
    .filter((character) => {
      const codePoint = character.codePointAt(0) ?? 0;
      return codePoint >= 32 && codePoint !== 127;
    })
    .join("")
    .trim()
    .slice(0, max);
  return normalized || undefined;
}

export function cleanReferrer(value: string | null | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    url.username = "";
    url.password = "";
    url.search = "";
    url.hash = "";
    return url.toString().slice(0, 500);
  } catch {
    return undefined;
  }
}

function cleanLandingPage(value: string | undefined): string | undefined {
  if (!value) return undefined;
  try {
    const url = value.startsWith("/")
      ? new URL(value, "https://needfoundry.invalid")
      : new URL(value);
    if (url.protocol !== "https:" && url.protocol !== "http:") return undefined;
    return safePagePath(url);
  } catch {
    return undefined;
  }
}

function cleanSnapshot(
  snapshot: AttributionSnapshotInput | undefined,
  fallbackCapturedAt: string,
): AttributionSnapshotInput | undefined {
  if (!snapshot) return undefined;
  return {
    capturedAt: snapshot.capturedAt ?? fallbackCapturedAt,
    landingPage: cleanLandingPage(snapshot.landingPage),
    referrer: cleanReferrer(snapshot.referrer),
    utmSource: clean(snapshot.utmSource),
    utmMedium: clean(snapshot.utmMedium),
    utmCampaign: clean(snapshot.utmCampaign),
    utmContent: clean(snapshot.utmContent),
    utmTerm: clean(snapshot.utmTerm),
    fbclid: clean(snapshot.fbclid),
  };
}

export function captureAttribution(
  pageUrl: URL,
  referrer?: string | null,
  capturedAt = new Date(),
): AttributionSnapshotInput {
  const snapshot: AttributionSnapshotInput = {
    capturedAt: capturedAt.toISOString(),
    landingPage: safePagePath(pageUrl),
    referrer: cleanReferrer(referrer),
  };

  for (const [queryKey, property] of Object.entries(trackingKeys)) {
    const value = clean(pageUrl.searchParams.get(queryKey));
    if (value) snapshot[property] = value;
  }

  return snapshot;
}

export function mergeAttribution(
  existing: AttributionState | undefined,
  latest: AttributionSnapshotInput,
): AttributionState {
  const hasCampaignAttribution = Boolean(
    latest.utmSource || latest.utmMedium || latest.utmCampaign || latest.utmContent ||
    latest.utmTerm || latest.fbclid,
  );
  const isAttributable = hasCampaignAttribution || (!existing && Boolean(latest.referrer));
  return {
    firstTouch: existing?.firstTouch ?? latest,
    lastTouch: !existing || isAttributable ? latest : existing.lastTouch,
  };
}

export function isAttributionStateFresh(
  state: AttributionState,
  now = new Date(),
): boolean {
  const capturedAt = state.firstTouch.capturedAt;
  if (!capturedAt) return false;
  const timestamp = Date.parse(capturedAt);
  return Number.isFinite(timestamp) && timestamp <= now.getTime() && now.getTime() - timestamp <= attributionMaxAgeMilliseconds;
}

export function withoutAdvertisingIdentifiers(
  state: AttributionState,
): AttributionState {
  const cleanTouch = (touch: AttributionSnapshotInput): AttributionSnapshotInput => {
    const rest = { ...touch };
    delete rest.fbclid;
    if (rest.landingPage) {
      try {
        const url = new URL(rest.landingPage, "https://needfoundry.invalid");
        url.searchParams.delete("fbclid");
        rest.landingPage = `${url.pathname}${url.search}`;
      } catch {
        delete rest.landingPage;
      }
    }
    return rest;
  };
  return { firstTouch: cleanTouch(state.firstTouch), lastTouch: cleanTouch(state.lastTouch) };
}

export function attributionFromLeadInput(
  input: {
    firstTouch?: AttributionSnapshotInput;
    lastTouch?: AttributionSnapshotInput;
    landingPage?: string;
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    fbclid?: string;
  },
  now = new Date(),
): AttributionState {
  const capturedAt = now.toISOString();
  const fallback: AttributionSnapshotInput = {
    capturedAt,
    landingPage: cleanLandingPage(input.landingPage),
    referrer: cleanReferrer(input.referrer),
    utmSource: clean(input.utmSource),
    utmMedium: clean(input.utmMedium),
    utmCampaign: clean(input.utmCampaign),
    utmContent: clean(input.utmContent),
    utmTerm: clean(input.utmTerm),
    fbclid: clean(input.fbclid),
  };

  return {
    firstTouch: cleanSnapshot(input.firstTouch, capturedAt) ?? fallback,
    lastTouch: cleanSnapshot(input.lastTouch, capturedAt) ?? fallback,
  };
}
