"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useForm, type FieldErrors, type FieldPath } from "react-hook-form";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowLeft, ArrowRight, Check, Clock3, LockKeyhole, Save } from "lucide-react";
import { attributionSnapshotSchema, leadSubmissionResultSchema, leadSubmissionSchema, type LeadSubmissionInput } from "@/src/lib/validation/lead";
import { captureAttribution, isAttributionStateFresh, mergeAttribution, safePagePath, withoutAdvertisingIdentifiers, type AttributionState } from "@/src/lib/attribution";
import { createEventId, readMetaBrowserIdentifiers, trackClientEvent } from "@/src/lib/client/analytics";
import type { MarketKey } from "@/src/config/markets";
import type { PricingPackageId } from "@/src/config/pricing";
import { TurnstileField, type TurnstileHandle } from "./turnstile-field";
import { readConsent } from "@/src/components/layout/cookie-consent";

type LeadFormValues = Omit<LeadSubmissionInput, "contactConsent"> & { contactConsent: boolean };

const stepTitles = ["About you", "The problem", "Evidence & impact", "Commercial fit", "Permission"] as const;
const sessionKey = "needfoundry-application-v1";
const attributionKey = "needfoundry-attribution-v1";

const roleOptions = [
  ["business-owner", "Business owner"], ["founder", "Founder"], ["executive", "Executive or decision-maker"], ["consultant", "Consultant"], ["industry-professional", "Industry professional"], ["product-operations", "Product or operations team member"], ["technical-founder", "Technical founder"], ["student-researcher", "Student or researcher"], ["other", "Other"],
] as const;
const projectTypeOptions = [
  ["b2b-saas", "B2B SaaS"], ["internal-tool", "Internal business tool"], ["client-portal", "Client or partner portal"], ["ai-application", "AI-enabled application"], ["workflow-automation", "Workflow automation"], ["marketplace", "Marketplace"], ["mobile-application", "Mobile application"], ["existing-product-improvement", "Existing-product improvement"], ["not-sure", "Not sure"], ["other", "Other"],
] as const;
const discussionOptions = [["yes", "Yes"], ["informal", "A few informal discussions"], ["not-yet", "Not yet"], ["primary-user", "I am the primary user"]] as const;
const accessOptions = [["yes", "Yes"], ["probably", "Probably"], ["not-currently", "Not currently"], ["not-applicable", "Not applicable"]] as const;
const impactOptions = [["financial-loss", "It causes meaningful financial loss"], ["manual-cost", "It creates significant manual work or operational cost"], ["sales-delivery-delay", "It delays sales, delivery, or customer service"], ["business-risk", "It creates compliance or business risk"], ["moderate-inefficiency", "It causes moderate inefficiency"], ["opportunity", "It is currently more of an opportunity than an urgent problem"]] as const;
const stageOptions = [["existing-process", "Existing business process that needs software"], ["existing-product", "Existing product that needs improvement"], ["validated-idea", "Idea validated with potential users"], ["prototype", "Prototype already exists"], ["early-idea", "Early idea only"]] as const;
const timelineOptions = [["as-soon-as-possible", "As soon as possible"], ["within-one-month", "Within one month"], ["within-three-months", "Within three months"], ["within-six-months", "Within six months"], ["more-than-six-months", "More than six months"], ["exploring", "Exploring options"]] as const;
const decisionOptions = [["final-decision", "I make the final decision"], ["shared-decision", "I share the decision"], ["researching-for-someone", "I am researching for someone else"], ["not-sure", "Not sure"]] as const;

const ukBudgets = [["uk-under-2000", "Under £2,000"], ["uk-2000-4000", "£2,000–£4,000"], ["uk-4000-8000", "£4,000–£8,000"], ["uk-8000-20000", "£8,000–£20,000"], ["uk-20000-40000", "£20,000–£40,000"], ["uk-above-40000", "Above £40,000"], ["not-sure", "Not sure yet"]] as const;
const usBudgets = [["us-under-2500", "Under $2,500"], ["us-2500-5000", "$2,500–$5,000"], ["us-5000-10000", "$5,000–$10,000"], ["us-10000-25000", "$10,000–$25,000"], ["us-25000-50000", "$25,000–$50,000"], ["us-above-50000", "Above $50,000"], ["not-sure", "Not sure yet"]] as const;

