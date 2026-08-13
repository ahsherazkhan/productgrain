import type { AnalyticsEventName, MetaEventName } from "@/src/config/integrations";

type SafeEventProperties = Record<string, string | number | boolean | undefined>;

function readConsent(): { analytics?: boolean; marketing?: boolean } {
  try {
    const value = localStorage.getItem("needfoundry-consent-v1");
    return value ? (JSON.parse(value) as { analytics?: boolean; marketing?: boolean }) : {};
  } catch {
    return {};
  }
}

export function createEventId(prefix: string) {
  const uuid = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}:${uuid}`;
}

export function trackClientEvent(
  name: AnalyticsEventName,
  properties: SafeEventProperties = {},
  metaEvent?: MetaEventName,
  eventId?: string,
) {
  if (typeof window === "undefined") return;
  const consent = readConsent();

  if (consent.analytics) {
    window.gtag?.("event", name, properties);
    window.dataLayer?.push({ event: name, ...properties });
  }

  if (consent.marketing && metaEvent && window.fbq) {
    const standardEvents = new Set<MetaEventName>(["PageView", "ViewContent", "Lead", "Schedule", "Contact"]);
    window.fbq(
      standardEvents.has(metaEvent) ? "track" : "trackCustom",
      metaEvent,
      properties,
      eventId ? { eventID: eventId } : undefined,
    );
  }
}
