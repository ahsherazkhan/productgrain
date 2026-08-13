"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, isAttributionStateFresh, mergeAttribution, withoutAdvertisingIdentifiers, type AttributionState } from "@/src/lib/attribution";
import { readConsent } from "@/src/components/layout/cookie-consent";
import { attributionSnapshotSchema } from "@/src/lib/validation/lead";

const attributionKey = "needfoundry-attribution-v1";

export function AttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    const capture = () => { try {
      const consent = readConsent();
      const captured = captureAttribution(new URL(window.location.href), document.referrer);
      const latest = consent?.marketing ? captured : withoutAdvertisingIdentifiers({ firstTouch: captured, lastTouch: captured }).firstTouch;
      const raw = localStorage.getItem(attributionKey);
      let existing: AttributionState | undefined;
      if (raw) {
        const candidate = JSON.parse(raw) as Partial<AttributionState>;
        const first = attributionSnapshotSchema.safeParse(candidate.firstTouch);
        const last = attributionSnapshotSchema.safeParse(candidate.lastTouch);
        if (first.success && last.success) {
          existing = { firstTouch: first.data, lastTouch: last.data };
          if (!isAttributionStateFresh(existing)) existing = undefined;
          else if (!consent?.marketing) existing = withoutAdvertisingIdentifiers(existing);
        }
      }
      localStorage.setItem(attributionKey, JSON.stringify(mergeAttribution(existing, latest)));
    } catch {
      // Attribution is optional and never blocks the site.
    } };
    capture();
    window.addEventListener("needfoundry:consent", capture);
    return () => window.removeEventListener("needfoundry:consent", capture);
  }, [pathname]);

  return null;
}
