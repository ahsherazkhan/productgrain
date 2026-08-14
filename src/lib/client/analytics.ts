import type { AnalyticsEventName, MetaEventName } from "@/src/config/integrations";
import { readConsent } from "@/src/components/layout/cookie-consent";

type SafeEventProperties = Record<string, string | number | boolean | undefined>;

function readCookie(name: string): string | undefined {
  const prefix = `${name}=`;
  return document.cookie.split(";").map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length, 220);
}

export function readMetaBrowserIdentifiers(): { fbp?: string; fbc?: string } {
  const consent = readConsent();
  if (!consent?.marketing) return {};
  const fbp = readCookie("_fbp");
  const fbc = readCookie("_fbc");
  return {
    ...(fbp && /^fb\.1\.\d{10,14}\.[A-Za-z0-9_-]+$/.test(fbp) ? { fbp } : {}),
    ...(fbc && /^fb\.1\.\d{10,14}\.[A-Za-z0-9_-]+$/.test(fbc) ? { fbc } : {}),
  };
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
