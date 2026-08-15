import type { Metadata } from "next";
import { Globe2 } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Container, SectionIntro, Breadcrumbs } from "@/src/components/ui/primitives";
import { FinalCta } from "@/src/components/marketing/sections";
import { workingPrinciples } from "@/src/content/about";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: { absolute: `About ${siteConfig.brandName}` },
  description: `${siteConfig.brandName} helps people with deep industry knowledge turn real workflow problems into focused AI-native software.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <MainShell>
      <PageHero eyebrow={`About ${siteConfig.brandName}`} title="Built around how your market actually works." copy={`${siteConfig.brandName} helps people with deep industry knowledge turn real workflow problems into focused AI-native software.`}>
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
      </PageHero>
      <section className="section section--surface">
        <Container>
          <div className="story-grid">
            <div><p className="eyebrow">Why {siteConfig.brandName} exists</p><h2>Work with the grain of the market.</h2></div>
            <div><p>Every market has a grain: the workflows, constraints, decisions, and hard-won knowledge that shape how work really gets done.</p><p>We learn that context before deciding what to build. Then we connect research, validation, design, and engineering in one accountable path—from a promising problem to software people can use.</p></div>
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
