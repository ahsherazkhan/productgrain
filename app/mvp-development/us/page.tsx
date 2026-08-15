import type { Metadata } from "next";
import { CampaignLanding } from "@/src/components/marketing/campaign-landing";
import { markets } from "@/src/config/markets";
import { siteConfig, siteMetadata } from "@/src/config/site";

export const metadata: Metadata = {
  title: { absolute: markets.us.landingTitle },
  description: markets.us.landingDescription,
  alternates: {
    canonical: markets.us.landingPath,
    languages: {
      "en-GB": "/mvp-development/uk",
      "en-US": "/mvp-development/us",
      "x-default": "/mvp-development",
    },
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    locale: "en_US",
    title: markets.us.landingTitle,
    description: markets.us.landingDescription,
    images: [{ url: siteMetadata.socialImage, width: 1200, height: 630, alt: siteMetadata.openGraphAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: markets.us.landingTitle,
    description: markets.us.landingDescription,
    images: [{ url: siteMetadata.socialImage, alt: siteMetadata.openGraphAlt }],
  },
};

export default function UsLandingPage() {
  return <CampaignLanding market="us" />;
}