const stepFields: readonly (readonly FieldPath<LeadFormValues>[])[] = [
  ["fullName", "email", "country", "role"],
  ["industry", "projectType", "problemDescription", "currentWorkaround", "intendedUsers"],
  ["userDiscussions", "userAccess", "problemImpact", "productStage"],
  ["budgetRange", "timeline", "decisionAuthority"],
  ["contactConsent"],
];

function FieldError({ message }: { message?: string }) {
  return message ? <span className="field-error"><AlertCircle aria-hidden="true" />{message}</span> : null;
}

function RadioGroup({
  legend,
  name,
  options,
  register,
  error,
  compact = false,
}: {
  legend: string;
  name: FieldPath<LeadFormValues>;
  options: readonly (readonly [string, string])[];
  register: ReturnType<typeof useForm<LeadFormValues>>["register"];
  error?: string;
  compact?: boolean;
}) {
  return (
    <fieldset className="form-field radio-fieldset">
      <legend>{legend}<span aria-hidden="true">*</span></legend>
      <div className={`radio-grid ${compact ? "radio-grid--compact" : ""}`}>
        {options.map(([value, label]) => (
          <label className="radio-option" key={value}>
            <input type="radio" value={value} {...register(name, { required: "Choose one option." })} />
            <span className="radio-marker"><i /></span><span>{label}</span>
          </label>
        ))}
      </div>
      <FieldError message={error} />
    </fieldset>
  );
}

