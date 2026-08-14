"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { readConsent, type ConsentChoice } from "@/src/components/layout/cookie-consent";
import { readMetaBrowserIdentifiers } from "@/src/lib/client/analytics";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[]; loaded?: boolean; version?: string };
    _fbq?: Window["fbq"];
  }
}

function loadScript(id: string, src: string) {
  if (document.getElementById(id)) return;
  const script = document.createElement("script");
  script.id = id;
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

function enableAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = false;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = window.gtag ?? function gtag(...args: unknown[]) { window.dataLayer?.push(args); };
  window.gtag("consent", "update", { analytics_storage: "granted" });
  window.gtag("js", new Date());
  window.gtag("config", id, { anonymize_ip: true, send_page_view: false });
  loadScript("needfoundry-ga", `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

function disableAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (!id) return;
  (window as unknown as Record<string, unknown>)[`ga-disable-${id}`] = true;
  window.gtag?.("consent", "update", { analytics_storage: "denied" });
}

function enableMeta() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  if (!pixelId) return;
  if (window.fbq) {
    window.fbq("consent", "grant");
    return;
  }
  type Fbq = NonNullable<Window["fbq"]>;
  const fbq = function (...args: unknown[]) {
    if (fbq.callMethod) fbq.callMethod(...args);
    else fbq.queue?.push(args);
  } as Fbq;
  fbq.queue = [];
  fbq.loaded = true;
  fbq.version = "2.0";
  window.fbq = fbq;
  window._fbq = fbq;
  loadScript("needfoundry-meta", "https://connect.facebook.net/en_US/fbevents.js");
  fbq("init", pixelId);
  fbq("consent", "grant");
}

function disableMeta() {
  window.fbq?.("consent", "revoke");
}

export function ConsentAnalytics() {
  const pathname = usePathname();
  const lastAnalyticsPage = useRef<string | null>(null);
  const lastMarketingPage = useRef<string | null>(null);

  useEffect(() => {
    const apply = (choice: ConsentChoice) => {
      if (choice.analytics) enableAnalytics();
      else disableAnalytics();
      if (choice.marketing) enableMeta();
      else disableMeta();

      const page = window.location.pathname;
      const safeLocation = `${window.location.origin}${page}`;
      if (choice.analytics && lastAnalyticsPage.current !== page) {
        lastAnalyticsPage.current = page;
        window.gtag?.("event", "page_view", {
          page_location: safeLocation,
          page_path: page,
        });
      }
      if (choice.marketing && lastMarketingPage.current !== page && window.fbq) {
        lastMarketingPage.current = page;
        const eventId = `page:${crypto.randomUUID()}`;
        const metaIdentifiers = readMetaBrowserIdentifiers();
        window.fbq("track", "PageView", {}, { eventID: eventId });
        void fetch("/api/meta", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            eventName: "PageView",
            eventId,
            eventSourceUrl: safeLocation,
            marketingConsent: true,
            ...metaIdentifiers,
          }),
          keepalive: true,
        });
      }
    };

    const stored = readConsent();
    if (stored) apply(stored);

    const listener = (event: Event) => apply((event as CustomEvent<ConsentChoice>).detail);
    window.addEventListener("needfoundry:consent", listener);
    return () => window.removeEventListener("needfoundry:consent", listener);
  }, [pathname]);

  return null;
}
