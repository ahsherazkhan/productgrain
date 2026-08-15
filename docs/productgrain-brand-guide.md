# ProductGrain brand direction

## Recommendation

Keep the website's existing editorial system, warm paper background, dark ink, and Geist/Newsreader type pairing. Use a deeper indigo-cobalt as the main brand/action colour, supported by a small warm-apricot accent. It keeps the technical confidence of blue while feeling more considered than a bright, generic SaaS cobalt.

The rebrand should change the identity layer, not the site's conversion structure.

## Brand foundation

- **Name:** `ProductGrain` — one word, capital P and G.
- **Category:** Product-first software studio.
- **Differentiator:** AI-native.
- **Primary descriptor:** The product-first studio for AI-native software.
- **Core explanation:** We work with the grain of your market—understanding how people already work, where value is lost, and what software should change.
- **Audience:** Industry experts, operators, business owners, and nontechnical founders.
- **Voice:** Direct, calm, commercially aware, and specific.

Use the grain explanation once, preferably on the About page. Avoid repeated references to grain, seeds, growth, harvest, milling, wood, or craft.

## Visual system

| Role | Colour | Use |
| --- | --- | --- |
| Ink | `#0B1324` | Headlines, dark sections, primary text |
| Paper | `#F6F5F0` | Main background and light wordmark |
| Indigo cobalt | `#3F51D9` | Primary actions, links, focus outlines, and brand tile |
| Indigo cobalt hover | `#303FAE` | Hover and pressed states |
| Apricot | `#F3A56F` | Logo endpoint and small decorative accents on dark colour only |
| White | `#FFFFFF` | Surfaces and high-contrast details |
| Border | `#D9DEE8` | Rules and card borders |
| Success green | `#1F8A5B` | Semantic success states only |

- Keep Geist for functional copy and the wordmark.
- Keep Newsreader as a restrained editorial accent.
- Paper on indigo cobalt has approximately `5.67:1` contrast, and apricot on indigo cobalt approximately `3.07:1`.
- Do not use apricot for normal text or focus indicators on the paper background; use indigo cobalt instead.
- Do not recolour the word `Grain`, introduce a rustic serif, or use gradients, wheat, leaves, wood texture, AI sparkles, brains, or circuit imagery.

## Logo concept: Looped g

A custom open-loop, single-storey `g` represents a product-learning loop: research and validation circle the problem before the descending path resolves that learning into one focused product direction. The open upper-right terminal distinguishes it from the number 9 at small sizes. It connects directly to ProductGrain without relying on wheat, leaves, wood texture, or a generic growth chart.

### Assets

- `public/brand/productgrain-mark.svg` — primary indigo-cobalt mark.
- `public/brand/productgrain-favicon.svg` — simplified small-size mark.
- `public/brand/productgrain-logo.svg` — primary horizontal lockup for light surfaces.
- `public/brand/productgrain-logo-light.svg` — horizontal lockup for dark surfaces.
- `public/brand/productgrain-mark-mono-dark.svg` — dark one-colour mark.
- `public/brand/productgrain-mark-mono-light.svg` — light one-colour mark.

For the production header and footer, render the SVG mark beside live text rather than using the horizontal lockup as an image. This preserves crisp Geist typography and a useful accessible home-link label. For example:

```tsx
<Link href="/" className="wordmark" aria-label="ProductGrain home">
  <img src="/brand/productgrain-mark.svg" alt="" aria-hidden="true" />
  <span>ProductGrain</span>
</Link>
```

When an image is the only content, use `alt="ProductGrain"`. An external image receives its accessible name from the HTML `alt`, not the `<title>` inside the SVG.

### Usage

- Header mark: 25–28px.
- Gap between mark and wordmark: 10px.
- Wordmark: Geist 700, `-0.035em` tracking.
- Minimum icon size: 16px; use the favicon version at that size.
- Minimum full-lockup height: 22px.
- Clear space: at least half the mark width on every side.
- Keep the complete wordmark in one colour.
- Do not rotate, crop, stretch, outline, shadow, or place the mark on a low-contrast colour.

The horizontal SVGs use live text so they remain easy to edit. They are editable web previews, not portable master logos: external SVG images do not inherit the website's Geist font. Before distributing them to partner sites, email tools, social platforms, presentations, a CMS, or print, open the approved lockup in a vector editor with Geist installed and convert the ProductGrain wordmark to outlines.

## Approved homepage message

> **The product-first studio for AI-native software.**
>
> We help industry experts and nontechnical founders research real problems, validate product opportunities, and build software their market actually needs.

Remove the redundant `Product-first, AI-native studio` eyebrow beneath that lead. Keep the rest of the homepage structure, CTA language, pricing, proof, and qualification journey.

## About-page message

> **About ProductGrain**
>
> **Built around how your market actually works.**
>
> ProductGrain helps people with deep industry knowledge turn real workflow problems into focused AI-native software.

Story section:

> **Why ProductGrain exists**
>
> **Work with the grain of the market.**
>
> Every market has a grain: the workflows, constraints, decisions, and hard-won knowledge that shape how work really gets done.
>
> We learn that context before deciding what to build. Then we connect research, validation, design, and engineering in one accountable path—from a promising problem to software people can use.

Do not publish a fixed team size. `Founder-led, backed by a senior team` communicates the advantage without becoming stale.

## SEO and social copy

- **Homepage title:** Product-First AI Software Studio | ProductGrain
- **Description:** ProductGrain helps industry experts and nontechnical founders validate product opportunities and build focused AI-native software around real market needs.
- **Open Graph alt:** ProductGrain — the product-first studio for AI-native software.
- **Footer descriptor:** Founder-led product strategy, design, and engineering.

## Transition safeguards

- Do not globally replace every `NeedFoundry` string.
- Preserve existing consent, attribution, analytics, session-storage, webhook-signature, database, and environment identifiers unless a tested migration is intentionally added.
- Preserve historical project attribution until it is confirmed that the same delivery team/business may republish it under ProductGrain and existing client permission covers the rebrand.
- Do not describe ProductGrain as the legal entity or data controller until the actual legal entity is supplied. Legal copy can say `ProductGrain is a trading name of [legal entity]` only after that information is confirmed.
- Verify a ProductGrain email sending domain before changing production sender addresses.
- `productgrain.com` was reported available during the naming check on 15 August 2026, but domain availability is point-in-time. Recheck it immediately before purchase.
