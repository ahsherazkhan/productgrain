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
  title: hasPublishedWork ? "Client Work" : "Delivery Standards",
  description: hasPublishedWork
    ? "Explore verified NeedFoundry client work across AI, SaaS, healthcare, finance, and operational software."
    : `See how ${siteConfig.brandName} makes product scope, progress, and risk visible before each delivery commitment.`,
  alternates: { canonical: "/work" },
  robots: hasPublishedWork ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const [featured, ...supporting] = work;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": hasPublishedWork ? "CollectionPage" : "WebPage",
    name: hasPublishedWork ? "NeedFoundry client work" : `${siteConfig.brandName} delivery standards`,
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
              ...(item.provenance.kind === "verified-client-work"
                ? {
                    creator: {
                      "@type": "Organization",
                      name: item.provenance.deliveryName,
                    },
                  }
                : {}),
            },
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
        eyebrow={hasPublishedWork ? "Selected work" : "Delivery standards"}
        title={
          hasPublishedWork
            ? "Focused products, shaped around real operating problems."
            : "Clear decisions before deeper delivery commitments."
        }
        copy={
          hasPublishedWork
            ? "Products designed and built by NeedFoundry across AI, SaaS, healthcare, finance, and operational software."
            : `${siteConfig.brandName} makes scope, progress, responsibilities, and product risk visible before each commitment is made.`
        }
      >
        <Breadcrumbs
          items={[{ label: "Home", href: "/" }, { label: "Work" }]}
        />
      </PageHero>

      {featured && hasPublishedWork ? (
        <section className="section section--surface work-index">
          <Container>
            <h2 className="visually-hidden">Selected client work</h2>
            <div className="work-index__lead">
              <WorkCard item={featured} variant="featured" priority />
            </div>
            <div className="work-index__grid">
              {supporting.map((item) => (
                <WorkCard item={item} key={item.slug} />
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <CapabilityWorkSection compact />
      )}

      <FinalCta />
    </MainShell>
  );
}
