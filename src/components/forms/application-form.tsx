"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, type FieldErrors, type FieldPath } from "react-hook-form";
import { AlertCircle, ArrowRight, Check, Clock3, LockKeyhole } from "lucide-react";
import {
  attributionSnapshotSchema,
  leadSubmissionResultSchema,
  leadSubmissionSchema,
  type LeadSubmissionInput,
} from "@/src/lib/validation/lead";
import {
  captureAttribution,
  isAttributionStateFresh,
  mergeAttribution,
  safePagePath,
  withoutAdvertisingIdentifiers,
  type AttributionState,
} from "@/src/lib/attribution";
import {
  createEventId,
  readMetaBrowserIdentifiers,
  trackClientEvent,
} from "@/src/lib/client/analytics";
import { markets, type MarketKey } from "@/src/config/markets";
import { siteConfig } from "@/src/config/site";
import type { PricingPackageId } from "@/src/config/pricing";
import { readConsent } from "@/src/components/layout/cookie-consent";
import { TurnstileField, type TurnstileHandle } from "./turnstile-field";

type LeadFormValues = Omit<LeadSubmissionInput, "contactConsent"> & {
  contactConsent: boolean;
};

const attributionKey = "needfoundry-attribution-v1";

const timelineOptions = [
  ["as-soon-as-possible", "As soon as possible"],
  ["within-one-month", "Within one month"],
  ["within-three-months", "Within three months"],
  ["within-six-months", "Within six months"],
  ["more-than-six-months", "Later than six months"],
  ["exploring", "Flexible / not sure"],
] as const;

function FieldError({ id, message }: { id?: string; message?: string }) {
  return message ? (
    <span className="field-error" id={id}>
      <AlertCircle aria-hidden="true" />
      {message}
    </span>
  ) : null;
}

