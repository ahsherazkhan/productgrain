# NeedFoundry deployment checklist

Use this checklist for private preview and production releases. The canonical path for this repository is OpenAI Sites with Cloudflare Worker-compatible vinext output. `.openai/hosting.json` declares logical D1/R2 bindings; Sites owns the real hosted resources and runtime values. Do not introduce a parallel `wrangler.jsonc` for this starter.

Never use real prospect data for preview testing. Never claim an external integration is working merely because its adapter or mock passes.

## 1. Release ownership and change review

- [ ] A named technical owner is responsible for the release and rollback decision.
- [ ] Product/content, sales operations, privacy/legal, and marketing owners approved their launch areas.
- [ ] The intended commit/source state is recorded.
- [ ] `AGENTS.md` and `IMPLEMENTATION_PLAN.md` remain current.
- [ ] No unrelated local changes, generated secrets, database files, or personal exports are included.
- [ ] New dependencies have a clear purpose, compatible license, and audit result.
- [ ] A rollback target (previous known-good deployment) is identified before production release.

## 2. Content and proof gate

- [ ] Every item in [the content replacement checklist](content-replacement-checklist.md) is resolved or intentionally hidden.
- [ ] Founder name, title, biography, photo/avatar, contact details, and links are real and approved.
- [ ] “Founder-led,” “in-house team,” support period, ownership, service, market, and experience claims are verified.
- [ ] Team profiles show only approved people with accurate relationships.
- [ ] Only approved, published case studies and verified metrics render.
- [ ] With fewer than two published case studies, capability-led fallback content renders without fake filters.
- [ ] Only permission-confirmed, published testimonials render; otherwise the section is absent.
- [ ] No fake logos, names, ratings, review schema, awards, numbers, offices, screenshots, or stock-team photos appear.
- [ ] US/UK prices and package inclusions match the approved manual configuration.
- [ ] All starting-price, scope, free-call, and no-payment caveats remain visible.
- [ ] No `FOUNDER_NAME`, `example.com`, starter copy/icon, draft marker, lorem ipsum, or prominent placeholder remains.
- [ ] Founder video, if present, has a poster, captions, optional playback, lazy loading, and no autoplay with sound.
- [ ] Social preview imagery and metadata contain only approved claims and render correctly.

## 3. Legal, privacy, and consent gate

- [ ] `/privacy`, `/terms`, and `/cookies` exist and have professional review for the actual entity and UK/US operation.
- [ ] Any not-yet-reviewed legal text is visibly marked for review and is not presented as guaranteed compliance.
- [ ] Cookie banner and settings expose Necessary, Analytics, and Marketing categories.
- [ ] Necessary functionality remains available while optional categories are declined.
- [ ] Optional analytics and marketing code remains unloaded/inactive until its saved category permits it.
- [ ] Settings can be reopened and choices can be withdrawn.
- [ ] Consent state includes a policy/version and timestamp where designed.
- [ ] Required enquiry/contact consent is separate from optional, unchecked marketing consent.
- [ ] Retention period, deletion process, processor list, transfers, and data-subject contact process match actual operations.
- [ ] Marketing/analytics identifier treatment, including `fbclid`, `_fbp`, `_fbc`, and hashed identifiers, has been reviewed.

## 4. Runtime configuration

- [ ] `.env.example` lists every supported variable and contains no live secret.
- [ ] `NEXT_PUBLIC_SITE_URL` is the exact HTTPS production origin.
- [ ] `NEXT_PUBLIC_MARKET_DEFAULT` is `uk` or `us` as approved.
- [ ] Default, US, and UK booking URLs are valid HTTPS destinations owned by the business.
- [ ] `LEAD_STORAGE_PROVIDER` matches a deployed/tested repository adapter.
- [ ] Storage, webhook, email, Turnstile, Meta, and other secret values exist only in hosted server settings.
- [ ] Public IDs/URLs are the only values with `NEXT_PUBLIC_` prefixes.
- [ ] Public social URLs are correct or empty links are conditionally hidden.
- [ ] Lead retention and rate-limit settings are set to reviewed operational values.
- [ ] Preview uses test/sandbox credentials or isolated destinations.
- [ ] Production does not contain Meta’s test event code.
- [ ] All configured external URLs are parsed and allow only approved HTTPS destinations; no request/form value can override them.

## 5. Lead storage and migration

### Supabase/PostgreSQL production path

