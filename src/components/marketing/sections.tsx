import Link from "next/link";
import Image from "next/image";
import {
  ArrowDown,
  ArrowRight,
  Bot,
  Boxes,
  BriefcaseBusiness,
  Building2,
  Check,
  CircleDot,
  Code2,
  FileSearch,
  Gauge,
  Layers3,
  Lightbulb,
  MessageSquareText,
  Network,
  Rocket,
  Route,
  ShieldCheck,
  Sparkles,
  UserRound,
  Workflow,
  ExternalLink,
} from "lucide-react";
import { Container, SectionIntro, ButtonLink } from "@/src/components/ui/primitives";
import { homepageServices } from "@/src/content/services";
import { faqs } from "@/src/content/faqs";
import { capabilityLedWorkAlternative } from "@/src/content/case-studies";
import {
  founderProfile,
  founderSection,
  getPublishedTeamMembers,
} from "@/src/content/team";
import { PricingSection } from "./pricing-section";
import type { MarketKey } from "@/src/config/markets";

const capabilities = [
  "Product strategy",
  "UX and UI design",
  "Full-stack engineering",
  "AI integrations",
  "Quality assurance",
  "Deployment and launch support",
] as const;

const problemCards = [
  {
    number: "01",
    title: "Understand before building",
    copy: "We clarify the user, the problem, and the current process before recommending a product direction.",
    icon: FileSearch,
  },
  {
    number: "02",
    title: "Cut scope, not quality",
    copy: "A smaller first release should still complete one useful workflow from beginning to end.",
    icon: Layers3,
  },
  {
    number: "03",
    title: "Keep product and engineering together",
    copy: "The context used to shape the product stays with the team responsible for designing and building it.",
    icon: Code2,
  },
] as const;

const audiences = [
  { title: "Industry experts", copy: "Turn repeated industry problems into focused software products.", icon: Lightbulb },
  { title: "Business owners", copy: "Replace manual processes, disconnected tools, and repetitive follow-ups.", icon: Building2 },
  { title: "Consultants", copy: "Convert repeatable expertise into a client-facing platform or SaaS product.", icon: BriefcaseBusiness },
  { title: "Nontechnical founders", copy: "Move from an idea to a structured product without first finding a technical cofounder.", icon: UserRound },
] as const;

export const processSteps = [
  {
    number: "01",
    verb: "Discuss",
    title: "Free Product Clarity Call",
    copy: "Tell us about the problem, the current workflow, the intended users, and the outcome you are trying to create.",
    output: "High-level product direction and recommended next step.",
  },
  {
    number: "02",
    verb: "Define",
    title: "Blueprint and Prototype",
    copy: "Map the core workflow, prioritize the first release, and visualize the product before major development begins.",
    output: "User flow, prioritized scope, prototype, and development direction.",
  },
  {
    number: "03",
    verb: "Build",
    title: "Focused MVP Development",
    copy: "Design, develop, test, and deploy one complete version of the product with clear milestones and weekly visibility.",
    output: "A production-ready first release.",
  },
  {
    number: "04",
    verb: "Learn",
    title: "Launch and Improve",
    copy: "Observe how the first users behave, fix friction, and prioritize the next product decisions using evidence.",
    output: "A practical post-launch roadmap.",
  },
] as const;

const serviceIcons = [Route, Sparkles, Code2, Bot, Network, Rocket] as const;

const productTypes = [
  "B2B SaaS products",
  "Client and partner portals",
  "Internal workflow applications",
  "AI-assisted business tools",
  "Dashboards and reporting systems",
  "Booking and case-management systems",
  "Document and knowledge platforms",
  "Marketplaces and multi-user platforms",
  "Mobile-friendly web products",
  "Existing-product improvements",
] as const;

