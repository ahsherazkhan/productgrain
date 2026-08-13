import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Breadcrumbs, Container, ButtonLink } from "@/src/components/ui/primitives";
import { CapabilityWorkSection, FinalCta } from "@/src/components/marketing/sections";
import { getPublishedCaseStudies } from "@/src/content/case-studies";

export const metadata: Metadata = { title: "Selected Product Work", description: "A transparent view of NeedFoundry product decisions, delivery artifacts, and verified client work when permission is available.", alternates: { canonical: "/work" } };

export default function WorkPage() {
  const work = getPublishedCaseStudies();
  return <MainShell>
    <PageHero eyebrow="Selected work" title="The work is more than the interface." copy="A useful case study explains the original workflow, the product decision, what was deliberately excluded, what the team built, and what could be verified."><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} /></PageHero>
    {work.length < 2 ? <CapabilityWorkSection /> : <section className="section"><Container><div className="case-study-grid">{work.map((item) => <article key={item.slug}><p>{item.industry}</p><h2>{item.title}</h2><p>{item.summary}</p><ButtonLink href={`/work/${item.slug}`} variant="secondary">Read the case study</ButtonLink></article>)}</div></Container></section>}
    <section className="section section--muted"><Container><div className="evidence-standard"><p className="eyebrow">Publication standard</p><h2>Proof should remain useful when you ask a second question.</h2><div><p>Every published project must include permission, an honest client situation, important assumptions, scope exclusions, founder and team roles, verified results, and screenshots that can legally be shown.</p><p>Until that material is available, capability evidence is more trustworthy than invented numbers, anonymous praise, or decorative logos.</p></div></div></Container></section>
    <FinalCta />
  </MainShell>;
}