export function ApplicationForm({
  market = "uk",
  embedded = false,
  packageInterest,
}: {
  market?: MarketKey;
  embedded?: boolean;
  packageInterest?: PricingPackageId;
}) {
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>(market);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const submissionIdRef = useRef<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const budgets = markets[selectedMarket].budgetOptions.map(({ value, label }) => ({
    value: value === "not-sure" ? value : `${selectedMarket}-${value}`,
    label,
  }));

  const {
    register,
    handleSubmit,
    resetField,
    getValues,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LeadFormValues>({
    mode: "onBlur",
    defaultValues: {
      market,
      packageInterest,
      marketingConsent: false,
      contactConsent: false,
    },
  });

  useEffect(() => {
    try {
      const latest = captureAttribution(new URL(window.location.href), document.referrer);
      const advertisingAllowed = readConsent()?.marketing === true;
      const consentSafeLatest = advertisingAllowed
        ? latest
        : withoutAdvertisingIdentifiers({ firstTouch: latest, lastTouch: latest }).firstTouch;
      const existingRaw = localStorage.getItem(attributionKey);
      let existing: AttributionState | undefined;
      if (existingRaw) {
        const candidate = JSON.parse(existingRaw) as Partial<AttributionState>;
        const first = attributionSnapshotSchema.safeParse(candidate.firstTouch);
        const last = attributionSnapshotSchema.safeParse(candidate.lastTouch);
        if (first.success && last.success) {
          existing = { firstTouch: first.data, lastTouch: last.data };
          if (!isAttributionStateFresh(existing)) existing = undefined;
          else if (!advertisingAllowed) existing = withoutAdvertisingIdentifiers(existing);
        }
      }
      localStorage.setItem(
        attributionKey,
        JSON.stringify(mergeAttribution(existing, consentSafeLatest)),
      );
    } catch {
      // Attribution is useful but never required for the enquiry.
    }
  }, []);

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    const eventId = createEventId("form-start");
    trackClientEvent(
      "form_start",
      { market: selectedMarket, placement: embedded ? "campaign" : "apply" },
      "LeadFormStart",
      eventId,
    );
  };

  const errorMessages = useMemo(() => {
    const flattened: string[] = [];
    const collect = (items: FieldErrors<LeadFormValues>) => {
      for (const value of Object.values(items)) {
        if (value && typeof value.message === "string") flattened.push(value.message);
      }
    };
    collect(errors);
    return Array.from(new Set(flattened));
  }, [errors]);

  useEffect(() => {
    if (errorMessages.length || submitError) errorSummaryRef.current?.focus();
  }, [errorMessages, submitError]);

  const selectMarket = (nextMarket: MarketKey) => {
    if (nextMarket === selectedMarket) return;
    setSelectedMarket(nextMarket);
    setValue("market", nextMarket, { shouldDirty: true });
    const budget = getValues("budgetRange");
    if (budget && budget !== "not-sure" && !budget.startsWith(`${nextMarket}-`)) {
      resetField("budgetRange");
    }
  };

  const onSubmit = async (values: LeadFormValues) => {
    setSubmitError(null);
    let attribution: AttributionState | undefined;
    try {
      const raw = localStorage.getItem(attributionKey);
      if (raw) {
        const candidate = JSON.parse(raw) as Partial<AttributionState>;
        const first = attributionSnapshotSchema.safeParse(candidate.firstTouch);
        const last = attributionSnapshotSchema.safeParse(candidate.lastTouch);
        if (first.success && last.success) {
          const candidateAttribution = { firstTouch: first.data, lastTouch: last.data };
          if (isAttributionStateFresh(candidateAttribution)) attribution = candidateAttribution;
        }
      }
    } catch {
      // Attribution is optional.
    }

    let advertisingConsent = false;
    let advertisingConsentUpdatedAt: string | undefined;
    let savedConsentPolicyVersion: string | undefined;
    try {
      const consent = readConsent();
      if (consent) {
        advertisingConsent = consent.marketing === true;
        advertisingConsentUpdatedAt = consent.updatedAt;
        savedConsentPolicyVersion = consent.policyVersion;
      }
    } catch {
      // Optional consent state remains denied.
    }

    if (advertisingConsent) {
      const latest = captureAttribution(new URL(window.location.href), document.referrer);
      attribution = mergeAttribution(attribution, latest);
    }
    if (attribution && !advertisingConsent) {
      attribution = withoutAdvertisingIdentifiers(attribution);
    }
    const metaIdentifiers = advertisingConsent ? readMetaBrowserIdentifiers() : {};
    const eventId = createEventId("lead");
    const candidate = {
      ...values,
      market: selectedMarket,
      submissionId:
        submissionIdRef.current ??
        (submissionIdRef.current = crypto.randomUUID()),
      landingPage: advertisingConsent
        ? safePagePath(new URL(window.location.href))
        : withoutAdvertisingIdentifiers({
            firstTouch: captureAttribution(new URL(window.location.href)),
            lastTouch: captureAttribution(new URL(window.location.href)),
          }).lastTouch.landingPage,
      referrer: captureAttribution(
        new URL(window.location.href),
        document.referrer,
      ).referrer,
      firstTouch: attribution?.firstTouch,
      lastTouch: attribution?.lastTouch,
      eventId,
      advertisingConsent,
      advertisingConsentUpdatedAt,
      consentPolicyVersion: savedConsentPolicyVersion,
      ...metaIdentifiers,
    };
    const parsed = leadSubmissionSchema.safeParse(candidate);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          setError(field as FieldPath<LeadFormValues>, {
            type: "validate",
            message: issue.message,
          });
        }
      }
      setSubmitError("Please review the highlighted answers before sending.");
      errorSummaryRef.current?.focus();
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const data = (await response.json()) as unknown;
      const publicResult = leadSubmissionResultSchema.safeParse(data);
      if (!response.ok || !publicResult.success) {
        const errorData =
          data && typeof data === "object"
            ? (data as {
                error?: string;
                issues?: { field: string; message: string }[];
              })
            : {};
        if (errorData.issues) {
          for (const issue of errorData.issues) {
            setError(issue.field as FieldPath<LeadFormValues>, {
              type: "server",
              message: issue.message,
            });
          }
        }
        throw new Error(errorData.error || "We could not send your enquiry.");
      }

      const result = publicResult.data;
      try {
        sessionStorage.setItem(
          `needfoundry-result:${result.leadId}`,
          JSON.stringify(result),
        );
      } catch {
        // Durable submission succeeded; browser result caching is best-effort.
      }
      trackClientEvent("lead_submitted", { market: selectedMarket }, "Lead", eventId);
      if (result.status === "qualified") {
        trackClientEvent(
          "qualified_lead",
          { market: selectedMarket },
          "QualifiedLead",
          eventId,
        );
      }
      window.location.assign(`/thank-you?ref=${encodeURIComponent(result.leadId)}`);
    } catch (error) {
      turnstileRef.current?.reset();
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Your answers are still in the form, so you can try again.",
      );
      errorSummaryRef.current?.focus();
    }
  };

  const tokenCallback = useCallback(
    (token: string) => setValue("turnstileToken", token, { shouldValidate: true }),
    [setValue],
  );
  const currentErrors = errors as Record<string, { message?: string }>;

  return (
    <div
      className={`application-shell application-shell--concise ${embedded ? "application-shell--embedded" : ""}`}
      onFocusCapture={markStarted}
    >
      <div className="application-topline">
        <div>
          <Clock3 aria-hidden="true" />
          <span>About 2 minutes</span>
        </div>
        <div>
          <LockKeyhole aria-hidden="true" />
          <span>No technical brief required</span>
        </div>
      </div>

      {errorMessages.length || submitError ? (
        <div
          className="error-summary"
          role="alert"
          tabIndex={-1}
          ref={errorSummaryRef}
        >
          <AlertCircle aria-hidden="true" />
          <div>
            <strong>Please check the form</strong>
            {submitError ? <p>{submitError}</p> : null}
            {errorMessages.length ? (
              <ul>
                {errorMessages.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={(event) => {
          void handleSubmit(onSubmit)(event);
        }}
        noValidate
        aria-busy={isSubmitting}
      >
        <div className="form-step form-step--concise">
          <div className="form-step__heading">
            <p className="eyebrow">Start a conversation</p>
            <h2>Tell us what you’d like to build or improve.</h2>
            <p>
              A few sentences are enough. We’ll ask the deeper discovery questions
              during the call. All fields are required unless marked optional.
            </p>
          </div>

          <div className="form-grid form-grid--concise">
            <label className="form-field">
              <span>Full name</span>
              <input
                id="fullName"
                autoComplete="name"
                spellCheck={false}
                maxLength={100}
                aria-required="true"
                aria-invalid={Boolean(currentErrors.fullName)}
                aria-describedby={currentErrors.fullName ? "fullName-error" : undefined}
                {...register("fullName", {
                  required: "Full name is required.",
                  minLength: { value: 2, message: "Enter your full name." },
                })}
              />
              <FieldError id="fullName-error" message={currentErrors.fullName?.message} />
            </label>

            <label className="form-field">
              <span>Work email</span>
              <input
                id="email"
                type="email"
                autoComplete="email"
                maxLength={254}
                aria-required="true"
                aria-invalid={Boolean(currentErrors.email)}
                aria-describedby={currentErrors.email ? "email-error" : undefined}
                {...register("email", {
                  required: "Work email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid work email.",
                  },
                })}
              />
              <FieldError id="email-error" message={currentErrors.email?.message} />
            </label>

            <label className="form-field">
              <span>
                Company or project name <small>Optional</small>
              </span>
              <input
                id="company"
                autoComplete="organization"
                maxLength={120}
                aria-invalid={Boolean(currentErrors.company)}
                aria-describedby={currentErrors.company ? "company-error" : undefined}
                {...register("company")}
              />
              <FieldError id="company-error" message={currentErrors.company?.message} />
            </label>

            <label className="form-field">
              <span>What would you like to build or improve?</span>
              <textarea
                id="problemDescription"
                rows={4}
                maxLength={1_200}
                aria-required="true"
                aria-invalid={Boolean(currentErrors.problemDescription)}
                aria-describedby={currentErrors.problemDescription ? "problemDescription-error" : undefined}
                placeholder="Describe the problem, product, or workflow in a few sentences."
                {...register("problemDescription", {
                  required: "Tell us what you would like to build or improve.",
                  minLength: {
                    value: 20,
                    message: "Please add a little more detail about the project.",
                  },
                })}
              />
              <FieldError id="problemDescription-error" message={currentErrors.problemDescription?.message} />
            </label>

            <div className="form-market-control">
              <span>Budget currency</span>
              <div role="group" aria-label="Budget currency">
                {(["uk", "us"] as const).map((marketKey) => (
                  <button
                    key={marketKey}
                    type="button"
                    className={selectedMarket === marketKey ? "is-current" : ""}
                    aria-pressed={selectedMarket === marketKey}
                    onClick={() => selectMarket(marketKey)}
                  >
                    {marketKey === "uk" ? "GBP" : "USD"}
                  </button>
                ))}
              </div>
            </div>

            <label className="form-field">
              <span>Approximate first-phase budget</span>
              <select
                id="budgetRange"
                defaultValue=""
                aria-required="true"
                aria-invalid={Boolean(currentErrors.budgetRange)}
                aria-describedby={currentErrors.budgetRange ? "budgetRange-error" : undefined}
                {...register("budgetRange", {
                  required: "Choose a budget range or select ‘Not sure yet’.",
                })}
              >
                <option value="" disabled>
                  Select a range
                </option>
                {budgets.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <FieldError id="budgetRange-error" message={currentErrors.budgetRange?.message} />
            </label>

            <label className="form-field">
              <span>When would you like to start?</span>
              <select
                id="timeline"
                defaultValue=""
                aria-required="true"
                aria-invalid={Boolean(currentErrors.timeline)}
                aria-describedby={currentErrors.timeline ? "timeline-error" : undefined}
                {...register("timeline", {
                  required: "Choose a desired start or select ‘Flexible / not sure’.",
                })}
              >
                <option value="" disabled>
                  Select a timeframe
                </option>
                {timelineOptions.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <FieldError id="timeline-error" message={currentErrors.timeline?.message} />
            </label>
          </div>

          <div className="permission-step permission-step--concise">
            <p className="form-privacy-note">
              <LockKeyhole aria-hidden="true" />
              <span>
                We use these details to review and reply to your enquiry. Free-text
                answers are never sent to advertising platforms. Read the{" "}
                <a href="/privacy">
                  privacy notice
                </a>
                .
              </span>
            </p>

            <label className="check-option">
              <input
                id="contactConsent"
                type="checkbox"
                aria-required="true"
                aria-invalid={Boolean(currentErrors.contactConsent)}
                aria-describedby={currentErrors.contactConsent ? "contactConsent-error" : undefined}
                {...register("contactConsent", {
                  required: "Consent to reply to your enquiry is required.",
                })}
              />
              <span>
                <i>
                  <Check aria-hidden="true" />
                </i>
                <span>
                  I consent to {siteConfig.brandName} contacting me about this enquiry.
                  <strong>Required</strong>
                </span>
              </span>
            </label>
            <FieldError id="contactConsent-error" message={currentErrors.contactConsent?.message} />

            <label className="check-option">
              <input type="checkbox" {...register("marketingConsent")} />
              <span>
                <i>
                  <Check aria-hidden="true" />
                </i>
                <span>
                  I would also like occasional product and studio updates.
                  <small>Optional and unchecked by default</small>
                </span>
              </span>
            </label>

            <TurnstileField ref={turnstileRef} onToken={tokenCallback} />
            <div className="submission-note">
              <strong>What happens next?</strong>
              <p>
                We review the enquiry and reply with the most practical next step.
                When there is a clear fit, you can choose a free thirty-minute call.
              </p>
            </div>
          </div>
        </div>

        <div className="form-actions form-actions--concise">
          <button className="button button--primary" type="submit" disabled={isSubmitting}>
            <span>{isSubmitting ? "Sending securely…" : "Send project enquiry"}</span>
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </form>
    </div>
  );
}