export function HomeHero() {
  return (
    <section className="home-hero ruled-bg">
      <Container className="home-hero__grid">
        <div className="home-hero__copy reveal">
          <p className="eyebrow"><span className="eyebrow-dot" /> Founder-led product strategy and engineering</p>
          <h1>Turn the problem you understand into software <em>people will use.</em></h1>
          <p className="hero-lead">
            You do not need a technical specification or a complete feature list. We help industry experts, business owners, and nontechnical founders clarify the opportunity, shape the right first version, and build it with an in-house product and engineering team.
          </p>
          <div className="button-row">
            <ButtonLink href="/apply">Discuss your idea — free</ButtonLink>
            <ButtonLink href="/process" variant="secondary">See how we work</ButtonLink>
          </div>
          <p className="trust-line"><span>No technical specification required</span><span>No hidden consultation fee</span><span>Milestone-based delivery</span></p>
        </div>

        <div className="decision-map reveal reveal--delay" aria-label="Product journey from industry knowledge to real-user learning">
          <div className="decision-map__header">
            <span>Product path / 01</span>
            <span className="status"><i /> Practical first release</span>
          </div>
          <ol>
            <li className="decision-node decision-node--raw">
              <span className="decision-node__index">01</span>
              <span className="decision-node__icon"><MessageSquareText aria-hidden="true" /></span>
              <span><small>Input</small><strong>Industry knowledge</strong></span>
              <ArrowDown aria-hidden="true" className="decision-arrow" />
            </li>
            <li className="decision-node">
              <span className="decision-node__index">02</span>
              <span className="decision-node__icon"><Route aria-hidden="true" /></span>
              <span><small>Decision</small><strong>Clear product direction</strong></span>
              <ArrowDown aria-hidden="true" className="decision-arrow" />
            </li>
            <li className="decision-node decision-node--active">
              <span className="decision-node__index">03</span>
              <span className="decision-node__icon"><Boxes aria-hidden="true" /></span>
              <span><small>Release</small><strong>Focused MVP</strong></span>
              <ArrowDown aria-hidden="true" className="decision-arrow" />
            </li>
            <li className="decision-node">
              <span className="decision-node__index">04</span>
              <span className="decision-node__icon"><Gauge aria-hidden="true" /></span>
              <span><small>Evidence</small><strong>Real-user learning</strong></span>
            </li>
          </ol>
          <div className="decision-map__footer"><span>Problem clarified</span><span>Scope reduced</span><span>Learning enabled</span></div>
        </div>
      </Container>
    </section>
  );
}

export function CapabilityStrip() {
  return (
    <section className="capability-strip" aria-label="NeedFoundry capabilities">
      <Container>
        <p>Founder-led and delivered by an in-house team.</p>
        <div>{capabilities.map((capability) => <span key={capability}><CircleDot aria-hidden="true" size={13} />{capability}</span>)}</div>
      </Container>
    </section>
  );
}