- [ ] The project/environment and data-region decision are approved.
- [ ] [`../db/migrations/001_create_leads_supabase.sql`](../db/migrations/001_create_leads_supabase.sql) was inspected before application.
- [ ] Migration applied successfully to preview, then production.
- [ ] The lead table contains contact, problem/product, score/status, attribution, and separate consent fields plus timestamps.
- [ ] Server-only insert/read works with the service-role credential.
- [ ] Row-level security is enabled and no public policy permits lead reads.
- [ ] Browser clients cannot see the service-role key or query the lead table directly.
- [ ] A synthetic lead stores normalized values, server score/status, first/last touch, and both consent fields correctly.
- [ ] Duplicate and retry behavior has been tested.
- [ ] Backup, retention, deletion, and incident owners are defined.

### Generic webhook production path

- [ ] Receiver URL and ownership are verified.
- [ ] Requests are authenticated/signed using the configured secret.
- [ ] Receiver rejects invalid signatures, stale/replayed requests, and malformed payloads.
- [ ] Durable acceptance, idempotency, timeout, non-2xx, and retry behavior are tested.
- [ ] The destination protects personal data and follows the reviewed retention rules.

### Sites/D1 fallback, only after an adapter is implemented

- [ ] [`../db/schema.ts`](../db/schema.ts) and [`../drizzle/0000_create_leads.sql`](../drizzle/0000_create_leads.sql) match the intended lead model.
- [ ] A D1 `LeadRepository` adapter exists and is tested; the current Supabase/webhook endpoint must not be configured with `d1` before that work is complete.
- [ ] The logical binding is declared in `.openai/hosting.json` and matches the application binding name.
- [ ] `npm run db:generate` output was inspected rather than applied blindly.
- [ ] Preview and production migrations were applied through the Sites/Cloudflare workflow.
- [ ] The application handles an absent/misbound database safely.
- [ ] No public endpoint provides arbitrary lead reads.

Do not deploy production with an in-memory/mock repository or silent data-loss fallback.

## 6. Integration verification

### Turnstile and abuse controls

- [ ] Production hostname is allowed by the Turnstile widget.
- [ ] Site key is public and secret key remains server-only.
- [ ] Missing, invalid, expired, duplicate, and valid tokens were tested.
- [ ] Server verification is authoritative; client state cannot bypass it.
- [ ] Rate limiting uses a production-suitable shared mechanism where practical.
- [ ] Input-size limits and duplicate-submission controls work.
- [ ] Failure messages are safe and do not expose provider/configuration details.

### Email

- [ ] Sending domain is verified and SPF/DKIM/provider requirements pass.
- [ ] `EMAIL_FROM` and internal recipient are correct.
- [ ] Applicant confirmation content is correct.
- [ ] Qualified email includes the correct market booking path and preparation guidance.
- [ ] Manual-review email sets the right expectation.
- [ ] Internal notification contains the approved operational summary, score/status, attribution summary, and stored-lead link when available.
- [ ] Email-provider timeout/failure does not lose an already accepted lead or expose personal data in logs.
- [ ] Deliverability tested with synthetic addresses controlled by the team.

### Booking

- [ ] Booking is absent from public navigation and pre-qualification states.
- [ ] Only server-qualified results reveal it.
- [ ] UK, US, and fallback URLs are selected correctly.
- [ ] Opaque lead reference is appended only where safely supported.
- [ ] Booking-provider unavailable state offers the correct fallback email.
- [ ] Booking click tracking does not claim a booked or attended call.

### CRM webhook

- [ ] Success and signed-payload verification pass with the actual destination.
- [ ] Timeout and non-2xx responses degrade safely and are operationally visible.
- [ ] Failure logs exclude free-text problem details and unnecessary personal data.

### Analytics and Meta

- [ ] [Analytics event-map](analytics-event-map.md) names and property allowlist match the deployed code.
- [ ] No optional script loads before its consent category is accepted.
- [ ] Route views do not duplicate on hydration; form events follow authoritative triggers.
- [ ] First touch remains immutable and last touch updates on a later attributable visit.
- [ ] UTM fields, referrer, landing page, and `fbclid` survive into the synthetic lead as designed.
- [ ] Meta browser/CAPI copies share event name and `event_id` and deduplicate in test tools.
- [ ] `_fbp`, `_fbc`, and hashed identifiers follow the reviewed consent/configuration.
- [ ] No form free text, raw personal identifiers, exact score, budget answer, secrets, or unsafe URLs appear in analytics payloads.
- [ ] Provider outage leaves the application usable.
- [ ] `ProposalRequested` and `ClientWon` remain disabled until driven by a trusted CRM lifecycle.
- [ ] Test/internal traffic is excluded from commercial reporting where practical.