export function ApplicationForm({ market = "uk", embedded = false, packageInterest }: { market?: MarketKey; embedded?: boolean; packageInterest?: PricingPackageId }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selectedMarket, setSelectedMarket] = useState<MarketKey>(market);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [restored, setRestored] = useState(false);
  const errorSummaryRef = useRef<HTMLDivElement>(null);
  const submissionIdRef = useRef<string | null>(null);
  const turnstileRef = useRef<TurnstileHandle>(null);
  const budgets = selectedMarket === "us" ? usBudgets : ukBudgets;

  const { register, handleSubmit, trigger, watch, reset, resetField, getValues, setValue, setError, formState: { errors, isSubmitting } } = useForm<LeadFormValues>({
    mode: "onBlur",
    defaultValues: { market, packageInterest, marketingConsent: false, contactConsent: false },
  });

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(sessionKey);
      if (raw) {
        const saved = JSON.parse(raw) as { values?: Partial<LeadFormValues>; step?: number };
      const restoredMarket = embedded
        ? market
        : saved.values?.market === "us"
          ? "us"
          : saved.values?.market === "uk"
            ? "uk"
            : market;
      const restoredBudget = saved.values?.budgetRange;
      const marketMatchesBudget =
        restoredBudget === "not-sure" ||
        restoredBudget === undefined ||
        restoredBudget.startsWith(`${restoredMarket}-`);
      setSelectedMarket(restoredMarket);
        reset({ ...saved.values, budgetRange: marketMatchesBudget ? restoredBudget : undefined, market: restoredMarket, packageInterest: packageInterest ?? saved.values?.packageInterest, marketingConsent: saved.values?.marketingConsent ?? false, contactConsent: saved.values?.contactConsent ?? false });
        if (typeof saved.step === "number") setStep(Math.min(Math.max(saved.step, 0), 4));
        setRestored(true);
      }
    } catch {
      try { sessionStorage.removeItem(sessionKey); } catch { /* storage may be unavailable */ }
    }

    try {
      const latest = captureAttribution(new URL(window.location.href), document.referrer);
      const advertisingAllowed = readConsent()?.marketing === true;
      const consentSafeLatest = advertisingAllowed ? latest : withoutAdvertisingIdentifiers({ firstTouch: latest, lastTouch: latest }).firstTouch;
      const existingRaw = localStorage.getItem(attributionKey);
      let existing: AttributionState | undefined;
      if (existingRaw) {
        const candidate = JSON.parse(existingRaw) as Partial<AttributionState>;
        const first = attributionSnapshotSchema.safeParse(candidate.firstTouch);
        const last = attributionSnapshotSchema.safeParse(candidate.lastTouch);
        if (first.success && last.success) {
          existing = { firstTouch: first.data, lastTouch: last.data };
          if (!isAttributionStateFresh(existing)) existing = undefined;
        }
      }
      localStorage.setItem(attributionKey, JSON.stringify(mergeAttribution(existing, consentSafeLatest)));
    } catch {
      // Attribution is useful but never required for the application.
    }
  }, [embedded, market, packageInterest, reset]);

  useEffect(() => {
    // React Hook Form's subscription API intentionally watches uncontrolled fields.
    // eslint-disable-next-line react-hooks/incompatible-library
    const subscription = watch((values) => {
      try { sessionStorage.setItem(sessionKey, JSON.stringify({ values, step })); } catch { /* session storage may be unavailable */ }
    });
    return () => subscription.unsubscribe();
  }, [step, watch]);

  const markStarted = () => {
    if (started) return;
    setStarted(true);
    const eventId = createEventId("form-start");
    trackClientEvent("form_start", { market: selectedMarket, placement: embedded ? "campaign" : "apply" }, "LeadFormStart", eventId);
  };

  const errorMessages = useMemo(() => {
    const flattened: string[] = [];
    const collect = (items: FieldErrors<LeadFormValues>) => {
      for (const value of Object.values(items)) {
        if (!value) continue;
        if (typeof value.message === "string") flattened.push(value.message);
      }
    };
    collect(errors);
    return Array.from(new Set(flattened));
  }, [errors]);

  useEffect(() => {
    if (errorMessages.length) errorSummaryRef.current?.focus();
  }, [errorMessages]);

  const next = async () => {
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (!valid) return;
    if (step === 0 && !embedded) {
      const country = getValues("country").trim().toLowerCase();
      const resolvedMarket = /^(us|usa|united states|united states of america)$/.test(country)
        ? "us"
        : /^(uk|gb|great britain|united kingdom|england|scotland|wales|northern ireland)$/.test(country)
          ? "uk"
          : selectedMarket;
      setSelectedMarket(resolvedMarket);
      setValue("market", resolvedMarket);
      const existingBudget = getValues("budgetRange");
      if (existingBudget && existingBudget !== "not-sure" && !existingBudget.startsWith(`${resolvedMarket}-`)) {
        resetField("budgetRange");
      }
    }
    trackClientEvent("form_step_complete", { step: step + 1, market: selectedMarket });
    setStep((current) => Math.min(current + 1, 4));
    requestAnimationFrame(() => document.getElementById("application-step-heading")?.focus());
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
    } catch { /* optional */ }
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
    } catch { /* optional consent state remains denied */ }
    if (advertisingConsent) {
      const latest = captureAttribution(new URL(window.location.href), document.referrer);
      attribution = mergeAttribution(attribution, latest);
    }
    if (attribution && !advertisingConsent) attribution = withoutAdvertisingIdentifiers(attribution);
    const metaIdentifiers = advertisingConsent ? readMetaBrowserIdentifiers() : {};

    const eventId = createEventId("lead");
    const candidate = {
      ...values,
      market: selectedMarket,
      submissionId: submissionIdRef.current ?? (submissionIdRef.current = crypto.randomUUID()),
      landingPage: advertisingConsent
        ? safePagePath(new URL(window.location.href))
        : withoutAdvertisingIdentifiers({
            firstTouch: captureAttribution(new URL(window.location.href)),
            lastTouch: captureAttribution(new URL(window.location.href)),
          }).lastTouch.landingPage,
      referrer: captureAttribution(new URL(window.location.href), document.referrer).referrer,
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
      let firstInvalidStep = 4;
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          const fieldPath = field as FieldPath<LeadFormValues>;
          setError(fieldPath, { type: "validate", message: issue.message });
          const fieldStep = stepFields.findIndex((fields) => fields.includes(fieldPath));
          if (fieldStep >= 0) firstInvalidStep = Math.min(firstInvalidStep, fieldStep);
        }
      }
      setStep(firstInvalidStep);
      setSubmitError("Please review the highlighted answers before submitting.");
      requestAnimationFrame(() => document.getElementById("application-step-heading")?.focus());
      return;
    }

    try {
      const response = await fetch("/api/leads", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(parsed.data) });
      const data = await response.json() as unknown;
      const publicResult = leadSubmissionResultSchema.safeParse(data);
      if (!response.ok || !publicResult.success) {
        const errorData = data && typeof data === "object" ? data as { error?: string; issues?: { field: string; message: string }[] } : {};
        if (errorData.issues) {
          for (const issue of errorData.issues) setError(issue.field as FieldPath<LeadFormValues>, { type: "server", message: issue.message });
        }
        throw new Error(errorData.error || "We could not send your application.");
      }
      const result = publicResult.data;
      try {
        sessionStorage.removeItem(sessionKey);
        sessionStorage.setItem(`needfoundry-result:${result.leadId}`, JSON.stringify(result));
      } catch {
        // Durable submission succeeded; browser result caching is best-effort.
      }
      trackClientEvent("lead_submitted", { market: selectedMarket }, "Lead", eventId);
      if (result.status === "qualified") trackClientEvent("qualified_lead", { market: selectedMarket }, "QualifiedLead", eventId);
      router.push(`/thank-you?ref=${encodeURIComponent(result.leadId)}`);
    } catch (error) {
      turnstileRef.current?.reset();
      setSubmitError(error instanceof Error ? error.message : "Something went wrong. Your answers remain saved in this browser so you can try again.");
      errorSummaryRef.current?.focus();
    }
  };

  const tokenCallback = useCallback((token: string) => setValue("turnstileToken", token, { shouldValidate: true }), [setValue]);
  const currentErrors = errors as Record<string, { message?: string }>;

  return (
    <div className={`application-shell ${embedded ? "application-shell--embedded" : ""}`} onFocusCapture={markStarted}>
      <div className="application-topline">
        <div><Clock3 aria-hidden="true" /><span>About 6–8 minutes</span></div>
        <div><Save aria-hidden="true" /><span>Progress saved in this session</span></div>
      </div>
      {restored ? <p className="restored-note" role="status"><Check aria-hidden="true" />Your saved progress has been restored.</p> : null}
      <div className="form-progress" aria-label={`Step ${step + 1} of ${stepTitles.length}: ${stepTitles[step]}`}>
        <div className="form-progress__meta"><span>Step {step + 1} of {stepTitles.length}</span><strong>{stepTitles[step]}</strong></div>
        <ol>{stepTitles.map((title, index) => <li key={title} className={index < step ? "is-complete" : index === step ? "is-current" : ""}><span>{index < step ? <Check aria-hidden="true" /> : index + 1}</span><small>{title}</small></li>)}</ol>
      </div>

      {errorMessages.length || submitError ? (
        <div className="error-summary" role="alert" tabIndex={-1} ref={errorSummaryRef}>
          <AlertCircle aria-hidden="true" /><div><strong>Please check the form</strong>{submitError ? <p>{submitError}</p> : null}{errorMessages.length ? <ul>{errorMessages.map((message) => <li key={message}>{message}</li>)}</ul> : null}</div>
        </div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-step" key={step}>
          <div className="form-step__heading"><p className="eyebrow">{stepTitles[step]}</p><h2 id="application-step-heading" tabIndex={-1}>{[
            "First, tell us who we’re speaking with.",
            "Describe the problem in your own words.",
            "What evidence and impact sit behind it?",
            "What would a practical first phase look like?",
            "One last check before we review it.",
          ][step]}</h2><p>{[
            "We use these details only to respond to your enquiry and route it to the right market.",
            "You do not need product terminology. The current workflow is more useful than a feature list.",
            "These answers help us recommend discovery, a prototype, or a focused build.",
            "Starting ranges help us phase scope honestly. Choosing ‘not sure’ will not disqualify you.",
            "The initial Product Clarity Call is free. No payment or account is required.",
          ][step]}</p></div>

          {step === 0 ? <div className="form-grid">
            <label className="form-field"><span>Full name <i>*</i></span><input autoComplete="name" {...register("fullName", { required: "Full name is required.", minLength: { value: 2, message: "Enter your full name." } })} /><FieldError message={currentErrors.fullName?.message} /></label>
            <label className="form-field"><span>Work email <i>*</i></span><input type="email" autoComplete="email" {...register("email", { required: "Work email is required.", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Enter a valid work email." } })} /><FieldError message={currentErrors.email?.message} /></label>
            <label className="form-field"><span>Phone number <small>Optional</small></span><input type="tel" autoComplete="tel" {...register("phone")} /><FieldError message={currentErrors.phone?.message} /></label>
            <label className="form-field"><span>Company or project name <small>Optional</small></span><input autoComplete="organization" {...register("company")} /></label>
            <label className="form-field"><span>Country <i>*</i></span><input autoComplete="country-name" {...register("country", { required: "Country is required." })} /><FieldError message={currentErrors.country?.message} /></label>
            <label className="form-field"><span>Role <i>*</i></span><select defaultValue="" {...register("role", { required: "Choose your role." })}><option value="" disabled>Select your role</option>{roleOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><FieldError message={currentErrors.role?.message} /></label>
          </div> : null}

          {step === 1 ? <div className="form-grid">
            <label className="form-field"><span>Industry <i>*</i></span><input placeholder="For example: logistics, legal services, healthcare operations" {...register("industry", { required: "Industry is required." })} /><FieldError message={currentErrors.industry?.message} /></label>
            <label className="form-field"><span>Project type <i>*</i></span><select defaultValue="" {...register("projectType", { required: "Choose a project type." })}><option value="" disabled>Select the closest option</option>{projectTypeOptions.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><FieldError message={currentErrors.projectType?.message} /></label>
            <label className="form-field form-field--full"><span>What problem are you trying to solve? <i>*</i></span><textarea rows={5} placeholder="What is difficult, slow, costly, or fragmented today?" {...register("problemDescription", { required: "Describe the problem.", minLength: { value: 20, message: "Please add a little more detail about the problem." } })} /><FieldError message={currentErrors.problemDescription?.message} /></label>
            <label className="form-field form-field--full"><span>How is the problem currently handled? <i>*</i></span><textarea rows={3} placeholder="For example: spreadsheets, email, documents, phone calls, or an existing system" {...register("currentWorkaround", { required: "Describe the current workaround." })} /><FieldError message={currentErrors.currentWorkaround?.message} /></label>
            <label className="form-field form-field--full"><span>Who would use the product? <i>*</i></span><textarea rows={3} placeholder="Describe the main users or stakeholders" {...register("intendedUsers", { required: "Describe the intended users." })} /><FieldError message={currentErrors.intendedUsers?.message} /></label>
          </div> : null}

          {step === 2 ? <div className="form-stack">
            <RadioGroup legend="Have you discussed the problem with potential users or internal stakeholders?" name="userDiscussions" options={discussionOptions} register={register} error={currentErrors.userDiscussions?.message} compact />
            <RadioGroup legend="Can you provide access to potential users or stakeholders?" name="userAccess" options={accessOptions} register={register} error={currentErrors.userAccess?.message} compact />
            <RadioGroup legend="What happens when the problem is not solved?" name="problemImpact" options={impactOptions} register={register} error={currentErrors.problemImpact?.message} />
            <RadioGroup legend="What stage are you at?" name="productStage" options={stageOptions} register={register} error={currentErrors.productStage?.message} />
          </div> : null}

          {step === 3 ? <div className="form-stack">
            <RadioGroup legend={`Approximate first-phase budget (${selectedMarket === "uk" ? "GBP" : "USD"})`} name="budgetRange" options={budgets} register={register} error={currentErrors.budgetRange?.message} compact />
            <RadioGroup legend="Preferred timeline" name="timeline" options={timelineOptions} register={register} error={currentErrors.timeline?.message} compact />
            <RadioGroup legend="Decision authority" name="decisionAuthority" options={decisionOptions} register={register} error={currentErrors.decisionAuthority?.message} compact />
          </div> : null}

          {step === 4 ? <div className="permission-step">
            <div className="privacy-panel"><LockKeyhole aria-hidden="true" /><div><h3>Your details stay private</h3><p>We use your information to review and respond to this product enquiry. We do not send your free-text answers to advertising platforms. Read the <a href="/privacy" target="_blank">privacy notice</a>.</p></div></div>
            <label className="check-option"><input type="checkbox" {...register("contactConsent", { required: "Consent to reply to your enquiry is required." })} /><span><i><Check aria-hidden="true" /></i><span>I consent to NeedFoundry contacting me about this enquiry. <strong>Required</strong></span></span></label><FieldError message={currentErrors.contactConsent?.message} />
            <label className="check-option"><input type="checkbox" {...register("marketingConsent")} /><span><i><Check aria-hidden="true" /></i><span>I would also like occasional product and studio updates. <small>Optional and unchecked by default</small></span></span></label>
            <TurnstileField ref={turnstileRef} onToken={tokenCallback} />
            <div className="submission-note"><strong>What happens next?</strong><p>We evaluate the fit and send the most useful next step. Qualified applications can choose a free thirty-minute call; others receive a review or smaller-step recommendation.</p></div>
          </div> : null}
        </div>

        <div className="form-actions">
          {step > 0 ? <button className="button button--secondary" type="button" onClick={() => setStep((current) => current - 1)}><ArrowLeft aria-hidden="true" /><span>Back</span></button> : <span />}
          {step < 4 ? <button className="button button--primary" type="button" onClick={next}><span>Continue</span><ArrowRight aria-hidden="true" /></button> : <button className="button button--primary" type="submit" disabled={isSubmitting}><span>{isSubmitting ? "Sending securely…" : "Send my product brief"}</span><ArrowRight aria-hidden="true" /></button>}
        </div>
      </form>
    </div>
  );
}
