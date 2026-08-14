import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Breadcrumbs } from "@/src/components/ui/primitives";
import { PricingSection } from "@/src/components/marketing/pricing-section";
import { FaqSection, FinalCta } from "@/src/components/marketing/sections";
import { defaultMarket } from "@/src/config/markets";
import { pricingFaqIds } from "@/src/content/home";

export const metadata: Metadata = { title: "MVP and Product Development Pricing", description: "Market-specific starting prices for product blueprints, focused MVP builds, and custom software products in the UK and US.", alternates: { canonical: "/pricing" } };

export default function PricingPage() {
  return <MainShell><PageHero eyebrow="Pricing" title="Clear starting points for the first useful phase." copy="Choose the UK or US market to see manually configured local prices. Final scope, milestones, and pricing are agreed before paid work begins."><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} /></PageHero><PricingSection initialMarket={defaultMarket} showMarketToggle /><FaqSection ids={pricingFaqIds} /><FinalCta /></MainShell>;
}
