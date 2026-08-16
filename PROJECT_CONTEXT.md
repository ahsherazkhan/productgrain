# ProductGrain Website Context (v1.2)

## What this repo is
ProductGrain is a founder-led product strategy + software studio marketing + qualification website built with:
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
- The product-first studio for AI-native software
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
- `/apply` (concise one-page project enquiry)
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
- “Discuss your product idea, free” → `/apply`

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
2. One-page form collects five required answers plus optional company and marketing consent
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
- Server-side scoring uses the two commercial fields needed for routing: budget and desired start
- Status thresholds:
  - `qualified`: 60+
  - `review`: 30–59
  - `nurture`: <30
- Budget ranges are market-specific (`uk-*` vs `us-*`) and validated against selected market.

## Form and consent behavior
- One-page form with five required answers: name, work email, project note, budget, and desired start
- Optional company/project name
- Required contact consent (separate from marketing consent)
- Optional marketing consent checkbox (default off)
- Required Turnstile challenge
- Error summary with focus management and inline field-level errors
- Client analytics/consent are separated from required reply consent

## AI-related product/marketing treatment
- Messaging is AI-aware: AI can be core, enhancement, exploratory, optional, or unnecessary
- AI-specific marketing content explains suitability without making visitors classify AI or product maturity in the initial enquiry
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
- Indigo cobalt: `#3F51D9`
- Indigo cobalt hover: `#303FAE`
- Apricot: `#F3A56F` for small accents on dark surfaces only
- Success green: `#1F8A5B` for semantic success states only
- Warning/error tokens remain semantic and are not mechanically recoloured

### Layout/style characteristics
- Editorial headline sizing, restrained section spacing, thin borders, and soft shadows
- “Ruled” SVG grid-and-dot texture in many hero and utility sections, without gradients
- Editorial cards, three-column feature/pricing grids, process timeline visuals
- Sticky header, mobile menu, campaign header variant
- Accessibility-oriented focus styles and keyboard support (skip link, visible focus, dialog trap for consent)

## Work/portfolio model and media
- Content-driven profile records live in `src/content/case-studies.ts`.
- Seven projects, ClaimDeck, CPAP.com, CallPotential, BUILT BY GIRLS, Fuze Health, Children's Health, and MANTL, remain published with verified ProductGrain delivery attribution. ProductGrain is also the author, publisher, and recorded software creator for the profile pages.
- All seven use `verified-client-work`, confirmed founder authorization, approved project media, and public detail routes.
- Source-only outcome claims remain hidden until their values and timeframes receive separate confirmation.
- TicketRev, Tributi, and Loopple remain archived public product profiles and do not generate routes, structured data, or sitemap entries.
- Approved imagery for the seven published projects is stored under `public/work/projects`; external video embeds remain excluded.
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

## Repository workflow notes
- The source includes the full qualification journey, dual UK/US campaign implementation, and ProductGrain public identity.
- Release notes and deployments must point to the exact verified commit; do not infer that a remote branch or hosted version is current from this document.

## ProductGrain transition safeguards
- Existing `needfoundry-*` storage keys, `needfoundry:*` browser events, analytics script IDs, the `x-needfoundry-signature` webhook header, package identity, and test-only `.example`/`.invalid` hosts remain unchanged for compatibility.
- Published project delivery fields and SoftwareApplication creator attribution use ProductGrain consistently.
- Canonical URLs, sender addresses, contact details, and company social links remain on verified existing values or hidden fallbacks until real ProductGrain operations are supplied.
- Legal pages describe ProductGrain as the public-facing brand only and retain explicit professional-review and legal-entity/data-controller placeholders.

## Open items to close launch loop (from project plan)
- Founder/team media and biography content remains placeholder/fallback
- Confirm ProductGrain domain ownership before changing canonical URLs or redirects
- Verify a ProductGrain sending/contact domain and official company social profile
- Confirm legal entity-specific privacy/terms language, data-controller identity, contact details, and professional approval
- Complete final client review of ProductGrain delivery attribution
- Provision production integrations (Supabase or webhook, Resend, Turnstile, booking provider, Meta/GA)
- Run full verification: lint/typecheck/unit-integration tests/e2e + production build
