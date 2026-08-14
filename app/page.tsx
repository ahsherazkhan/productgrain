import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import {
  CapabilityWorkSection,
  FaqSection,
  FitSection,
  FinalCta,
  HomeHero,
  HomePricing,
  ProcessSection,
} from "@/src/components/marketing/sections";
import { siteConfig, siteMetadata } from "@/src/config/site";
import { defaultMarket } from "@/src/config/markets";

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
      { "@type": "ProfessionalService", name: siteConfig.brandName, areaServed: ["United Kingdom", "United States", "International"], slogan: siteConfig.tagline, description: siteConfig.description },
      { "@type": "Service", name: "Product strategy, MVP development, and custom software", provider: { "@type": "Organization", name: siteConfig.brandName }, areaServed: ["GB", "US"] },
    ],
  };
  return (
    <MainShell>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <HomeHero />
      <FitSection />
      <ProcessSection />
      <HomePricing market={defaultMarket} />
      <CapabilityWorkSection compact />
      <FaqSection />
      <FinalCta />
    </MainShell>
  );
}
