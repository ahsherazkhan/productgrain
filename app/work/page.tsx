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
const hasPublishedWork = work.length >= 2;

export const metadata: Metadata = {
  title: hasPublishedWork ? "Product References" : "Delivery Standards",
  description: hasPublishedWork
    ? "Explore sourced industry references across AI, SaaS, healthcare, finance, and operational software."
    : "See how NeedFoundry makes product scope, progress, and risk visible before each delivery commitment.",
  alternates: { canonical: "/work" },
  robots: hasPublishedWork ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const [featured, ...supporting] = work;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": hasPublishedWork ? "CollectionPage" : "WebPage",
    name: hasPublishedWork ? "NeedFoundry product references" : "NeedFoundry delivery standards",
    description: metadata.description,
    ...(siteConfig.siteUrl ? { url: `${siteConfig.siteUrl}/work` } : {}),
    ...(hasPublishedWork
      ? {
          hasPart: work.map((item) => ({
            "@type": "Article",
            name: item.title,
            author: {
              "@type": "Organization",
              name: siteConfig.brandName,
            },
            publisher: {
              "@type": "Organization",
              name: siteConfig.brandName,
            },
            about: {
              "@type": "SoftwareApplication",
              name: item.clientName,
            },
            citation: item.provenance.sourceUrl,
            isBasedOn: item.provenance.sourceUrl,
            ...(siteConfig.siteUrl
              ? { url: `${siteConfig.siteUrl}/work/${item.slug}` }
              : {}),
          })),
        }
      : {}),
  };

  return (
    <MainShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <PageHero
        eyebrow={hasPublishedWork ? "Industry references" : "Delivery standards"}
        title={
          hasPublishedWork
            ? "Digital products shaped around real operating problems."
            : "Clear decisions before deeper delivery commitments."
        }
        copy={
          hasPublishedWork
            ? "Publicly documented products selected for the useful product patterns they illustrate. Every profile links to its original source."
            : "NeedFoundry makes scope, progress, responsibilities, and product risk visible before each commitment is made."
        }
      >
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Work" }]}
        />
      </PageHero>

      {featured && hasPublishedWork ? (
        <section className="section section--surface work-index">
          <Container>
            <h2 className="visually-hidden">Industry product references</h2>
            <div className="work-index__lead">
              <WorkCard item={featured} variant="featured" priority />
            </div>
            <div className="work-index__grid">
              {supporting.map((item) => (
                <WorkCard item={item} key={item.slug} />
              ))}
            </div>
            <p className="work-index__note">
              Each profile identifies its original publisher. Reported outcomes remain attributed to that source.
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
