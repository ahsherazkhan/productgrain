# ProductGrain Meta launch plan

This plan covers Facebook and Instagram lead acquisition for ProductGrain’s website enquiry flow. It is a planning framework, not a forecast or guarantee. Confirm current Meta product names, advertising rules, consent requirements, and billing currency before launch.

## Objective and operating principle

Use founder-led advertising to reach industry experts, business owners, consultants, and nontechnical founders who understand a real workflow problem but do not yet have a technical specification.

The advertising promise is deliberately narrow:

> Bring the problem. We’ll help shape the product.

The initial Product Clarity Call is free. Paid work begins only after scope, timeline, milestones, and pricing are agreed. Advertising must not imply guaranteed product-market fit, guaranteed outcomes, a fixed price for every MVP, or a discounted “cheap build.”

Primary optimization metric:

> Cost per attended qualified call.

Final commercial metric:

> Advertising cost per signed client.

Raw leads, form completions, and booked calls are diagnostic steps rather than the final definition of success.

## Market sequence

### Phase 1: United Kingdom

- Launch a standalone UK campaign to `/mvp-development/uk`.
- Show manually configured UK prices and budget choices.
- Keep the first audience broad enough for Meta to learn; use market and English language as the primary controls.
- Test four to six ads in one broad cold ad set with automatic placements.
- Run until there is enough conversion and sales-quality evidence to identify stronger creative and landing-page messaging. Do not declare a winner from clicks alone.

### Phase 2: United States

- Create a separate US campaign to `/mvp-development/us` only after useful UK learnings exist.
- Adapt the best message and creative for the US; do not simply merge US traffic into the UK ad set.
- Use the manually configured US prices and budget choices.
- Compare markets independently because traffic cost, lead quality, sales cycle, and commercial value can differ.

Do not mix UK and US audiences in one ad set when evaluating acquisition performance.

## Campaign structure

### Campaign 1: Cold lead acquisition

**Objective:** Leads through the website.

**Destinations:**

- UK: `/mvp-development/uk`
- US: `/mvp-development/us`

**Initial structure:**

- One market per campaign.
- One broad ad set per market.
- Four to six ads per initial test.
- Automatic placements.
- Market and language as primary controls.
- Founder-led video, direct-to-camera clips, workflow visuals, and calm product-focused static creative.

Do not split a small budget across many narrow interests. Introduce additional ad sets only after the broad test produces enough qualified-call and sales-quality data to justify them.

### Campaign 2: Retargeting

Create retargeting only after audience volume exists. Candidate audiences:

- Market landing-page visitors.
- Application starters who did not submit.
- Pricing-section visitors.
- Founder-video viewers.
- Facebook and Instagram engagers.
- Previous leads who did not book, where consent and platform rules allow it.

Exclude:

- Existing clients.
- Qualified leads who already booked.
- Signed customers.
- Staff, test leads, and known internal traffic where practical.

Retargeting copy should answer genuine objections such as lack of a specification, uncertainty about first scope, and what happens in the free call, without using pressure, countdowns, fake scarcity, or personalized wording that implies knowledge of sensitive attributes.

## Initial planning budgets

These are configurable test assumptions, not guarantees:

| Market | Cold campaign | Retargeting |
|---|---:|---:|
| UK | Approximately $30–$40/day | Approximately $5–$10/day after audience volume exists |
| US | Approximately $40–$60/day | Approximately $5–$10/day after audience volume exists |

Confirm the ad account’s billing currency before creating budgets. Do not launch the US test merely because a calendar date arrives; use UK creative/message learning as the gate.

## Creative test matrix

Each ad should have one clear hook, one product-partner message, one landing page, and one CTA. Do not change audience, message, format, and landing page simultaneously when the goal is to learn which element caused a result.

### Angle 1: Industry expertise

**Hook**

> You understand the industry. You do not need to know how to design the software.

**Body**

> Bring us the problem and current workflow. Our founder-led, in-house team will help define and build the right first version.

**CTA:** Discuss your idea.

### Angle 2: Manual workflow

**Hook**

> Still running an important process through spreadsheets, email, documents, and manual follow-ups?

**Body**

> That workflow may be suitable for an internal tool, client portal, or SaaS product. Start with a free Product Clarity Call.

### Angle 3: Nontechnical founder

**Hook**

> Have a software idea but no technical cofounder?

**Body**

> You do not need to arrive with architecture, wireframes, or a feature specification. Bring us the problem and we will help shape the product.

### Angle 4: Product decision

**Hook**

> Most developers ask which features you want. We first ask which problem deserves to be solved.

**Body**

> Define the right first release before committing to months of development.

### Angle 5: Prototype

**Hook**

