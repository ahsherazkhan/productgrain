import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Breadcrumbs, Container, ButtonLink } from "@/src/components/ui/primitives";
import { CapabilityWorkSection, FinalCta } from "@/src/components/marketing/sections";
import { getPublishedCaseStudies } from "@/src/content/case-studies";

const hasPublishedWork = getPublishedCaseStudies().length > 0;
export const metadata: Metadata = {
  title: "Selected Product Work",
  description: "A transparent view of NeedFoundry product decisions, delivery artifacts, and verified client work when permission is available.",
  alternates: { canonical: "/work" },
  robots: hasPublishedWork ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const work = getPublishedCaseStudies();
  return <MainShell>
    <PageHero eyebrow="Delivery expectations" title="What a focused engagement should make visible." copy="Useful delivery makes the problem, scope, trade-offs, progress, and next decision clear—not only the interface."><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Work" }]} /></PageHero>
    {work.length === 0 ? <CapabilityWorkSection /> : <section className="section"><Container><div className="case-study-grid">{work.map((item) => <article key={item.slug}><p>{item.industry}</p><h2>{item.title}</h2><p>{item.summary}</p><ButtonLink href={`/work/${item.slug}`} variant="secondary">Read the case study</ButtonLink></article>)}</div></Container></section>}
    <FinalCta />
  </MainShell>;
}