## 7. Security gate

- [ ] All lead payloads are parsed, normalized, length-limited, and validated on the server.
- [ ] User-generated text is escaped when rendered into HTML/email/admin output.
- [ ] Browser bundles and source maps contain no database, webhook, email, Turnstile secret, or Meta access token.
- [ ] Booking, webhook, canonical, and redirect URLs are validated; open redirects are impossible.
- [ ] Secure response headers are present: content-type protection, referrer policy, frame restrictions, permissions policy, and transport security where appropriate.
- [ ] Content Security Policy permits only the explicitly configured hosting, analytics, Turnstile, booking, image/video, and Meta origins.
- [ ] CSP has been tested in report/preview mode before strict production enforcement where practical.
- [ ] Error pages and API responses reveal no stack, SQL, secret, provider token, or internal path.
- [ ] Logs avoid free-text descriptions and unnecessary personal data.
- [ ] `npm audit` (or the approved dependency scanner) has been reviewed; unresolved findings have an owner/risk decision.
- [ ] Public users cannot enumerate qualification results or lead IDs.
- [ ] Rate limiting, duplicate resistance, and anti-automation controls were tested from the deployed edge environment.

## 8. Automated verification

From a clean install and production-like environment, run:

```bash
npm install
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

`npm test` includes the production build and rendered-route checks. Set `PLAYWRIGHT_BASE_URL` only when the browser suite should exercise an already deployed origin.

- [ ] Lint passes.
- [ ] Strict TypeScript check passes.
- [ ] Unit tests pass: scoring, market price selection, attribution parsing, form schema.
- [ ] Integration tests pass: accepted submission, invalid data, Turnstile failure, qualified/review/nurture routing, email failure, webhook failure.
- [ ] UK E2E passes: landing → UK pricing → qualified form → qualified result → booking CTA → test lead record.
- [ ] US price validation passes.
- [ ] Production build passes using vinext’s Cloudflare-compatible output.
- [ ] Test output contains no real personal data or secrets.

Do not weaken a failing check merely to release. Record intentionally waived non-blocking findings with owner, reason, and follow-up date.

## 9. Manual functional QA

- [ ] Every required route resolves; invalid routes show the designed 404.
- [ ] Desktop/mobile navigation and campaign anchor navigation work.
- [ ] All main/package CTAs enter the application at the intended market.
- [ ] No broken internal/external links remain.
- [ ] The concise form supports keyboard-only use, clear labels, validation summary, and focus movement.
- [ ] Contact consent is required; marketing consent defaults unchecked.
- [ ] Qualified, review, and nurture outcomes show correct copy and booking visibility.
- [ ] Submission, email, webhook, booking, Meta-missing, founder-photo-missing, no-case-study, and no-testimonial fallbacks are polished.
- [ ] Browser console and network panel have no unexplained production errors.
- [ ] Test on representative current mobile and desktop browsers at approximately 360px through wide desktop widths.
- [ ] Forms remain usable with slow network, provider timeout, refresh, back navigation, and double-click submission.

## 10. Accessibility QA

- [ ] One logical page heading and semantic heading hierarchy per route.
- [ ] Skip link, landmarks, and meaningful link/button names work.
- [ ] Keyboard focus is visible and never trapped in menu, cookie settings, accordion, or form.
- [ ] Mobile menu and accordion expose correct accessible state.
- [ ] Form instructions, required state, errors, and summary are screen-reader understandable.
- [ ] Color contrast passes and no status/instruction is color-only.
- [ ] Images have useful alt text or are correctly decorative.
- [ ] Founder video has accurate captions and keyboard-accessible controls.
- [ ] `prefers-reduced-motion` removes nonessential motion; there is no scroll hijacking.
- [ ] Zoom/reflow and touch targets work on small screens.
- [ ] Representative production pages approach the requested Lighthouse Accessibility score of 95+.

## 11. SEO and performance QA

- [ ] Every indexable route has unique title/description, canonical URL, and correct Open Graph metadata.
- [ ] Homepage title/description match the approved NeedFoundry copy.
- [ ] UK/US titles, `en-GB`/`en-US` metadata, canonical URLs, and reciprocal hreflang are correct.
- [ ] Sitemap and robots output use the production origin and exclude private/system result URLs as designed.
- [ ] Organization, ProfessionalService, Service, and BreadcrumbList structured data is valid and contains no fake ratings, offices, awards, or reviews.
- [ ] Published case-study breadcrumbs and metadata are correct; draft content is not indexed.
- [ ] Images are optimized and below-fold media lazy-loads.
- [ ] No large video autoplays; the founder video defers until requested/near use.
- [ ] Essential fonts/assets are the only preloads; layout shifts are controlled.
- [ ] Third-party scripts are minimized, consent-gated, and deferred.
- [ ] Representative production pages approach Lighthouse targets: Performance 90+, Accessibility 95+, Best Practices 90+, SEO 95+ where practical.

## 12. Private preview deployment

- [ ] Create a private Sites preview from the verified source state.
- [ ] Configure preview runtime environment and test credentials in Sites.
- [ ] Confirm any logical D1/R2 bindings resolve to the intended preview resources.
- [ ] Apply the preview migration before testing writes.
- [ ] Repeat the UK qualified flow, US pricing check, consent choices, and integration-failure smoke tests on the deployed URL.
- [ ] Check Worker/runtime logs for safe, actionable errors without personal data.
- [ ] Obtain final product/content, sales, privacy/legal, and marketing approval on the deployed preview.

## 13. Production deployment

- [ ] Configure the exact production domain, DNS, HTTPS, canonical origin, and Sites access policy.
- [ ] Enter production secrets/runtime values in Sites; do not copy `.env.local` into the repository.
- [ ] Back up/confirm the target data store and apply the reviewed migration.
- [ ] Confirm production email, booking, Turnstile hostnames, analytics property, Meta dataset, and webhook destination.
- [ ] Build/deploy the exact approved source state.
- [ ] Record deployment time, version/source, migration, configuration changes, and owner.
- [ ] Keep the previous known-good deployment available for rollback.

## 14. Post-deployment smoke test

Use clearly marked synthetic data and remove it afterward under the approved process.

- [ ] Home, services, process, pricing, work, about, apply, market landing, legal, sitemap, robots, 404, and error behavior load over HTTPS.
- [ ] Canonical/social metadata uses the production origin.
- [ ] UK and US pricing is correct.
- [ ] Necessary-only consent produces no analytics/marketing requests.
- [ ] Accepted analytics/marketing choices produce only the expected allowlisted events.
- [ ] One synthetic qualified application stores exactly once, sends expected emails, and shows the correct market booking action.
- [ ] Review and nurture behavior is verified using a safe test path or isolated records without generating misleading sales activity.
- [ ] Turnstile, rate limiting, and double-submit handling work at the edge.
- [ ] Meta test mode is not left active for production traffic.
- [ ] No client/server console error, broken link, secret exposure, or personal-data log is observed.
- [ ] Synthetic records, bookings, email recipients, and campaign/test artifacts are cleaned up safely.

## 15. Monitoring, response, and rollback

- [ ] Owners receive actionable notification for lead-storage failure and sustained submission errors.
- [ ] Email/CRM/analytics failure is observable without making the public form unavailable.
- [ ] Monitor application acceptance, qualification distribution, booking clicks, email delivery, provider error rates, and page availability.
- [ ] Review logs for redaction and retention.
- [ ] Document how to disable optional analytics/Meta quickly without disabling lead capture.
- [ ] Document database rollback/forward-fix behavior for the applied migration.
- [ ] Roll back the deployment if lead loss/corruption, secret exposure, consent bypass, broken primary journey, or unsafe tracking is detected.
- [ ] For external-provider failure, disable/degrade only that adapter when the lead can still be stored safely.
- [ ] Record incident timeline, affected data, containment, notification decision, and corrective action.

## 16. First-week launch review

- [ ] Confirm leads reach the intended owner and response expectations are realistic.
- [ ] Compare accepted lead count across application storage, email/CRM, analytics, and Meta without expecting optional providers to be the source of truth.
- [ ] Review form failure/abandonment patterns without inspecting unnecessary free text.
- [ ] Confirm qualified/review/nurture distribution reflects the tested scoring contract.
- [ ] Audit the first real Meta payloads for deduplication and prohibited data.
- [ ] Confirm booked and attended calls are distinguished.
- [ ] Review consent and retention operations, not only banner appearance.
- [ ] Prioritize fixes using user behavior and operational evidence; do not introduce unverified proof or pressure tactics after launch.
