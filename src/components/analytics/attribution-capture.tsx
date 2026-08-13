"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, mergeAttribution, type AttributionState } from "@/src/lib/attribution";
import { attributionSnapshotSchema } from "@/src/lib/validation/lead";

const attributionKey = "needfoundry-attribution-v1";

export function AttributionCapture() {
  const pathname = usePathname();

  useEffect(() => {
    try {
      const latest = captureAttribution(new URL(window.location.href), document.referrer);
      const raw = localStorage.getItem(attributionKey);
      let existing: AttributionState | undefined;
      if (raw) {
        const candidate = JSON.parse(raw) as Partial<AttributionState>;
        const first = attributionSnapshotSchema.safeParse(candidate.firstTouch);
        const last = attributionSnapshotSchema.safeParse(candidate.lastTouch);
        if (first.success && last.success) {
          existing = { firstTouch: first.data, lastTouch: last.data };
        }
      }
      localStorage.setItem(attributionKey, JSON.stringify(mergeAttribution(existing, latest)));
    } catch {
      // Attribution is optional and never blocks the site.
    }
  }, [pathname]);

  return null;
}
