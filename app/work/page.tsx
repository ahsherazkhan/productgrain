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
    ? "Explore approved NeedFoundry client work across focused software products and AI-enabled workflows."
    : "See how NeedFoundry makes product scope, progress, and risk visible before each delivery commitment.",
  alternates: { canonical: "/work" },
  robots: hasPublishedWork ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const [featured, ...supporting] = work;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": hasPublishedWork ? "CollectionPage" : "WebPage",
    name: hasPublishedWork ? "NeedFoundry client work" : "NeedFoundry delivery standards",
    description: metadata.description,
    ...(siteConfig.siteUrl ? { url: `${siteConfig.siteUrl}/work` } : {}),
    ...(hasPublishedWork
      ? {
          hasPart: work.map((item) => ({
            "@type": "CreativeWork",
            name: item.title,
            about: item.clientName,
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
            ? "Approved NeedFoundry client projects, published with permission and reviewed for accurate scope and outcomes."
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
            <h2 className="visually-hidden">Selected client work</h2>
            <div className="work-index__lead">
              <WorkCard item={featured} variant="featured" priority />
            </div>
            <div className="work-index__grid">
              {supporting.map((item) => (
                <WorkCard item={item} key={item.slug} />
              ))}
            </div>
            <p className="work-index__note">
              Only client work with confirmed publication permission is shown. Results are included only when their source, timeframe, and approval are recorded.
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
