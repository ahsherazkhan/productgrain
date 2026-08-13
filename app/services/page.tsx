import type { Metadata } from "next";
import { ArrowRight, Check } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Container, SectionIntro, ButtonLink, Breadcrumbs } from "@/src/components/ui/primitives";
import { services } from "@/src/content/services";
import { FinalCta } from "@/src/components/marketing/sections";

export const metadata: Metadata = { title: "Product Strategy, Design and Development Services", description: "Product discovery, UX design, full-stack development, AI workflows, integrations, launch support, and ongoing product development.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return <MainShell>
    <PageHero eyebrow="Services" title="Product strategy, design, and engineering—from one accountable team." copy="Bring the business problem and current workflow. We help decide what belongs in the first release, then design and build it without separating product decisions from delivery.">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
    </PageHero>
    <section className="section section--paper"><Container><SectionIntro eyebrow="The full product path" title="Support at the point your product actually needs it" copy="Begin with clarity, a prototype, a focused build, or an existing product. The engagement is shaped around the decision in front of you." />
      <div className="detailed-services">{services.map((service, index) => <article key={service.id} id={service.slug}><div className="detailed-service__number">{String(index + 1).padStart(2, "0")}</div><div><h2>{service.title}</h2><p>{service.description}</p><ul>{service.capabilities.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div><aside><span>Client outcome</span><p>{service.clientOutcome}</p><ArrowRight aria-hidden="true" /></aside></article>)}</div>
    </Container></section>
    <section className="section section--muted"><Container><div className="tech-note"><div><p className="eyebrow">Technology follows the product</p><h2>No stack catalogue in the sales pitch.</h2></div><div><p>We choose the product architecture after understanding the users, workflow, integrations, data, launch expectations, and long-term constraints.</p><p>That may include modern web applications, structured databases, secure authentication, third-party APIs, product analytics, and carefully bounded AI services.</p><ButtonLink href="/apply" variant="secondary">Discuss your product</ButtonLink></div></div></Container></section>
    <FinalCta />
  </MainShell>;
}

