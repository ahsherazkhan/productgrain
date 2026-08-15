# NeedFoundry

NeedFoundry is a founder-led product strategy, MVP development, and custom software studio. This repository contains its UK/US marketing site and qualification journey: market-aware pricing, a multi-step application, deterministic server-side scoring, lead storage adapters, transactional email, attribution, consent-aware analytics, and qualified-lead booking.

The project uses the App Router on the Cloudflare-compatible [vinext](https://github.com/cloudflare/vinext) starter. It is designed for OpenAI Sites/Cloudflare Workers and keeps external services optional so missing analytics or email credentials never take down the core website.

> Launch note: the work area contains eight founder-authorized portfolio references delivered and documented by Codal. They remain visibly attributed to Codal and are not presented as NeedFoundry client work. The AI-focused selection includes ClaimDeck, CPAP.com, CallPotential, and BUILT BY GIRLS. Credited logos and verified project imagery are stored locally so the portfolio does not depend on unreliable third-party media embeds. Three independent public product profiles remain archived. Testimonials and unsupported NeedFoundry delivery claims remain intentionally absent. Founder/team assets, legal copy, service credentials, and production contact details still require review before launch. See [the content replacement checklist](docs/content-replacement-checklist.md) and [the deployment checklist](docs/deployment-checklist.md).

## Technology

- React 19, strict TypeScript, and the Next.js-compatible App Router through vinext.
- Tailwind CSS 4.
- Cloudflare Worker-compatible server output through Vite and the Sites plugin.
- Zod and React Hook Form for the lead application when installed by the implementation.
- A repository abstraction for Supabase/PostgreSQL and signed CRM webhooks.
- An optional Cloudflare D1/Drizzle schema and generated migration through the Sites starter; the current lead endpoint selects Supabase or webhook storage.
- Resend, Cloudflare Turnstile, Meta Pixel/Conversions API, and Google Analytics through environment configuration.

## Site map

The product surface includes:

- Main marketing: `/`, `/services`, `/process`, `/pricing`, `/work`, `/work/[slug]`, and `/about`.
- Market acquisition: `/mvp-development`, `/mvp-development/uk`, and `/mvp-development/us`.
- Conversion: `/apply` and `/thank-you`.
- Legal/system: `/privacy`, `/terms`, `/cookies`, sitemap, robots, not-found, and error states.
- Server endpoints: lead submission and consent-aware server analytics/Meta forwarding.

UK and US landing pages share one component but use manually configured local prices, budget ranges, metadata, booking destinations, and locale. Prices are starting points—not automatic currency conversions or checkout amounts.

## Local setup

Prerequisites:

- Node.js `>=22.13.0`.
- npm (the committed lockfile is authoritative).

Install and configure:

```bash
npm install
cp .env.example .env.local
npm run dev
```

On a machine where Node is available through the Codex desktop runtime but not
on the normal shell `PATH`, start the configured project with:

```bash
./run-local.sh
```

The development server starts on `http://localhost:3000` and prints its local URL. `.env.local` is ignored and must never be committed.

For a self-contained local form journey without Supabase, set these values in
`.env.local` and leave both Turnstile keys empty:

```text
NEXT_PUBLIC_SITE_URL=http://localhost:3000
LEAD_STORAGE_PROVIDER=memory
```

The `memory` provider is accepted only in development. It makes no outbound
storage request and its test records are discarded whenever the dev server
restarts; production rejects this provider rather than risking volatile leads.

Useful commands in the starter:

```bash
npm run dev
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
npm run build
npm run db:generate
```

`npm test` runs the domain/API suite, creates a production build, and validates the server-rendered routes. Install Playwright’s Chromium once, then `npm run test:e2e` starts or reuses the local server and runs the desktop/mobile conversion suite. To test another deployment, set `PLAYWRIGHT_BASE_URL` to its origin. A release is not complete until linting, strict type checking, unit/integration tests, the qualified UK browser flow, US price validation, and a production build all pass.

If Playwright's bundled Chromium is unavailable but Google Chrome is installed,
run the same suite with `PLAYWRIGHT_USE_SYSTEM_CHROME=1 npm run test:e2e`.

## Environment variables

Copy `.env.example` to `.env.local`. Public variables are intentionally visible in browser bundles; all service keys and webhook secrets must remain server-only.

| Variable | Required | Purpose |
|---|---:|---|
| `NEXT_PUBLIC_SITE_URL` | Production | Absolute canonical origin, for example `https://needfoundry.example`. Used for canonical URLs, social metadata, and server event sources. Do not include a trailing path. |
| `NEXT_PUBLIC_MARKET_DEFAULT` | Yes | Default market for international visits. Use `us` or `uk`; it selects configured display prices rather than converting currency. |
| `BOOKING_URL_DEFAULT` | Recommended | Server-only HTTPS fallback calendar URL returned only after qualification. |
| `BOOKING_URL_US` | Recommended | Server-only US qualified-lead calendar URL. |
| `BOOKING_URL_UK` | Recommended | Server-only UK qualified-lead calendar URL. |
| `NEXT_PUBLIC_BOOKING_URL_DEFAULT`, `NEXT_PUBLIC_BOOKING_URL_US`, `NEXT_PUBLIC_BOOKING_URL_UK` | Compatibility only | Brief-compatible aliases used only when the matching server-only value is absent. Because public variables are discoverable, they must not be treated as access controls. |
| `LEAD_STORAGE_PROVIDER` | Yes | Active lead repository. Production supports `supabase` or `webhook`; local development may use `memory`, which resets when the dev server restarts and is rejected in production. Do not set `d1` unless a D1 repository adapter is added and tested. |
| `SUPABASE_URL` | Supabase | Project API URL used by the server-side repository. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Privileged server-only key used to insert leads. Never prefix it with `NEXT_PUBLIC_` or expose it in browser code. |
| `CRM_WEBHOOK_URL` | Webhook/optional fan-out | Valid HTTPS lead webhook destination. |
| `CRM_WEBHOOK_SECRET` | Webhook | Shared server-only secret used to authenticate/sign webhook delivery. |
| `RESEND_API_KEY` | Resend | Server-only Resend API key. |
| `EMAIL_FROM` | Resend | Verified sender, for example `NeedFoundry <hello@your-domain.com>`. |
| `INTERNAL_LEAD_EMAIL` | Resend | Internal recipient for lead notifications. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Production form | Public Turnstile widget site key. |
| `TURNSTILE_SECRET_KEY` | Production form | Server-only Turnstile verification secret. |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta marketing | Public browser Pixel ID, loaded only after the appropriate consent. |
| `META_ACCESS_TOKEN` | Meta CAPI | Server-only Conversions API token. |
| `META_DATASET_ID` | Meta CAPI | Meta dataset/pixel destination for server events. |
| `META_TEST_EVENT_CODE` | Testing only | Optional Meta Events Manager test code. Remove it for live traffic. |
| `META_API_VERSION` | Optional | Explicit tested Meta Graph API version such as `v23.0`; leave empty to use the implementation default. Re-verify before changing. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Analytics | Google Analytics measurement ID, loaded only after analytics consent. |
| `NEXT_PUBLIC_FOUNDER_LINKEDIN` | Optional | Public founder profile URL; hide the link when empty. |
| `NEXT_PUBLIC_COMPANY_LINKEDIN` | Optional | Public company profile URL; hide the link when empty. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Recommended | Public enquiry address used as the non-calendar contact fallback. |
| `LEAD_RETENTION_DAYS` | Recommended | Operational retention target for lead records. It must match the reviewed privacy notice and deletion process. |
| `LEAD_RATE_LIMIT_WINDOW_SECONDS` | Recommended | Lead endpoint rate-limit window. The example uses 60 seconds. |
| `LEAD_RATE_LIMIT_MAX_REQUESTS` | Recommended | Maximum accepted attempts per rate-limit window. The example uses five. |

An empty optional integration must result in a controlled fallback. Do not represent an adapter as operational until it has been tested with real credentials in the target environment.

Cookie marketing consent is recorded separately from the form’s optional email-update consent. Meta Pixel/CAPI uses the former only; opting into studio emails does not imply advertising consent.

## Lead processing architecture

The server owns the entire trust boundary:

```text
Validate and normalize request
→ verify Turnstile
→ apply rate and duplicate controls
→ calculate deterministic score
→ save through the configured LeadRepository
→ send internal and applicant email
→ emit consent-aware analytics
→ return an opaque qualification result
```

Free-text descriptions are stored only in the configured lead system. They must never be included in Meta, Google Analytics, or routine logs.

Qualification thresholds are fixed:

- `60+`: qualified; show the correct market booking CTA, price reminder, and call-preparation guidance.
- `40–59`: manual review; notify the team and do not expose booking automatically.
- `<40`: nurture; offer problem-validation/prototype guidance and email contact, without automatic booking.

Selecting an unknown budget is not an automatic rejection. Booking URLs must be validated, selected on the server-derived market/result, and never accepted from form input.

## Storage and migrations

### Supabase/PostgreSQL

Supabase is the preferred durable store in the product brief.

1. Create a Supabase project and apply [`db/migrations/001_create_leads_supabase.sql`](db/migrations/001_create_leads_supabase.sql) using the Supabase SQL editor or your controlled migration runner.
2. Confirm the `leads` table contains the contact, project, scoring, consent, attribution, and timestamp fields documented by the migration.
3. Enable row-level security and grant no public read policy. Anonymous browser clients must not be able to select or insert privileged records directly.
4. Set `LEAD_STORAGE_PROVIDER=supabase`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY` in the hosted server environment.
5. Submit a non-sensitive test lead and verify the stored score, status, first/last touch, and separate consent fields.

Use the service-role key only inside the server runtime. Rotate it immediately if it is ever copied into a public variable, client bundle, log, or issue.

### Generic CRM webhook

1. Configure an HTTPS receiver that accepts the documented normalized lead payload.
2. Verify the request signature/shared secret, reject stale or replayed requests, and return a success status only after durable acceptance.
3. Set `LEAD_STORAGE_PROVIDER=webhook`, `CRM_WEBHOOK_URL`, and `CRM_WEBHOOK_SECRET`.
4. Test success, timeout, non-2xx, duplicate, and retry behavior without using real prospect data.

### Sites/D1 schema and conditional fallback

The repository includes the D1 schema in [`db/schema.ts`](db/schema.ts) and its generated SQLite migration in [`drizzle/0000_create_leads.sql`](drizzle/0000_create_leads.sql). The current lead endpoint does **not** select D1: `LEAD_STORAGE_PROVIDER` supports Supabase or webhook. To turn D1 into a real fallback, first add and test a `LeadRepository` adapter, then declare the logical `DB` binding in `.openai/hosting.json`; Sites owns the real Cloudflare resource and deployment wiring. Apply the inspected migration through the hosting workflow and verify that no public endpoint permits lead reads. Use `npm run db:generate` only after changing the Drizzle schema. Never silently fall back to D1, memory, or mock storage in production.

## Integration setup

### Transactional email

1. Verify the sending domain with Resend.
2. Configure `EMAIL_FROM`, `INTERNAL_LEAD_EMAIL`, and the server API key.
3. Test applicant confirmation, qualified, manual-review, and internal-notification templates.
4. Ensure internal email includes operational summary fields and a stored-lead link when available, but no secrets.
5. Simulate provider failure. A saved application must receive a safe response even when notification delivery fails, and the failure log must omit unnecessary personal data.

### Cloudflare Turnstile

1. Create production and test widgets for the actual hostnames.
2. Configure both keys; the secret stays server-only.
3. Verify the token on every submission using the requester context where supported.
4. Test valid, expired, missing, duplicate, and failed tokens. Never accept a client-provided “verified” flag.

### Booking provider

Configure Cal.com, Calendly, or another HTTPS provider per market. Booking appears only for a server-qualified result; include the opaque lead ID only where the provider safely supports a configured query parameter. Track booking clicks after consent and retain an email fallback when the provider is absent.

### Meta Pixel and Conversions API

1. Configure the public Pixel ID and server-only dataset/token.
2. Gate browser marketing scripts and marketing server events on the saved consent state.
3. Use the same generated `event_id` for browser and server copies to support deduplication.
4. Hash supported customer identifiers on the server; send `_fbp`/`_fbc` only where lawful and technically appropriate.
5. Use `META_TEST_EVENT_CODE` in Events Manager, verify deduplication and payload safety, then remove the test code for launch.
6. Confirm no free-text problem, health, financial, or other sensitive detail is sent.

Meta/analytics failures must be non-blocking. `ProposalRequested` and `ClientWon` are reserved for a future authenticated CRM lifecycle rather than fired by the public form.

### Analytics, attribution, and consent

Configure Google Analytics only after the consent controls are wired and reviewed. Necessary storage remains active; analytics and marketing scripts remain off until their categories are accepted. Preserve the first touch, update the last touch, and store UTMs, `fbclid`, referrer, and landing page with the lead. See [the analytics event map](docs/analytics-event-map.md).

## Deployment with Sites

This repository contains `.openai/hosting.json` and the Sites Vite plugin. Keep that file as the logical D1/R2 declaration; do not add a parallel `wrangler.jsonc`. Runtime secrets and production bindings are managed by Sites rather than committed files.

1. Complete the content, privacy, security, integration, and test gates in [the deployment checklist](docs/deployment-checklist.md).
2. Run `npm run lint`, `npx tsc --noEmit`, the full tests, and `npm run build`.
3. Create a private preview deployment through Sites and add the non-public environment variables there.
4. Apply any storage migration to the preview destination and run a synthetic application using test credentials.
5. Review the preview on mobile and desktop, then configure the production domain and environment.
6. Deploy production, repeat the smoke test, and verify analytics/Meta only with the correct consent.

The build produces Cloudflare Worker-compatible ESM output. Vercel may require a separate compatibility review; it is not the canonical deployment path for this starter.

## Launch content and legal review

Customer proof may appear only when delivery evidence and publication permission are recorded. The published portfolio currently consists of eight founder-authorized Codal projects, clearly attributed to Codal rather than presented as NeedFoundry client work. Three independent product profiles remain archived. Third-party logos, imagery, demos, outcomes, and trademarks are credited to their original sources and owners. Testimonials disappear cleanly because none have been supplied and approved. If fewer than two publishable profiles remain, the capability-led content appears instead. Initial-based avatars are preferred over stock team photography.

The privacy, terms, cookie, retention, international-transfer, advertising-consent, and data-subject request language requires review by a qualified professional for the actual UK/US operation. Generated policy placeholders are not legal advice and do not guarantee compliance.

## Related operational documents

- [Meta launch plan](docs/meta-launch-plan.md)
- [Content replacement checklist](docs/content-replacement-checklist.md)
- [Analytics event map](docs/analytics-event-map.md)
- [Deployment checklist](docs/deployment-checklist.md)
- [Implementation plan](IMPLEMENTATION_PLAN.md)
- [Engineering standards](AGENTS.md)
