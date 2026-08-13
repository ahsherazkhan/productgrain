import type { Metadata } from "next";
import { CampaignLanding } from "@/src/components/marketing/campaign-landing";
import { markets } from "@/src/config/markets";

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
    locale: "en_US",
    title: markets.us.landingTitle,
    description: markets.us.landingDescription,
  },
};

export default function UsLandingPage() {
  return <CampaignLanding market="us" />;
}

