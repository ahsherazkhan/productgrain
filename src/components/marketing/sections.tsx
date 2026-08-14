import { Rocket, ShieldCheck, Workflow } from "lucide-react";
import { Container, SectionIntro, ButtonLink } from "@/src/components/ui/primitives";
import { faqs } from "@/src/content/faqs";
import {
  capabilityLedWorkAlternative,
  getPublishedCaseStudies,
} from "@/src/content/case-studies";
import { getPublishedTestimonials } from "@/src/content/testimonials";
import {
  aiOpportunityCards,
  engagementPhases,
  fitScenarios,
  homepageCoreFaqIds,
} from "@/src/content/home";
import { PricingSection } from "./pricing-section";
import { SelectedWorkSection } from "./selected-work";
import type { MarketKey } from "@/src/config/markets";

export function HomeHero() {
  return (
    <section className="home-hero home-hero--minimal ruled-bg">
      <Container>
        <div className="home-hero__minimal-copy reveal">
          <h1>The product-first studio for AI-native software.</h1>
          <p className="hero-lead">
            We help industry experts and nontechnical founders research real problems, validate product
            opportunities, and build software their market actually needs.
          </p>
          <p className="eyebrow">
            <span className="eyebrow-dot" />Product-first, AI-native studio
          </p>
          <div className="button-row">
            <ButtonLink href="/apply">Discuss your product idea — free</ButtonLink>
            <ButtonLink href="#how-it-works" variant="secondary">See how it works</ButtonLink>
          </div>
          <p className="hero-disclosure">
            No technical specification required · Free 6–8 minute fit check · Milestone-based delivery
          </p>
        </div>
      </Container>
    </section>
  );
}

export function TrustStrip() {
  const caseStudies = getPublishedCaseStudies().slice(0, 2);
  const testimonials = getPublishedTestimonials().slice(0, 2);
  if (!caseStudies.length && !testimonials.length) return null;

  const counts = [
    { label: "Verified case studies", value: caseStudies.length },
    { label: "Verified testimonials", value: testimonials.length },
    { label: "Markets covered", value: new Set(caseStudies.map((item) => item.industry)).size || "n/a" },
  ];

  return (
    <section className="section section--surface proof-strip">
      <Container>
        <div className="proof-strip__inner">
          {counts.map((item) => (
            <article key={item.label}>
              <p>{item.label}</p>
              <strong>{item.value}</strong>
            </article>
          ))}
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
          eyebrow="Core value proposition"
          title="AI should improve the workflow—not decorate the product."
          copy="We start with your people, current process, and business outcome. We recommend where AI creates leverage and where dependable software is the better solution."
        />
        <div className="three-card-grid fit-scenarios">
          {fitScenarios.map(({ title, copy, icon: Icon }, index) => (
            <article className="editorial-card" key={title}>
              <div className="editorial-card__top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <Icon aria-hidden="true" />
              </div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
        <div className="section-link section-link--left">
          <p className="hero-disclosure">Sometimes the best answer is a focused AI feature, simpler automation, or conventional software. We recommend the approach that best solves the problem.</p>
        </div>
      </Container>
    </section>
  );
}

export function AiOpportunitySection() {
  return (
    <section className="section section--surface">
      <Container>
        <SectionIntro
          eyebrow="Where AI creates leverage"
          title="Your industry knowledge could become an AI-native product."
          copy="Many businesses have repetitive research, documents, decisions, and specialist knowledge. We help identify where those workflows can become focused software products, scalable services, or stronger capabilities inside existing systems."
        />
        <div className="three-card-grid fit-scenarios">
          {aiOpportunityCards.map((card) => (
            <article className="editorial-card" key={card.title}>
              <h3>{card.title}</h3>
              <p>{card.copy}</p>
              <p>
                <strong>Commercial outcome:</strong> {card.outcome}
              </p>
            </article>
          ))}
        </div>
        <div className="section-link section-link--left">
          <ButtonLink href="/apply" variant="light">
            Explore your AI product opportunity
          </ButtonLink>
          <p className="hero-disclosure">No AI for AI’s sake. When simpler software is more reliable or economical, we recommend that route.</p>
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
          eyebrow="Our approach"
          title="From market problem to validated product."
          copy="Each step has a practical output and preserves one clear decision before moving forward."
        />
        <ol className="process-grid process-grid--three">
          {engagementPhases.map((phase) => (
            <li key={phase.number}>
              <div className="process-grid__number">
                <span>{phase.number}</span>
                <i />
              </div>
              <p className="process-verb">Step {phase.number}</p>
              <h3>{phase.title}</h3>
              <p>{phase.copy}</p>
              <div className="process-output">
                <strong>Outcome</strong>
                <span>{phase.output}</span>
              </div>
            </li>
          ))}
        </ol>
        <div className="section-link">
          <ButtonLink href="/process" variant="light">
            Explore the full approach
          </ButtonLink>
        </div>
        <div className="process-note">
          <p className="hero-disclosure">
            The initial Product Clarity Call is free. Deeper research, validation, and prototyping are included in paid Product Discovery.
          </p>
        </div>
      </Container>
    </section>
  );
}

export function CapabilityWorkSection({ compact = false }: { compact?: boolean }) {
  const icons = [ShieldCheck, Workflow, Rocket] as const;
  const caseStudies = getPublishedCaseStudies();

  if (caseStudies.length >= 2) return <SelectedWorkSection />;

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
                <div>
                  <Icon aria-hidden="true" />
                  <span>Commitment / 0{index + 1}</span>
                </div>
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

export function FaqSection({ ids = homepageCoreFaqIds }: { ids?: readonly string[] }) {
  const selectedFaqs = ids
    .map((id) => faqs.find((faq) => faq.id === id))
    .filter((faq): faq is (typeof faqs)[number] => Boolean(faq));

  return (
    <section className="section section--paper faq-section">
      <Container>
        <div className="faq-layout">
          <div className="faq-heading">
            <p className="eyebrow">Before you begin</p>
            <h2>Common questions</h2>
            <p>No technical specification is required. These answers explain what happens before any paid engagement begins.</p>
          </div>
          <div className="faq-list">
            {selectedFaqs.map((faq, index) => (
              <details key={faq.id} open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <i aria-hidden="true" />
                </summary>
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
          <p className="eyebrow">Understand the right next step</p>
          <h2>Have a workflow problem that deserves a real product?</h2>
          <p>Tell us about the issue you are solving and who it affects. We will recommend the most practical first direction and help you decide if the next step should be a Product Discovery, an MVP, or a larger custom build.</p>
        </div>
        <div className="final-cta__action">
          <ButtonLink href="/apply" variant="light">Discuss your idea — free</ButtonLink>
          <p>30-minute Product Clarity Call · Founder-led · No obligation · No technical specification required</p>
        </div>
      </Container>
    </section>
  );
}

export function HomePricing({ market = "uk" }: { market?: MarketKey }) {
  return <PricingSection initialMarket={market} showMarketToggle />;
}
