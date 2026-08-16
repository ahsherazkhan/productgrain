"use client";

import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Mail,
} from "lucide-react";
import { ButtonLink } from "@/src/components/ui/primitives";
import { NativeLink as Link } from "@/src/components/ui/native-link";
import { createEventId, readMetaBrowserIdentifiers, trackClientEvent } from "@/src/lib/client/analytics";
import { siteConfig } from "@/src/config/site";
import { readConsent } from "@/src/components/layout/cookie-consent";
import { leadSubmissionResultSchema, type LeadSubmissionResult as LeadResult } from "@/src/lib/validation/lead";

const copy = {
  qualified: {
    eyebrow: "Potential fit",
    title: "Your product looks like a potential fit for a focused discussion.",
    body: "Choose a suitable time for a free thirty-minute Product Clarity Call. Beforehand, think about the current workflow, intended users, and the most important outcome the first version should create.",
    icon: CalendarCheck,
  },
  review: {
    eyebrow: "Thoughtful review",
    title: "Your project may be suitable, and we’re reviewing the right starting point.",
    body: "The details need a little human review before we recommend the right call or first phase. We will follow up using the work email in your enquiry.",
    icon: Clock3,
  },
  nurture: {
    eyebrow: "Enquiry received",
    title: "Thank you. We’ll review the most practical next step.",
    body: "We will review your project note, budget range, and desired start, then follow up by email.",
    icon: CheckCircle2,
  },
} as const;

function marketingConsentIsActive(): boolean {
  return readConsent()?.marketing === true;
}

export function ThankYouResult({ reference }: { reference?: string }) {
  const [result, setResult] = useState<LeadResult | null>(null);

  useEffect(() => {
    if (!reference) return;
    const timer = window.setTimeout(() => {
      try {
        const raw = sessionStorage.getItem(`needfoundry-result:${reference}`);
        if (!raw) return;
        const parsed = leadSubmissionResultSchema.safeParse(JSON.parse(raw));
        if (!parsed.success) return;
        setResult(parsed.data);
        if (parsed.data.status === "qualified" && parsed.data.bookingUrl) {
          trackClientEvent("booking_view", { result: "qualified" });
        }
      } catch {
        // The private session result may be unavailable in a new browser.
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [reference]);

  const trackBooking = () => {
    if (!result) return;
    const eventId = createEventId("schedule");
    trackClientEvent(
      "booking_click",
      { result: "qualified" },
      "Schedule",
      eventId,
    );
    if (!marketingConsentIsActive()) return;
    const metaIdentifiers = readMetaBrowserIdentifiers();
    void fetch("/api/meta", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName: "Schedule",
        eventId,
        eventSourceUrl: `${window.location.origin}${window.location.pathname}`,
        marketingConsent: true,
        leadId: result.leadId,
        ...metaIdentifiers,
      }),
      keepalive: true,
    });
  };

  if (!result) {
    return (
      <div className="result-card result-card--generic">
        <CheckCircle2 aria-hidden="true" />
        <p className="eyebrow">Enquiry received</p>
        <h1>Thank you for sharing your project.</h1>
        <p>
          If you submitted an enquiry in this browser, check your email for
          the next step. For privacy, qualification details are available only
          in the original submission session.
        </p>
        <ButtonLink href="/">Return to {siteConfig.brandName}</ButtonLink>
      </div>
    );
  }

  const content = copy[result.status];
  const Icon = content.icon;

  return (
    <div className={`result-card result-card--${result.status}`}>
      <Icon aria-hidden="true" />
      <p className="eyebrow">{content.eyebrow}</p>
      <h1>{content.title}</h1>
      <p>{result.message || content.body}</p>

      {result.status === "qualified" ? (
        <>
          <div className="result-prep">
            <strong>Bring to the call</strong>
            <ul>
              <li>The current workflow and workaround</li>
              <li>The intended users or stakeholders</li>
              <li>The highest-value first outcome</li>
            </ul>
          </div>
          {result.bookingUrl ? (
            <a
              href={result.bookingUrl}
              className="button button--primary"
              target="_blank"
              rel="noreferrer"
              onClick={trackBooking}
            >
              <span>Choose a time for the free call</span>
              <ArrowUpRight aria-hidden="true" size={17} />
            </a>
          ) : (
            <div className="booking-unavailable">
              <Mail aria-hidden="true" />
              <span>
                <strong>Booking link unavailable</strong>
                {siteConfig.email ? <>We’ll follow up by email. You can also contact <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.</> : <>We’ll follow up using the work email in your enquiry.</>}
              </span>
            </div>
          )}
          <p className="price-reminder">
            Starting prices: focused MVPs from £8,000 in the UK or $10,000 in
            the US. Final scope is agreed after the free call.
          </p>
        </>
      ) : (
        <div className="result-next">
          <strong>What happens now</strong>
          <span>
            We review your project note and reply by email with the most
            practical recommendation.
          </span>
          {siteConfig.email ? <a href={`mailto:${siteConfig.email}`}>Contact {siteConfig.email}</a> : null}
        </div>
      )}

      <Link href="/pricing" className="text-link">
        Review the starting options <ArrowRight aria-hidden="true" />
      </Link>
    </div>
  );
}
