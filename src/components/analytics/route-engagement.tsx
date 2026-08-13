"use client";

import { useEffect } from "react";
import { createEventId, trackClientEvent } from "@/src/lib/client/analytics";

export function RouteEngagement({
  event,
  metaEvent,
  properties = {},
}: {
  event: "case_study_view" | "pricing_view" | "service_view";
  metaEvent?: "ViewContent";
  properties?: Record<string, string>;
}) {
  useEffect(() => {
    trackClientEvent(event, properties, metaEvent, createEventId(event));
    // Route engagement is intentionally recorded once per mounted route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, metaEvent]);
  return null;
}
