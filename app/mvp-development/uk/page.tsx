import type { Metadata } from "next";
import { CampaignLanding } from "@/src/components/marketing/campaign-landing";
import { markets } from "@/src/config/markets";

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
    locale: "en_GB",
    title: markets.uk.landingTitle,
    description: markets.uk.landingDescription,
  },
};

export default function UkLandingPage() {
  return <CampaignLanding market="uk" />;
}

