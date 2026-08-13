import type { AnalyticsEventName, MetaEventName } from "@/src/config/integrations";
import { readConsent } from "@/src/components/layout/cookie-consent";

type SafeEventProperties = Record<string, string | number | boolean | undefined>;

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
  if (!consent) return;

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