export function ProblemSection() {
  return (
    <section className="section section--paper">
      <Container>
        <SectionIntro
          eyebrow="The product decision"
          title="Most development teams begin with your feature list. We begin with the decision behind it."
          copy="A feature list does not explain whether the product solves the right problem. We start with the customer, the workflow, the current workaround, and the outcome the product needs to create."
        />
        <div className="three-card-grid">
          {problemCards.map(({ number, title, copy, icon: Icon }) => (
            <article className="editorial-card reveal" key={title}>
              <div className="editorial-card__top"><span>{number}</span><Icon aria-hidden="true" /></div>
              <h3>{title}</h3><p>{copy}</p>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function AudienceSection() {
  const fitItems = [
    "You understand a real customer or workflow problem.",
    "You can explain how the problem is currently handled.",
    "You are open to reducing the first release.",
    "You can reach potential users or internal stakeholders.",
    "You want a team that contributes product thinking, not only code.",
  ];
  return (
    <section className="section section--surface">
      <Container>
        <SectionIntro eyebrow="Who we work with" title="Built for people who know the problem—even when they do not know the technology." />
        <div className="audience-layout">
          <div className="audience-grid">
            {audiences.map(({ title, copy, icon: Icon }) => <article key={title}><Icon aria-hidden="true" /><h3>{title}</h3><p>{copy}</p></article>)}
          </div>
          <aside className="fit-panel">
            <p className="eyebrow">Fit check</p><h3>A strong fit usually looks like this</h3>
            <ul>{fitItems.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
            <Link href="/apply">Check your product fit <ArrowRight aria-hidden="true" size={16} /></Link>
          </aside>
        </div>
      </Container>
    </section>
  );
}

export function ProcessSection({ campaign = false }: { campaign?: boolean }) {
  return (
    <section className="section section--ink" id="how-it-works">
      <Container>
        <SectionIntro eyebrow="A measurable path" title="From an unclear idea to a focused product" copy="Each stage creates a decision or deliverable before the next commitment is made." />
        <ol className="process-grid">
          {processSteps.map((step) => (
            <li key={step.number}>
              <div className="process-grid__number"><span>{step.number}</span><i /></div>
              <p className="process-verb">{step.verb}</p>
              <h3>{step.title}</h3><p>{step.copy}</p>
              <div className="process-output"><strong>Output</strong><span>{step.output}</span></div>
            </li>
          ))}
        </ol>
        {!campaign ? <div className="section-link"><ButtonLink href="/process" variant="light">See the complete process</ButtonLink></div> : null}
      </Container>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="section section--paper">
      <Container>
        <SectionIntro eyebrow="One accountable team" title="Product thinking and engineering in one team" copy="The same context that shapes the product stays present through design, development, quality assurance, and launch." />
        <div className="services-grid">
          {homepageServices.map((service, index) => {
            const Icon = serviceIcons[index];
            return <article key={service.id} className="service-card"><Icon aria-hidden="true" /><h3>{service.title}</h3><p>{service.description}</p><ul>{service.capabilities.map((item) => <li key={item}>{item}</li>)}</ul></article>;
          })}
        </div>
        <div className="section-link"><ButtonLink href="/services" variant="secondary">Explore our services</ButtonLink></div>
      </Container>
    </section>
  );
}

export function ProductTypesSection() {
  return (
    <section className="section section--muted">
      <Container>
        <div className="split-heading"><SectionIntro eyebrow="Product possibilities" title="What can we build?" /><p>Have something different in mind? Bring us the problem and we will help determine the right approach.</p></div>
        <div className="product-type-grid">{productTypes.map((item, index) => <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><p>{item}</p><ArrowRight aria-hidden="true" /></div>)}</div>
      </Container>
    </section>
  );
}

export function CapabilityWorkSection({ compact = false }: { compact?: boolean }) {
  const icons = [Workflow, ShieldCheck, Rocket];
  return (
    <section className={`section section--surface capability-work ${compact ? "capability-work--compact" : ""}`}>
      <Container>
        <SectionIntro eyebrow={capabilityLedWorkAlternative.eyebrow} title={capabilityLedWorkAlternative.heading} copy={capabilityLedWorkAlternative.copy} />
        <div className="capability-work__grid">
          {capabilityLedWorkAlternative.items.map((item, index) => {
            const Icon = icons[index];
            return <article key={item.title}><div><Icon aria-hidden="true" /><span>Artifact / 0{index + 1}</span></div><h3>{item.title}</h3><p>{item.copy}</p></article>;
          })}
        </div>
        {!compact ? <p className="proof-note">Verified client work will appear here only when publication permission and result verification are complete.</p> : null}
      </Container>
    </section>
  );
}

export function FounderSection({ campaign = false }: { campaign?: boolean }) {
  const initials = founderProfile.name ? founderProfile.name.split(" ").map((part) => part[0]).slice(0, 2).join("") : "NF";
  const showProfile = founderProfile.published && founderProfile.name;
  const showPhoto = showProfile && founderProfile.photograph;
  const showVideo =
    campaign &&
    showProfile &&
    founderProfile.introductionVideo &&
    founderProfile.videoPoster &&
    founderProfile.videoCaptions;
  return (
    <section className="section section--paper founder-section">
      <Container className="founder-grid">
        <div className="founder-visual" aria-label={showPhoto ? undefined : "NeedFoundry founder profile mark"}>
          {showPhoto ? (
            <Image
              src={founderProfile.photograph!}
              alt={founderProfile.photographAlt || `${founderProfile.name}, ${founderProfile.role}`}
              fill
              sizes="(max-width: 820px) 100vw, 40vw"
              className="founder-photo"
            />
          ) : (
            <div className="founder-initials"><span>{initials}</span></div>
          )}
          <div className="founder-caption"><span className="status-dot" />Founder directly involved</div>
        </div>
        <div>
          <p className="eyebrow">Founder and team</p><h2>{founderSection.heading}</h2><p className="founder-copy">{founderSection.copy}</p>
          {showProfile ? (
            <div className="founder-profile-line">
              <span><strong>{founderProfile.name}</strong>{founderProfile.role}</span>
              {founderProfile.linkedInUrl ? <a href={founderProfile.linkedInUrl} target="_blank" rel="noreferrer" aria-label={`${founderProfile.name} on LinkedIn`}><ExternalLink aria-hidden="true" /></a> : null}
            </div>
          ) : null}
          <div className="founder-principles">
            <div><strong>One line of context</strong><span>Product direction stays connected to delivery.</span></div>
            <div><strong>Weekly visibility</strong><span>Decisions, progress, trade-offs, and risks stay visible.</span></div>
          </div>
          {showVideo ? (
            <video className="founder-video" controls preload="none" poster={founderProfile.videoPoster!}>
              <source src={founderProfile.introductionVideo!} />
              <track kind="captions" src={founderProfile.videoCaptions!} srcLang="en" label="English" default />
            </video>
          ) : campaign ? (
            <p className="founder-note">Direct senior involvement keeps early product decisions connected to the people responsible for delivery.</p>
          ) : (
            <ButtonLink href="/about" variant="secondary">Why NeedFoundry exists</ButtonLink>
          )}
        </div>
      </Container>
    </section>
  );
}

export function TeamGrid() {
  const members = getPublishedTeamMembers();
  if (members.length === 0) {
    return (
      <div className="team-empty-state">
        <div className="team-avatar-stack"><span>NF</span><span><Check aria-hidden="true" /></span></div>
        <div><p className="eyebrow">How we work</p><h2>Small, accountable product teams.</h2><p>NeedFoundry keeps product direction close to design and engineering, with clear ownership, direct communication, and specialist input added only where the work needs it.</p></div>
      </div>
    );
  }

  return (
    <div className="team-grid">
      {members.map((member) => (
        <article key={member.name}>
          <div className="team-member-image">
            {member.photograph ? <Image src={member.photograph} alt={member.photographAlt || `${member.name}, ${member.role}`} fill sizes="(max-width: 600px) 100vw, 33vw" /> : <span>{member.name.split(" ").map((part) => part[0]).slice(0, 2).join("")}</span>}
          </div>
          <div className="team-member-copy"><p>{member.role}</p><h3>{member.name}</h3><span>{member.biography}</span>{member.linkedInUrl ? <a href={member.linkedInUrl} target="_blank" rel="noreferrer"><ExternalLink aria-hidden="true" />LinkedIn</a> : null}</div>
        </article>
      ))}
    </div>
  );
}

export function FaqSection() {
  return (
    <section className="section section--surface faq-section">
      <Container>
        <div className="faq-layout">
          <div className="faq-heading"><p className="eyebrow">Straight answers</p><h2>Questions before the first conversation</h2><p>No technical specification is required. These answers explain what is useful, what happens next, and where the boundaries are.</p></div>
          <div className="faq-list">
            {faqs.map((faq, index) => <details key={faq.id} open={index === 0}><summary><span>{faq.question}</span><i aria-hidden="true" /></summary><p>{faq.answer}</p></details>)}
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
        <div><p className="eyebrow">A useful first conversation</p><h2>You do not need to have the whole product figured out before the first conversation.</h2><p>Tell us about the problem, the current workflow, and who experiences it. We will help identify the most practical next step.</p></div>
        <div className="final-cta__action"><ButtonLink href="/apply" variant="light">Discuss your idea — free</ButtonLink><p>Thirty-minute product call · No obligation · No hidden consultation fee</p></div>
      </Container>
    </section>
  );
}

export function HomePricing({ market = "uk" }: { market?: MarketKey }) {
  return <PricingSection initialMarket={market} showMarketToggle />;
}
