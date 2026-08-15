# ProductGrain engineering standards

## Product intent

- Position ProductGrain as a founder-led product partner, not a feature-list coding agency.
- Write for nontechnical founders, operators, consultants, and business owners in the UK and US.
- Keep language direct, calm, credible, and free of unsupported superlatives.
- Never fabricate clients, logos, case studies, metrics, testimonials, awards, people, offices, or credentials.

## Architecture

- Use the App Router, React, strict TypeScript, and Tailwind CSS.
- Keep brand and contact details in `src/config/site.ts`; do not hardcode them across UI.
- Keep market and price differences in typed configuration. Prices are manual market values, never live currency conversions.
- Keep marketing content in typed `src/content` modules and reusable UI in `src/components`.
- Keep lead validation, scoring, storage, email, anti-spam, and analytics behind server-side interfaces.
- Browser code must never receive database service keys, email keys, webhook secrets, or Meta access tokens.
- Avoid `any`; prefer narrow types and deterministic pure functions.
- Optional integrations must fail safely without breaking the core lead journey.

## Conversion and content rules

- All package and consultation CTAs lead to `/apply` or the embedded campaign form.
- The booking link is returned only after server-side qualification.
- Starting prices are not guarantees. Do not add checkout, discounting, strikethrough pricing, or urgency tricks.
- Render only approved, published proof. Use capability-led content when verified proof is unavailable.
- Do not render placeholder tokens such as `FOUNDER_NAME` in production UI. Use honest conditional fallbacks.
- Separate required enquiry consent from optional, unchecked marketing consent.
- Do not send free-text product descriptions or sensitive data to analytics or advertising providers.

## Design and accessibility

- Use the configured ink, paper, indigo-cobalt, and restrained apricot palette; reserve green for semantic success states.
- Prefer editorial typography, generous spacing, thin borders, meaningful CSS visuals, and minimal motion.
- Avoid generic stock-team imagery, gradients, glassmorphism, parallax, and decorative animation.
- Support keyboard navigation, visible focus, semantic headings, accessible dialogs/accordions/menus, announced form progress, error summaries, and `prefers-reduced-motion`.
- Build mobile-first for approximately 360–1600px and keep prose to a comfortable reading measure.

## Security and privacy

- Validate and normalize all lead payloads on the server; cap free-text lengths.
- Verify Turnstile when configured, rate-limit submissions, and use generic client-facing errors.
- Preserve first-touch attribution and update last-touch attribution without leaking personal data.
- Public clients must not be able to read lead records.
- Apply secure response headers and validate configured external URLs before use.
- Log integration failures without logging unnecessary personal information.
- Mark generated legal copy as requiring professional review.

## Verification

- Add unit coverage for scoring thresholds/mappings, pricing selection, attribution, and validation.
- Add integration coverage for valid and invalid submissions, Turnstile rejection, all qualification routes, and graceful downstream failures.
- Add an end-to-end test for the UK qualified flow and US pricing.
- Before handoff run linting, strict type checking, unit/integration tests, end-to-end tests, and a production build.
- Verify all required routes, internal links, consent behavior, empty states, responsive layouts, and client console health.