> Turn your idea into a clickable product prototype.

**Body**

> Clarify the workflow, visualize the experience, and understand the likely development direction before building the full product.

Do not lead with heavily discounted pricing. If an ad mentions cost, use the correct market’s configured “from” price and state that final scope and pricing are agreed after the free call.

## Founder video plan

Record short, captioned videos on:

1. Why clients do not need a technical specification.
2. Why one complete workflow is better than many incomplete features.
3. How a manual business process can become software.
4. What happens during the free Product Clarity Call.
5. How the team decides what belongs in an MVP.
6. What a realistic first product phase looks like.

Production requirements:

- Use the real founder and an accurate role/title.
- Open with the problem in the first moments; avoid a long company introduction.
- Add accurate burned-in or platform captions and review the transcript.
- Keep speech clear and visuals credible rather than overproduced.
- Create placement-safe crops and check that captions/UI are not clipped.
- The landing-page video must use a poster image, be optional, lazy-load, and never autoplay with sound.
- Obtain written permission for any client name, interface, result, or quotation shown.

## Landing-page and form alignment

Before spending:

- Each ad points to its matching market route with intact UTM parameters.
- The page repeats the ad’s central promise without changing the offer.
- Prices, budget fields, locale metadata, and qualified booking URL match the market.
- The primary CTA starts the embedded project enquiry.
- The application explains that booking appears only after evaluation.
- Required contact consent and optional marketing consent are separate.
- Turnstile, validation, failure recovery, and all three qualification results work on mobile.
- No unsupported testimonial, logo, result, or founder/team claim appears.

## Tracking and funnel definitions

Track the funnel from media through revenue:

1. Landing-page views.
2. Form starts.
3. Form completions/accepted leads.
4. Qualified leads.
5. Booking-link clicks and booked calls.
6. Attended qualified calls.
7. Proposals.
8. Signed clients.
9. Revenue by campaign.

Use [the analytics event map](analytics-event-map.md) for implementation names and consent rules. Pass UTMs, `fbclid`, landing page, and preserved first/last touch into the lead record. Use an `event_id` shared by browser Pixel and Conversions API copies for deduplication.

Never send Meta:

- The free-text problem or current-workaround answers.
- Medical, financial, compliance, or other sensitive details.
- Full form payloads.
- Optional-marketing events without the required consent state.

Hash only the supported customer identifiers selected for server matching. Treat `_fbp` and `_fbc` as consent- and policy-dependent. Analytics outages must never prevent application submission.

## Reporting cadence

### Daily operational check

- Spend/delivery anomalies.
- Broken ads or rejected creative.
- Landing and application availability.
- Accepted lead and server-event delivery.
- Obvious tracking duplication or loss.

Avoid making optimization decisions from a single day unless there is a clear technical failure or policy issue.

### Weekly acquisition and sales review

Break down by market, campaign, ad set, ad/creative angle, and landing page:

- Spend and landing-page views.
- Landing-to-form-start rate.
- Start-to-submit rate.
- Qualified rate.
- Qualified lead to booking rate.
- Booking to attendance rate.
- Cost per attended qualified call.
- Proposal and signed-client rate.
- Revenue and advertising cost per signed client.

Review disqualification/nurture patterns using structured fields only. Do not export or place sensitive free text into advertising reports.

## Test and decision framework

- Verify instrumentation with internal/test traffic before live spend and exclude that traffic from business reporting.
- Evaluate creative on downstream quality, not only click-through or raw lead cost.
- Use meaningful volume and the full sales feedback loop; document when evidence is still directional.
- Pause creative immediately for false claims, permission issues, broken destinations, or policy risk.
- When a message produces cheaper but low-quality leads, treat it as a losing commercial message.
- Promote a UK learning to the US as a hypothesis to retest, not as guaranteed cross-market performance.

## Launch checklist

- [ ] Real founder identity, biography, image/video, and usage permission are approved.
- [ ] UK landing page and application have passed mobile/desktop QA.
- [ ] UK pricing and booking destination are correct.
- [ ] Privacy/cookie disclosures and consent behavior have professional review.
- [ ] Pixel and CAPI test events arrive, deduplicate, and contain no prohibited form content.
- [ ] UTM/fbclid attribution persists into a test lead without overwriting first touch.
- [ ] Existing clients/booked leads/signed customers can be excluded from retargeting.
- [ ] Sales owners can record attendance, proposal, signed-client, and revenue outcomes.
- [ ] Test/internal traffic is identified.
- [ ] Four to six UK ads are approved and mapped to a single cold ad set.
- [ ] Retargeting remains off until sufficient eligible audience volume exists.
- [ ] US campaign remains separate and gated on useful UK learning.
