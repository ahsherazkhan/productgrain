import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import {
  CapabilityWorkSection,
  FaqSection,
  FitSection,
  FinalCta,
  AiOpportunitySection,
  HomeHero,
  HomePricing,
  ProcessSection,
} from "@/src/components/marketing/sections";
import { siteConfig, siteMetadata } from "@/src/config/site";
import { defaultMarket } from "@/src/config/markets";
import { homepageCoreFaqIds } from "@/src/content/home";

export const metadata: Metadata = {
  title: { absolute: siteMetadata.title },
  description: siteMetadata.description,
  alternates: { canonical: "/" },
};

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: siteConfig.brandName,
        description: siteConfig.description,
        ...(siteConfig.siteUrl ? { url: siteConfig.siteUrl } : {}),
      },
      {
        "@type": "ProfessionalService",
        name: siteConfig.brandName,
        areaServed: ["United Kingdom", "United States", "International"],
        slogan: siteConfig.tagline,
        description: siteConfig.description,
      },
      {
        "@type": "Service",
        name: "Product strategy, product discovery, and focused software development",
        provider: { "@type": "Organization", name: siteConfig.brandName },
        areaServed: ["GB", "US"],
      },
    ],
  };
  return (
    <MainShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeHero />
      <FitSection />
      <ProcessSection />
      <CapabilityWorkSection compact />
      <HomePricing market={defaultMarket} />
      <AiOpportunitySection />
      <FaqSection ids={homepageCoreFaqIds} />
      <FinalCta />
    </MainShell>
  );
}
