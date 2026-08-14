# NeedFoundry implementation plan

## Scope and decisions

This project is a greenfield, multi-route App Router website. The Sites starter is retained for its Cloudflare-compatible build and hosting path while the application remains portable and integration adapters use standard web APIs.

The application uses five route families:

1. Main marketing pages: home, services, process, pricing, work, and about.
2. Market campaigns: a shared UK/US MVP landing-page component plus an international MVP overview.
3. Conversion: a reusable five-step application and a server-evaluated result experience.
4. Legal and system pages: privacy, terms, cookies, not-found, error, sitemap, and robots.
5. Server endpoints: lead submission and consent-aware Meta event forwarding.

Six selected client-product profiles and their product screenshots are now published from user-confirmed work and source-backed public product information. The profiles deliberately omit confidential delivery scope, technology stacks, timelines, quantified outcomes, and other claims that have not been supplied and approved. Testimonials have not been supplied and remain hidden. `fitish.ai` is not published because the exact supplied domain could not be verified. Real founder/team media are still outstanding, so professional initial/founder fallbacks remain in place. No placeholder names appear in public UI.

## Phases

### 1. Foundation

- Define brand, markets, pricing, integration settings, typed content, metadata, and reusable layout primitives.
- Replace the starter preview, set the NeedFoundry visual system, and add responsive navigation/footer/cookie preferences.
- Create the required documentation and environment-variable contract.

### 2. Marketing routes

- Build the complete homepage using shared sections.
- Build the services, process, pricing, work, about, and MVP overview pages.
- Build one shared campaign landing page driven by UK/US market configuration.
- Add content-driven proof fallbacks, FAQs, structured data, canonical metadata, breadcrumbs, sitemap, and robots.

### 3. Lead journey

- Build the reusable five-step form with accessible validation, an error summary, market budgets, session-local progress, attribution capture, and consent separation.
- Implement server validation, deterministic scoring, rate limiting, duplicate resistance, Turnstile verification, storage adapters, Resend email, CRM webhook delivery, and consent-aware analytics.
- Return an opaque result reference; expose market booking links only for qualified results.

### 4. Data and operations

- Add the leads migration and private-access policy guidance.
- Add consent-aware Pixel/analytics loaders and a settings dialog.
- Add security headers and safe error/empty states.
- Document Meta launch strategy, event mapping, content replacement, migration, integration, and deployment steps.

### 5. Verification and launch

- Run strict type checking, linting, unit/integration tests, and the production build.
- Run the primary UK application flow and US pricing check end to end.
- Check routes, links, keyboard behavior, responsive presentation, and browser console.
- Deploy a private preview through Sites when validation passes.

## Canonical scoring interpretation

- `researching_for_someone_else` contributes 3 role/authority points, resolving the brief's placement mismatch.
- `primary_user` in user discussions contributes 10 user-access points unless explicit access is `yes` (15).
- Unspecified `other` choices receive no extra points.
- A `not_sure` budget receives 8 points and never causes automatic rejection.
- Thresholds are fixed: 60+ qualified, 40–59 review, below 40 nurture.

## External launch dependencies

- Founder name, biography, professional photograph, LinkedIn URL, and optional captioned introduction video.
- Approved team profiles and any additional case studies, client results, metrics, or testimonials intended for publication.
- Confirmation of the exact `fitish.ai` product URL and its publishable details before it is added to selected work.
- Production domain and contact email.
- Supabase or CRM destination, Resend, Turnstile, booking provider, Meta, and analytics credentials.
- Professional legal/privacy review for UK and US launch.
