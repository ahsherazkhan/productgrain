import type { Metadata } from "next";
import { Check } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Container, SectionIntro, Breadcrumbs } from "@/src/components/ui/primitives";
import { FinalCta } from "@/src/components/marketing/sections";
import { detailedProcessStages } from "@/src/content/home";

export const metadata: Metadata = {
  title: "Approach",
  description: "A clear, milestone-based path from market problem to a validated production release.",
  alternates: { canonical: "/process" },
};

export default function ProcessPage() {
  const needs = [
    "Domain knowledge and honest constraints.",
    "Access to users or stakeholders.",
    "A clear decision-maker.",
    "Timely feedback at agreed milestones.",
  ];

  return (
    <MainShell>
      <PageHero eyebrow="Approach" title="From market problem to a validated product." copy="Each stage has a practical output and a clear decision before the next commitment.">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Process" }]} />
      </PageHero>
      <section className="section section--surface">
        <Container>
          <SectionIntro eyebrow="Four visible stages" title="Make the next decision with better information." copy="The depth changes by engagement, but the path stays clear." />
          <ol className="process-stage-grid">
            {detailedProcessStages.map((stage) => (
              <li key={stage.number}>
                <span>{stage.number}</span>
                <h2>{stage.title}</h2>
                <p>{stage.copy}</p>
                <dl>
                  <div><dt>You receive</dt><dd>{stage.output}</dd></div>
                  <div><dt>Needed from you</dt><dd>{stage.clientInput}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <section className="section section--ink">
        <Container>
          <div className="client-needs client-needs--compact">
            <div><p className="eyebrow">Shared responsibility</p><h2>What we need from you</h2><p>You bring the domain context. We bring the product and engineering structure.</p></div>
            <ul>{needs.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul>
          </div>
        </Container>
      </section>
      <FinalCta />
    </MainShell>
  );
}
