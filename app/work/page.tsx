import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import {
  CapabilityWorkSection,
  FinalCta,
} from "@/src/components/marketing/sections";
import { WorkCard } from "@/src/components/marketing/work-card";
import {
  Breadcrumbs,
  Container,
  PageHero,
} from "@/src/components/ui/primitives";
import { getPublishedCaseStudies } from "@/src/content/case-studies";
import { siteConfig } from "@/src/config/site";

const work = getPublishedCaseStudies();

export const metadata: Metadata = {
  title: "Product References",
  description:
    "Explore attributed product references and independent public product profiles across AI, SaaS, fintech, healthcare, and operational software.",
  alternates: { canonical: "/work" },
  robots: work.length >= 2 ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const [featured, ...supporting] = work;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Product references",
    description: metadata.description,
    ...(siteConfig.siteUrl ? { url: `${siteConfig.siteUrl}/work` } : {}),
    hasPart: work.map((item) => ({
      "@type": "CreativeWork",
      name: item.title,
      about: item.clientName,
      ...(siteConfig.siteUrl
        ? { url: `${siteConfig.siteUrl}/work/${item.slug}` }
        : {}),
    })),
  };

  return (
    <MainShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageHero
        eyebrow="Product references"
        title="Strong products, studied in context."
        copy="Attributed third-party case studies and independent public product profiles across AI, SaaS, fintech, healthcare, and operational software. These references show the kinds of problems NeedFoundry is equipped to reason about; they are not presented as NeedFoundry client work."
      >
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Work" }]}
        />
      </PageHero>

      {featured && work.length >= 2 ? (
        <section className="section section--surface work-index">
          <Container>
            <h2 className="visually-hidden">Selected product profiles</h2>
            <div className="work-index__lead">
              <WorkCard item={featured} variant="featured" priority />
            </div>
            <div className="work-index__grid">
              {supporting.map((item) => (
                <WorkCard item={item} key={item.slug} />
              ))}
            </div>
            <p className="work-index__note">
              Every third-party project is labelled with its original delivery partner and source. Product names, logos, imagery, and videos remain the property of their respective owners. Published outcomes are attributed and are not independently verified by NeedFoundry.
            </p>
          </Container>
        </section>
      ) : (
        <CapabilityWorkSection compact />
      )}

      <FinalCta />
    </MainShell>
  );
}
