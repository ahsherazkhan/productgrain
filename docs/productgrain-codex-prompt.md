# Codex implementation prompt: ProductGrain rebrand

Copy the prompt below into Codex from the website repository root. Attach or point Codex to the SVG assets in `public/brand/`.

```text
Rebrand this existing NeedFoundry website to ProductGrain. This is a focused identity migration, not a redesign.

OBJECTIVE
- Present the public brand exactly as “ProductGrain”: one word, capital P and G.
- Preserve the current conversion structure, responsive layout, pricing, proof, lead form, qualification logic, and integrations.
- Keep the current ink/paper foundation and the Geist + Newsreader type system.
- Use indigo cobalt #3F51D9 as the primary brand/action colour and #303FAE for hover/pressed states, replacing the brighter legacy cobalt.
- Use warm apricot #F3A56F only for the logo endpoint and small decorative accents on dark colours. Do not use it for text or focus indicators on light backgrounds.
- Retain green only for semantic success states.
- Use the supplied Looped g logo assets in public/brand/.

BRAND SYSTEM
- Category: product-first software studio.
- Differentiator: AI-native.
- Primary descriptor: “The product-first studio for AI-native software.”
- Core explanation: “We work with the grain of your market—understanding how people already work, where value is lost, and what software should change.”
- Voice: direct, calm, credible, commercially aware, and free of unsupported superlatives.
- Do not introduce earthy colours, rustic typography, wheat, seeds, leaves, wood texture, brains, circuits, sparkles, or generic AI imagery.
- Use the grain metaphor only on the About page and optional social artwork. Do not repeat grain, harvest, growth, craft, or agricultural puns across the site.

LOGO IMPLEMENTATION
- Create one reusable BrandMark/Wordmark component instead of duplicating mark markup in the header, campaign header, and footer.
- The custom looped lowercase g represents research and validation resolving into one focused product direction; preserve its supplied geometry and proportions.
- In navigation, render public/brand/productgrain-mark.svg beside live text “ProductGrain” in Geist 700 with -0.035em tracking.
- Use the light wordmark treatment on dark backgrounds.
- Replace public/favicon.svg and the dynamic favicon route with the simplified geometry from public/brand/productgrain-favicon.svg.
- Create a new 1200x630 Open Graph image using the ProductGrain mark, approved headline, current palette, and no unsupported claims.
- Keep an accessible text label on the home link and meaningful alt text on social artwork.
- Replace raw legacy-cobalt values in buttons, links, focus rings, navigation underlines, shadows, and diagrams with semantic brand tokens. Keep the dark header CTA ink, using indigo cobalt for its hover treatment.
- Do not mechanically recolour warning, error, or success states.

MESSAGING
- Keep the homepage hero headline exactly: “The product-first studio for AI-native software.”
- Keep the hero lead exactly: “We help industry experts and nontechnical founders research real problems, validate product opportunities, and build software their market actually needs.”
- Remove the redundant “Product-first, AI-native studio” eyebrow below the hero lead.
- Do not otherwise rewrite homepage sections that already align with the positioning.

Use this About page copy:
- Eyebrow: “About ProductGrain”
- Heading: “Built around how your market actually works.”
- Intro: “ProductGrain helps people with deep industry knowledge turn real workflow problems into focused AI-native software.”
- Story eyebrow: “Why ProductGrain exists”
- Story heading: “Work with the grain of the market.”
- Story paragraph 1: “Every market has a grain: the workflows, constraints, decisions, and hard-won knowledge that shape how work really gets done.”
- Story paragraph 2: “We learn that context before deciding what to build. Then we connect research, validation, design, and engineering in one accountable path—from a promising problem to software people can use.”
- Do not hardcode the current team headcount.

CONFIGURATION AND PUBLIC COPY
- Make src/config/site.ts the source of truth for brand name, tagline, positioning, description, and metadata text.
- brandName: “ProductGrain”
- tagline: “The product-first studio for AI-native software.”
- positioning: “ProductGrain is a product-first studio for AI-native software. We help industry experts and nontechnical founders research real problems, validate product opportunities, and build software their market actually needs.”
- description: “ProductGrain helps industry experts and nontechnical founders validate product opportunities and build focused AI-native software around real market needs.”
- Homepage title: “Product-First AI Software Studio | ProductGrain”
- Footer line: “© [dynamic year] ProductGrain. Founder-led product strategy, design, and engineering.”
- Update hardcoded public references in metadata templates, Open Graph, Twitter, structured data, market landing metadata, About, Work, Apply consent, Thank You, FAQ, footer, customer-facing emails, and legal-page descriptions where appropriate.
- Update the configured public contact email, company LinkedIn, canonical site URL, and email sender only when real ProductGrain values are supplied and operationally verified.

SAFETY AND PROVENANCE
- Search globally for both “NeedFoundry” and “needfoundry”. Classify each result before editing; do not run a blind global replacement.
- Preserve existing localStorage/sessionStorage keys, browser event names, analytics script IDs, test-only example hostnames, CRM signature headers, database identifiers, and environment variable names unless an explicit backwards-compatible migration is designed and tested.
- Keep the existing x-needfoundry-signature webhook header until its receiver supports a replacement. If it is renamed, send and accept both headers during a documented transition.
- Treat case-study deliveryName, proof labels, authorization statements, and historical narrative as provenance, not ordinary brand copy. Change them only after confirming ProductGrain is the same delivery team/business and each publication permission covers the rebrand. Otherwise retain the historical name or, only if factually approved, use “Delivered by the team now operating as ProductGrain.”
- On case-study structured data, use ProductGrain for the current page author/publisher, but use each record’s provenance.deliveryName for the software creator.
- Do not describe ProductGrain as a legal entity or data controller until the real legal entity is supplied. Keep legal pages marked for professional review.
- Do not fabricate testimonials, results, metrics, clients, people, credentials, or permissions.

DOMAIN AND DEPLOYMENT
- Do not assume productgrain.com is owned merely because it was previously available. Confirm purchase/control before switching production URLs.
- Once controlled, update NEXT_PUBLIC_SITE_URL, canonical URLs, email-domain verification, analytics/ad verification, Search Console, and social profiles.
- Add permanent old-domain redirects that preserve paths and query strings only after both domains are configured.

TESTS AND ACCEPTANCE CRITERIA
- Update tests that intentionally assert public brand copy. Keep tests for legacy internal keys and historical provenance unchanged unless a real migration is part of this task.
- Verify there is only one visible logo mark in each header/footer lockup and that the 16px favicon remains legible.
- Verify homepage, About, Work index/detail, Apply, Thank You, UK/US campaign pages, email output, and legal-page draft notices.
- Verify mobile navigation, keyboard focus, image alt text, contrast, consent behaviour, attribution persistence, and client console health.
- Run: npm run lint
- Run: npm run typecheck
- Run: npm run test:domain
- Run: npm run test:render
- Run: npm run test:e2e
- Run: npm run build
- Report any unavailable browser, missing credential, legal-entity detail, case-study permission, domain, email, or deployment prerequisite instead of inventing it.

DELIVERABLE
- Implement the rebrand, update the relevant documentation, and return a concise list of changed files, preserved legacy identifiers, verification results, and remaining launch dependencies.
```
