import type { Metadata } from "next";
import { CampaignLanding } from "@/src/components/marketing/campaign-landing";
import { markets } from "@/src/config/markets";
import { siteConfig, siteMetadata } from "@/src/config/site";

export const metadata: Metadata = {
  title: { absolute: markets.uk.landingTitle },
  description: markets.uk.landingDescription,
  alternates: {
    canonical: markets.uk.landingPath,
    languages: {
      "en-GB": "/mvp-development/uk",
      "en-US": "/mvp-development/us",
      "x-default": "/mvp-development",
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    locale: "en_GB",
    title: markets.uk.landingTitle,
    description: markets.uk.landingDescription,
    images: [{ url: siteMetadata.socialImage, width: 1200, height: 630, alt: siteMetadata.openGraphAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: markets.uk.landingTitle,
    description: markets.uk.landingDescription,
    images: [{ url: siteMetadata.socialImage, alt: siteMetadata.openGraphAlt }],
  },
};

export default function UkLandingPage() {
  return <CampaignLanding market="uk" />;
}
