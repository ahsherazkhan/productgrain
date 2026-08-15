import { Check, MessageSquareText, Route, UsersRound } from "lucide-react";
import type { MarketKey } from "@/src/config/markets";
import { markets } from "@/src/config/markets";
import { siteConfig } from "@/src/config/site";
import { CampaignHeader } from "@/src/components/layout/site-header";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { Container, ButtonLink, SectionIntro } from "@/src/components/ui/primitives";
import { PricingSection } from "./pricing-section";
import { ApplicationForm } from "@/src/components/forms/application-form";

const nextSteps = [
  [MessageSquareText, "Send a short project note with an approximate budget and desired start."],
  [UsersRound, "If the project looks like a fit, choose a free 30-minute Product Clarity Call."],
  [Route, "Agree the recommended first phase, scope, milestones, timeline, and price before paid work begins."],
] as const;

export function CampaignLanding({ market }: { market: MarketKey }) {
  const marketConfig = markets[market];
  const marketLabel = market === "uk" ? "UK" : "US";
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `MVP development in the ${marketConfig.name}`,
    areaServed: market === "uk" ? "GB" : "US",
    provider: { "@type": "Organization", name: siteConfig.brandName },
  };

  return (
    <>
      <CampaignHeader market={market} />
      <main id="main-content" lang={marketConfig.locale}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <section className="campaign-hero campaign-hero--minimal ruled-bg">
          <Container>
            <div className="campaign-hero__minimal-copy reveal">
              <p className="eyebrow"><span className="eyebrow-dot" />{marketLabel} AI-native product studio</p>
              <h1>Need an AI-native build? We help you build the right product direction first.</h1>
              <p>Share a short project note, approximate budget, and desired start with our in-house team. No technical specification is required, and the initial Product Clarity Call is free.</p>
              <div className="button-row"><ButtonLink href="#application">Start your enquiry</ButtonLink><ButtonLink href="#pricing" variant="secondary">See starting prices</ButtonLink></div>
              <p className="hero-disclosure">No account or payment required. The concise enquiry takes about 2 minutes.</p>
            </div>
          </Container>
        </section>
        <section className="section section--surface" id="how-it-works">
          <Container>
            <SectionIntro eyebrow="A transparent next step" title="Know what happens before you start" copy="The short enquiry gives us enough context to route the conversation without asking you to write a full product brief." />
            <ol className="call-items call-items--three">
              {nextSteps.map(([Icon, text], index) => <li key={text}><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><p>{text}</p></li>)}
            </ol>
          </Container>
        </section>
        <PricingSection initialMarket={market} embedded />
        <section className="section application-section" id="application">
          <Container>
            <div className="application-section__intro"><p className="eyebrow">Project enquiry</p><h2>Start with a few useful details.</h2><p>One project note, an approximate budget, and your desired start are enough. We will cover the workflow, users, and product decisions together later.</p><ul><li><Check aria-hidden="true" />About 2 minutes</li><li><Check aria-hidden="true" />No technical specification</li><li><Check aria-hidden="true" />A clear next-step recommendation</li></ul></div>
            <ApplicationForm market={market} embedded />
          </Container>
        </section>
      </main>
      <SiteFooter compact />
    </>
  );
}
