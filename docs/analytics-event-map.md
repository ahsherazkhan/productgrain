# ProductGrain analytics event map

This document defines a provider-neutral, privacy-conscious event contract. Internal event names use `snake_case`; provider adapters translate them to Meta’s standard/custom names. Event delivery is best-effort and must never block navigation, form validation, lead storage, or qualification.

Consent and legal treatment must be reviewed for the production entity and markets. The implementation must follow the saved consent state rather than assuming that this document alone establishes a lawful basis.

## Core event map

| Event | Trigger | Destination |
|---|---|---|
| `page_view` | A public route becomes the active view; once per actual route view, not every component render. | Analytics and Meta (`PageView`) after applicable consent. |
| `pricing_view` | The pricing section meaningfully enters the viewport or the standalone pricing route is viewed; deduplicate within the route view. | Analytics; Meta may receive `ViewContent` when marketing consent permits. |
| `service_view` | The detailed services route becomes the active view. | Analytics; Meta may receive `ViewContent` when marketing consent permits. |
| `form_start` | The first meaningful interaction with a rendered enquiry form (focus/change), not merely form rendering. | Analytics and Meta (`LeadFormStart`) after applicable consent. |
| `lead_submitted` | The server accepts a valid, Turnstile-verified application for processing. Do not fire on button click or client-only validation. | Analytics and Meta (`Lead`) after applicable consent. |
| `qualified_lead` | Server scoring returns `qualified` (`score >= 60`). | Analytics, Meta (`QualifiedLead`), and CRM/lead operations after applicable consent. |
| `booking_view` | A qualified result renders an available market booking action. | Analytics. |
| `booking_click` | The user activates the validated booking link. | Analytics and Meta (`Schedule`) after applicable consent. |
| `case_study_view` | A published case-study route is viewed. | Analytics; Meta may receive `ViewContent` when marketing consent permits. |
| `cta_click` | A primary or explicitly instrumented secondary CTA is activated. | Analytics; map email/phone contact intent to Meta `Contact` only when appropriate and consented. |

Additional server-side operational records such as storage/email/webhook failure may be captured in privacy-safe application monitoring, but they are not marketing analytics events and must not contain unnecessary personal data.

## Reserved future lifecycle events

| Internal event | Meta event | Owner/trigger |
|---|---|---|
| `proposal_requested` | `ProposalRequested` | A trusted CRM or authenticated internal workflow records a genuine proposal request. Never infer it from a public CTA. |
| `client_won` | `ClientWon` | A trusted CRM records a signed customer. Never fire from the website form or thank-you page. |

Before enabling these events, define deduplication, consent/lawful-basis handling, offline-event terms, value/currency semantics, and deletion/retention behavior with the CRM owner.

## Provider mapping

| Internal | Google/other analytics | Meta browser | Meta server |
|---|---|---|---|
| `page_view` | `page_view` | `PageView` | `PageView` when configured/consented |
| `pricing_view` | `pricing_view` | Optional `ViewContent` | Optional deduplicated `ViewContent` |
| `form_start` | `form_start` | `LeadFormStart` | Optional deduplicated `LeadFormStart` |
| `lead_submitted` | `lead_submitted` | `Lead` | Deduplicated `Lead` |
| `qualified_lead` | `qualified_lead` | Optional `QualifiedLead` | Deduplicated `QualifiedLead` |
| `booking_view` | `booking_view` | — | — |
| `booking_click` | `booking_click` | `Schedule` | Optional deduplicated `Schedule` |
| `case_study_view` | `case_study_view` | Optional `ViewContent` | Optional deduplicated `ViewContent` |
| contact-intent `cta_click` | `cta_click` | Optional `Contact` | Optional deduplicated `Contact` |

Provider adapters may omit an optional destination when credentials, consent, or reliable deduplication are unavailable. Do not send the same user action twice under different internal names.

## Common event properties

Use a small typed allowlist. Suggested non-sensitive properties:

| Property | Example | Notes |
|---|---|---|
| `event_id` | UUID/opaque ID | Generate once per logical action; share between browser and Meta server copies. |
| `occurred_at` | ISO timestamp | Server time is authoritative for server-accepted events. |
| `page_path` | `/mvp-development/uk` | Path only; strip query strings and fragments. |
| `page_group` | `campaign_landing` | Controlled enum, not arbitrary content. |
| `market` | `uk` | Controlled enum such as `uk`, `us`, or `default`. |
| `locale` | `en-GB` | Controlled configured locale. |
| `landing_page` | `/mvp-development/uk` | Normalized path; never a free-form URL from the client. |
| `cta_id` | `hero_apply` | Controlled identifier. |
| `cta_location` | `hero` | Controlled identifier. |
| `qualification_status` | `qualified` | Analytics/operations only. Use the Meta event name, not raw score, to convey qualification. |
| `lead_reference` | Opaque ID | Use only where required for operations/deduplication; never expose a sequential database ID. |
| `case_study_slug` | `approved-slug` | Published slug only. |
| `pricing_market` | `uk` | Market configuration, not user-entered budget. |

Do not include a property merely because it is available. Each destination should receive only what it needs.

## Data that must never enter analytics properties

