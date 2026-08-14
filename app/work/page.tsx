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
  title: "Selected Client Products",
  description:
    "Explore selected client products across AI, SaaS, fintech, ticketing, hardware, and operational software.",
  alternates: { canonical: "/work" },
  robots: work.length >= 2 ? undefined : { index: false, follow: true },
};

export default function WorkPage() {
  const [featured, ...supporting] = work;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Selected client products",
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
        eyebrow="Selected client products"
        title="Software built around real operating problems."
        copy="A selection of products from previous client work across AI, SaaS, fintech, hardware, and consumer software. Each profile focuses on the public product and the workflow it supports."
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
              Product names and current public websites are shown with publication approval. All trademarks remain the property of their respective owners. NeedFoundry-authored profiles omit confidential delivery details and unsupported performance claims; claims visible inside captured websites are not independently verified.
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
