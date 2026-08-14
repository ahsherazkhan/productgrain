import { Rocket, ShieldCheck, Workflow } from "lucide-react";
import { Container, SectionIntro, ButtonLink } from "@/src/components/ui/primitives";
import { faqs } from "@/src/content/faqs";
import { capabilityLedWorkAlternative } from "@/src/content/case-studies";
import {
  engagementPhases,
  fitScenarios,
  homepageFaqIds,
} from "@/src/content/home";
import { PricingSection } from "./pricing-section";
import type { MarketKey } from "@/src/config/markets";

export function HomeHero() {
  return (
    <section className="home-hero home-hero--minimal ruled-bg">
      <Container>
        <div className="home-hero__minimal-copy reveal">
          <p className="eyebrow"><span className="eyebrow-dot" />Product strategy, design and engineering</p>
          <h1>Turn a real business problem into focused software.</h1>
          <p className="hero-lead">
            For founders and operators who understand the problem but need a product team to define, design, and build the right first version.
          </p>
          <div className="button-row">
            <ButtonLink href="/apply">Tell us about your project</ButtonLink>
            <ButtonLink href="/pricing" variant="secondary">See starting prices</ButtonLink>
          </div>
          <p className="hero-disclosure">6–8 minute fit check · Qualified enquiries can book a free 30-minute call</p>
        </div>
      </Container>
    </section>
  );
}

export function FitSection() {
  return (
    <section className="section section--surface fit-section">
      <Container>
        <SectionIntro
          eyebrow="A practical starting point"
          title="Start with the problem—not a feature list"
          copy="A good fit begins with a real workflow, the people involved, and an outcome worth improving. You do not need to arrive with technical language."
        />
        <div className="three-card-grid fit-scenarios">
          {fitScenarios.map(({ title, copy, icon: Icon }, index) => (
            <article className="editorial-card" key={title}>
              <div className="editorial-card__top"><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /></div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="section-link section-link--left">
          <ButtonLink href="/services" variant="quiet">Explore services and product types</ButtonLink>
        </div>
      </Container>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="section section--ink" id="how-it-works">
      <Container>
        <SectionIntro
          eyebrow="How it works"
          title="Three clear phases from problem to product"
          copy="Each phase creates a useful output before the next commitment is made."
        />
        <ol className="process-grid process-grid--three">
          {engagementPhases.map((phase) => (
            <li key={phase.number}>
              <div className="process-grid__number"><span>{phase.number}</span><i /></div>
              <p className="process-verb">{phase.title}</p>
              <h3>{phase.title}</h3>
              <p>{phase.copy}</p>
              <div className="process-output"><strong>Output</strong><span>{phase.output}</span></div>
            </li>
          ))}
        </ol>
        <div className="section-link"><ButtonLink href="/process" variant="light">See the complete process</ButtonLink></div>
      </Container>
    </section>
  );
}

export function CapabilityWorkSection({ compact = false }: { compact?: boolean }) {
  const icons = [ShieldCheck, Workflow, Rocket] as const;
  return (
    <section className={`section section--surface capability-work ${compact ? "capability-work--compact" : ""}`}>
      <Container>
        <SectionIntro
          eyebrow={capabilityLedWorkAlternative.eyebrow}
          title={capabilityLedWorkAlternative.heading}
          copy={capabilityLedWorkAlternative.copy}
        />
        <div className="capability-work__grid">
          {capabilityLedWorkAlternative.items.map((item, index) => {
            const Icon = icons[index];
            return (
              <article key={item.title}>
                <div><Icon aria-hidden="true" /><span>Commitment / 0{index + 1}</span></div>
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}

export function FaqSection({ ids = homepageFaqIds }: { ids?: readonly string[] }) {
  const selectedFaqs = ids
    .map((id) => faqs.find((faq) => faq.id === id))
    .filter((faq): faq is (typeof faqs)[number] => Boolean(faq));

  return (
    <section className="section section--paper faq-section">
      <Container>
        <div className="faq-layout">
          <div className="faq-heading">
            <p className="eyebrow">Straight answers</p>
            <h2>Questions before you take the next step</h2>
            <p>No technical specification is required. These answers explain what happens before paid work begins.</p>
          </div>
          <div className="faq-list">
            {selectedFaqs.map((faq, index) => (
              <details key={faq.id} open={index === 0}>
                <summary><span>{faq.question}</span><i aria-hidden="true" /></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export function FinalCta() {
  return (
    <section className="final-cta">
      <Container>
        <div>
          <p className="eyebrow">A practical first step</p>
          <h2>Have a problem worth turning into software?</h2>
          <p>Share the workflow, who it affects, and what a better outcome would look like. We will review the fit and recommend a practical next step.</p>
        </div>
        <div className="final-cta__action">
          <ButtonLink href="/apply" variant="light">Start the project fit check</ButtonLink>
          <p>6–8 minutes · No account or payment · Qualified enquiries can book a free call</p>
        </div>
      </Container>
    </section>
  );
}

export function HomePricing({ market = "uk" }: { market?: MarketKey }) {
  return <PricingSection initialMarket={market} showMarketToggle />;
}
