import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Container, SectionIntro, Breadcrumbs } from "@/src/components/ui/primitives";
import { FinalCta } from "@/src/components/marketing/sections";
import { workingPrinciples } from "@/src/content/about";

export const metadata: Metadata = {
  title: "About NeedFoundry Product Studio",
  description: "Why NeedFoundry keeps product thinking connected to custom software design, engineering, launch, and iteration.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MainShell>
      <PageHero eyebrow="About NeedFoundry" title="Product-first thinking, practical shipping." copy="NeedFoundry helps people who understand a real market problem turn that insight into a focused AI-native software launch.">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </PageHero>
      <section className="section section--surface">
        <Container>
          <div className="story-grid">
            <div><p className="eyebrow">Why NeedFoundry exists</p><h2>Good software starts before the first line of code.</h2></div>
            <div><p>Industry experts often understand a meaningful problem in detail, but they need a practical path to validate whether, and how, to build.</p><p>NeedFoundry combines validation, product shaping, engineering, and delivery in one accountable path. We reduce uncertainty before scope expands and build one complete workflow people can use.</p></div>
          </div>
        </Container>
      </section>
      <section className="section section--paper">
        <Container>
          <SectionIntro eyebrow="Working principles" title="Simple standards for difficult product decisions" />
          <div className="principles-grid principles-grid--three">
            {workingPrinciples.map((principle, index) => <article key={principle.title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{principle.title}</h3><p>{principle.copy}</p></article>)}
          </div>
        </Container>
      </section>
      <section className="section section--ink">
        <Container>
          <div className="availability-note"><Globe2 aria-hidden="true" /><div><p className="eyebrow">Remote collaboration</p><h2>Available for UK, US, and selected international projects.</h2><p>Market-specific starting prices are shown in GBP and USD. Scope, working hours, and communication expectations are agreed before delivery begins.</p></div></div>
        </Container>
      </section>
      <FinalCta />
    </MainShell>
  );
}