- Problem description, current workaround, intended-user free text, or any `Other` explanation.
- Name, raw email, phone number, company/project name, or postal address in browser analytics.
- Medical, health, financial, legal, compliance, employment, or other sensitive details.
- Budget answer, decision-authority answer, exact score, or internal sales notes in Meta events.
- Turnstile token, API key, webhook signature, booking secret, session secret, or database identifier.
- Full page URL when it can contain query strings, email addresses, tokens, or arbitrary input.
- Error stack traces or provider responses containing personal data.

For Meta Conversions API only, supported customer identifiers may be normalized and hashed server-side after the required consent/lawful-basis check. The raw values must not be logged or added to general analytics.

## Event behavior by journey stage

### Page and content views

- Fire `page_view` on the initial route and client-side route changes.
- Do not fire it on hydration, layout rerender, consent-modal opening, or hash-only anchor movement.
- Fire `pricing_view` once when the pricing content is meaningfully visible. Record its market, not a user budget.
- Fire `case_study_view` only for an approved published page.

### Application

- `form_start` fires once on the first meaningful interaction with the enquiry form.
- Client button clicks do not count as `lead_submitted`.
- The server returns/creates the authoritative event reference only after validation and anti-spam verification.
- A duplicate/replayed application must not create duplicate Lead/QualifiedLead events.
- Review and nurture outcomes may be measured internally through `lead_submitted` plus operational status, but must not emit `qualified_lead`.

### Booking

- `booking_view` fires only when the result is server-qualified and the configured market URL passed validation.
- `booking_click` records intent; it is not proof that a meeting was booked or attended.
- Booking and attendance outcomes should return from the provider/CRM through a trusted integration when implemented.

## Meta deduplication and payload rules

- Generate one unpredictable `event_id` for each logical event.
- Send the identical ID and event name in browser and server versions.
- Use the canonical production URL as `event_source_url`; strip unsafe query parameters.
- Capture `_fbp` and derive/capture `_fbc` only where legally and technically appropriate and consistent with consent.
- Hash supported identifiers on the server using Meta’s current normalization requirements.
- Never forward the whole lead object or serialize arbitrary form fields.
- Use `META_TEST_EVENT_CODE` only for test traffic and remove it from production configuration after verification.
- Failure, timeout, or rejection from Meta is logged without lead free text and never changes the application result.

## Consent routing

| Consent state | Necessary operation | Analytics | Meta marketing |
|---|---|---|---|
| No choice / necessary only | Site, private enquiry results, security, lead submission, and operational storage may function under the reviewed policy. | Do not load/fire optional analytics. | Do not load Pixel or send consent-dependent marketing events. |
| Analytics accepted | Necessary operation plus the configured analytics provider. | Fire allowlisted analytics events. | Remains off unless marketing is also accepted. |
| Marketing accepted | Necessary operation; analytics follows its separate category unless the UI explicitly and lawfully defines dependencies. | Follow analytics choice. | Pixel/CAPI events may fire under the reviewed configuration. |
| Withdrawn | Preserve only what is required for necessary operation and the consent record. | Stop future optional analytics and clear/revoke provider state where supported. | Stop future marketing events and clear/revoke provider state where supported. |

The cookie settings control must be reopenable. Necessary, analytics, and marketing choices must be stored with a version/timestamp. Contact consent is a required form field for responding to the enquiry; optional marketing consent is a separate unchecked field and must not be inferred from cookie consent.

## Attribution contract

Capture only these query parameters:

- `utm_source`
- `utm_medium`
- `utm_campaign`
- `utm_content`
- `utm_term`
- `fbclid`

Also capture normalized referrer, landing-page path, timestamp, and configured market.

Rules:

1. Create `first_touch` only when it does not already exist; never overwrite it on a later visit.
2. Refresh `last_touch` when a new attributable visit occurs.
3. Persist attribution in a first-party mechanism with bounded values and a reviewed lifetime.
4. Strip unknown parameters and never store URL fragments, credentials, or arbitrary query payloads.
5. Send first/last touch with the lead record through the server.
6. Treat `fbclid`, `_fbc`, and related advertising identifiers according to the saved consent and reviewed policy.
7. Keep the raw referrer only if it passes normalization; otherwise store a safe origin/host or omit it.

## QA checklist

- [ ] Each route generates one expected `page_view` and no hydration duplicate.
- [ ] Anchor navigation does not create a fake route view.
- [ ] Pricing visibility fires once per route view.
- [ ] Rendering the form does not fire `form_start`; first user interaction does.
- [ ] Repeated submission does not create duplicate lead events.
- [ ] Only score `>=60` fires `qualified_lead` and reveals booking.
- [ ] A booking click does not report a completed/attended meeting.
- [ ] UK and US events carry the correct configured market without a raw budget answer.
- [ ] First touch survives later attributed visits; last touch updates.
- [ ] Rejecting analytics/marketing prevents their scripts/events.
- [ ] Changing settings takes effect without requiring a new consent assumption.
- [ ] Pixel/CAPI copies share event name and `event_id` and deduplicate in Meta test tools.
- [ ] Analytics/Meta/provider outage does not affect lead acceptance.
- [ ] Browser network payloads and server logs contain none of the prohibited data above.
- [ ] Test traffic is identifiable/excluded from commercial reporting.
