import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Breadcrumbs } from "@/src/components/ui/primitives";
import { PricingSection } from "@/src/components/marketing/pricing-section";
import { FaqSection, FinalCta } from "@/src/components/marketing/sections";
import { defaultMarket } from "@/src/config/markets";

export const metadata: Metadata = { title: "MVP and Product Development Pricing", description: "Market-specific starting prices for product blueprints, focused MVP builds, and custom software products in the UK and US.", alternates: { canonical: "/pricing" } };

export default function PricingPage() {
  return <MainShell><PageHero eyebrow="Pricing" title="Start at the level of product clarity you need." copy="Every project begins with a free product discussion. Paid work starts only after scope, milestones, timeline, and price are agreed."><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} /></PageHero><PricingSection initialMarket={defaultMarket} showMarketToggle /><FaqSection /><FinalCta /></MainShell>;
}
