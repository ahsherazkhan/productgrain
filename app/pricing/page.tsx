import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Breadcrumbs } from "@/src/components/ui/primitives";
import { PricingSection } from "@/src/components/marketing/pricing-section";
import { FaqSection, FinalCta } from "@/src/components/marketing/sections";
import { defaultMarket } from "@/src/config/markets";
import { pricingFaqIds } from "@/src/content/home";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Market-specific starting prices for Product Discovery, Focused MVP, and Custom Product work in the UK and US.",
  alternates: { canonical: "/pricing" },
};

export default function PricingPage() {
  return <MainShell><PageHero eyebrow="Pricing" title="Start with the right level of product certainty." copy="The initial Product Clarity Call is free. Paid work begins only after you approve research scope, deliverables, milestones, timeline, and price."><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Pricing" }]} /></PageHero><PricingSection initialMarket={defaultMarket} showMarketToggle /><FaqSection ids={pricingFaqIds} /><FinalCta /></MainShell>;
}
