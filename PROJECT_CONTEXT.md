# NeedFoundry Website Context (v1.0)

## What this repo is
NeedFoundry is a founder-led product strategy + software studio marketing + qualification website built with:
- Next.js App Router
- React
- TypeScript in strict mode
- Tailwind 4 utility setup
- Cloudflare/Sites-compatible build (`vinext`, edge runtime where applicable)

Primary goal: market the studio, qualify enquiries with a structured workflow, and only expose booking next steps for qualified leads.

## Positioning and audience
Brand messaging is targeted at:
- Industry experts
- Business owners
- Non-technical founders

Geography and market split:
- UK and US are first-class campaign variants (manual GBP/USD pricing, no automatic FX conversion)
- International traffic defaults via `NEXT_PUBLIC_MARKET_DEFAULT`

Core message:
- Product-first, AI-native studio
- AI is evaluated per workflow; not forced as a default
- Start with real problem and users before product design/development decisions

## Implemented route map
### Public marketing + discovery
- `/` Home
- `/services`
- `/process`
- `/pricing`
- `/work`
- `/work/[slug]` (dynamic case study pages)
- `/about`
- `/mvp-development`
- `/mvp-development/uk`
- `/mvp-development/us`

### Conversion and outcomes
- `/apply` (multi-step fit check form)
- `/thank-you` (result page, optional booking CTA for qualified leads)

### System / legal / fallback
- `/privacy`, `/terms`, `/cookies`, `/not-found`, `/error`, `/sitemap.ts`, `/robots.ts`

### Server endpoints
- `/api/leads` (form submission, scoring, storage, notifications, analytics)
- `/api/meta` (consent-aware Meta Conversions event proxy)

## UI sections and navigation behavior
### Main navigation (top header)
`siteConfig.navigation`:
- Approach
- Work
- Pricing

`siteConfig.primaryCta`
- “Discuss your product idea — free” → `/apply`

### Footer and campaign nav
- Footer includes Explore, Markets, Information groups
- Campaign landing header has anchor-style nav links:
  - `#how-it-works`
  - `#pricing`

### Homepage flow
- Hero with principal CTA and anchor link to workflow
- AI/positioning fit section
- AI opportunity cards
- Process/phase section
- Selected work / capability fallback
- Home pricing block
- FAQ
- Final CTA section

## Lead qualification flow (what happens end-to-end)
1. Visitor lands on marketing page (often `/apply` or campaign landing)
2. 5-step form saves progress in session storage (`needfoundry-application-v1`)
3. Attribution capture runs in browser and is consent-gated for advertising IDs
4. Form validates required fields, consent, and anti-spam with Turnstile
5. API `/api/leads`:
   - Reads and validates schema (`zod`)
   - Optional Turnstile check
   - Deterministic score calculation
   - Stores lead through selected provider (`supabase` / `webhook` / dev `memory`)
   - Sends optional Resend email + optional CRM webhook
   - Emits consent-aware Meta event attempts (never blocks lead flow)
   - Returns result status and optional booking URL (qualified only)
6. Thank-you page renders one of 3 outcomes:
   - `qualified`
   - `review`
   - `nurture`

## Qualification model and decision rules
- Server-side scoring uses fixed weighted fields (role, product stage, budget, timeline, access, impact)
- Status thresholds:
  - `qualified`: 60+
  - `review`: 40–59
  - `nurture`: <40
- Budget ranges are market-specific (`uk-*` vs `us-*`) and validated against selected market.

## Form and consent behavior
- 5-step form with explicit progress bar and accessible step navigation
- Session-local progress persistence
- Required contact consent (separate from marketing consent)
- Optional marketing consent checkbox (default off)
- Required Turnstile challenge
- Error summary with focus management and inline field-level errors
- Client analytics/consent are separated from required reply consent

## AI-related product/marketing treatment
- Messaging is AI-aware: AI can be core, enhancement, exploratory, optional, or unnecessary
- AI-specific sections in content and form (`productType`, `aiExpectation`, `existing products`) focus on suitability of AI
- No evidence of a generative AI assistant inside the lead form itself; messaging is product strategy-focused.
- There is a `chatgpt-auth.ts` utility for ChatGPT header-based identity extraction/sign-in paths, not yet wired into active public route flow.

## Design system and style direction
### Typography
- `Geist` for body
- `Newsreader` used as editorial display via `--font-editorial`

### Color system (from `app/globals.css` and `src/config/site.ts`)
- Ink: `#0B1324`
- Paper: `#F6F5F0`
- Surface: `#FFFFFF`
- Cobalt: `#415CF6`
- Cobalt-dark: `#2F45C7`
- Signal: `#BFF078`
- Success/Warning/Error tokens present and used contextually

### Layout/style characteristics
- Editorial headline sizing, restrained section spacing, thin borders, and soft shadows
- “ruled” textured background style (`radial + subtle grid`) in many hero/utility sections
- Editorial cards, three-column feature/pricing grids, process timeline visuals
- Sticky header, mobile menu, campaign header variant
- Accessibility-oriented focus styles and keyboard support (skip link, visible focus, dialog trap for consent)

## Work/case studies model
- Content-driven case studies in `src/content/case-studies.ts`
- Published/permission filtering built in
- If fewer than two verified published studies, UI falls back to capability-led content.
- Testimonials are intentionally empty until approval and permission are present.

## Security/compliance posture currently implemented
- Zod validation and normalization for all inbound lead fields
- Rate limiting on API endpoints
- Attribution capture, no third-party data leakage into free-text payloads
- Necessary-first cookie model with opt-in analytics/marketing consent
- Consent-aware analytics/events loading
- Error and integration failures are non-blocking for core journey

## Docs and verification already in-repo
- `IMPLEMENTATION_PLAN.md`
- `README.md`
- `docs/`:
  - `analytics-event-map.md`
  - `content-replacement-checklist.md`
  - `deployment-checklist.md`
  - `meta-launch-plan.md`

## Current repository status notes
- Working tree includes the full qualification journey and dual UK/US campaign implementation.
- Remote branch `origin/main` is currently aligned with these changes.
- Main branch identity has been set to project owner info for local commits:
  - `user.name = ahsherazkhan`
  - `user.email = ahsherazkhan@gmail.com`

## Open items to close launch loop (from project plan)
- Founder/team media and biography content remains placeholder/fallback
- Confirm legal entity-specific privacy/terms language and contact details
- Provision production integrations (Supabase or webhook, Resend, Turnstile, booking provider, Meta/GA)
- Run full verification: lint/typecheck/unit-integration tests/e2e + production build
