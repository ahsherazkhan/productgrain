import type { Metadata } from "next";
import { Check } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Container, SectionIntro, ButtonLink, Breadcrumbs } from "@/src/components/ui/primitives";
import { serviceGroups } from "@/src/content/services";
import { FinalCta } from "@/src/components/marketing/sections";
import { RouteEngagement } from "@/src/components/analytics/route-engagement";

export const metadata: Metadata = { title: "Product Strategy, Design and Development Services", description: "Product discovery, UX design, full-stack development, AI workflows, integrations, launch support, and ongoing product development.", alternates: { canonical: "/services" } };

export default function ServicesPage() {
  return <MainShell>
    <RouteEngagement event="service_view" metaEvent="ViewContent" properties={{ content: "services" }} />
    <PageHero eyebrow="Services" title="From product decision to working software." copy="Start with a real problem, an existing workflow, or a product that needs improving. We shape the smallest useful engagement around the decision in front of you.">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Services" }]} />
    </PageHero>
    <section className="section section--paper"><Container><SectionIntro eyebrow="Choose the useful starting point" title="Four ways we can move the product forward" copy="Product decisions stay connected to design and engineering throughout the engagement." />
      <div className="service-group-grid">{serviceGroups.map((service, index) => <article key={service.title}><span className="card-tag">{String(index + 1).padStart(2, "0")}</span><h2>{service.title}</h2><p>{service.description}</p><ul>{service.capabilities.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul><div className="service-group__outcome"><strong>Outcome</strong><p>{service.outcome}</p></div></article>)}</div>
    </Container></section>
    <section className="section section--muted"><Container><div className="tech-note"><div><p className="eyebrow">Technology follows the product</p><h2>The workflow determines the architecture.</h2></div><div><p>We choose the approach after understanding users, data, integrations, launch expectations, and long-term constraints—not from a stack catalogue.</p><ButtonLink href="/apply" variant="secondary">Tell us about your product</ButtonLink></div></div></Container></section>
    <FinalCta />
  </MainShell>;
}
