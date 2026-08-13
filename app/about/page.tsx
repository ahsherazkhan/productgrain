import type { Metadata } from "next";
import { Globe2, Handshake, Wrench } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Container, SectionIntro, Breadcrumbs } from "@/src/components/ui/primitives";
import { FounderSection, FinalCta, TeamGrid } from "@/src/components/marketing/sections";

export const metadata: Metadata = { title: "About Our Founder-Led Product Studio", description: "Why NeedFoundry keeps product thinking connected to custom software design, engineering, launch, and iteration.", alternates: { canonical: "/about" } };

const principles = [
  ["Ask before assuming", "Understand the problem before recommending features."],
  ["Build the smallest complete workflow", "A focused product should still deliver meaningful value from beginning to end."],
  ["Keep clients close to the work", "Share decisions, progress, trade-offs, and risks throughout delivery."],
  ["Use evidence after launch", "Prioritize improvements using real behaviour and feedback."],
  ["Protect long-term maintainability", "Move quickly without creating software that immediately needs to be rebuilt."],
] as const;

export default function AboutPage() {
  return <MainShell>
    <PageHero eyebrow="About NeedFoundry" title="Product thinking should not disappear when development begins." copy="NeedFoundry exists to keep the product decision, user workflow, design, and engineering context together from the first conversation through launch."><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} /></PageHero>
    <section className="section section--surface"><Container><div className="story-grid"><div><p className="eyebrow">Why the company exists</p><h2>Good software starts before the first line of code.</h2></div><div><p>Industry experts and operators often understand a valuable problem in detail. What they lack is not ambition—it is a reliable way to translate that knowledge into product decisions.</p><p>NeedFoundry brings product strategy, design, engineering, quality assurance, and launch support into one accountable path. The aim is to reduce uncertainty before scope expands, then build one complete workflow people can genuinely use.</p></div></div></Container></section>
    <FounderSection />
    <section className="section section--muted"><Container><SectionIntro eyebrow="Working principles" title="The standards that stay present when the work becomes difficult" /><div className="principles-grid">{principles.map(([title, copy], index) => <article key={title}><span>{String(index + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{copy}</p></article>)}</div></Container></section>
    <section className="section section--ink"><Container><div className="values-grid"><article><Handshake aria-hidden="true" /><h3>Close collaboration</h3><p>Clear decision-makers, milestone reviews, and honest trade-offs keep clients close without turning delivery into constant meetings.</p></article><article><Wrench aria-hidden="true" /><h3>In-house delivery model</h3><p>Product design, engineering, quality, and launch context remain connected within the team responsible for the outcome.</p></article><article><Globe2 aria-hidden="true" /><h3>Geographic availability</h3><p>We work remotely with English-speaking clients in the United Kingdom, United States, and selected international markets.</p></article></div></Container></section>
    <section className="section section--paper"><Container><TeamGrid /></Container></section>
    <FinalCta />
  </MainShell>;
}
