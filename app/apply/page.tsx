import type { Metadata } from "next";
import { Check } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { ApplicationForm } from "@/src/components/forms/application-form";
import { Container, Breadcrumbs } from "@/src/components/ui/primitives";
import { defaultMarket } from "@/src/config/markets";

export const metadata: Metadata = { title: "Discuss Your Product Idea", description: "Share the problem, current workflow, users, evidence, budget context, and timeline in a short product-fit application.", alternates: { canonical: "/apply" } };

export default function ApplyPage({ searchParams }: { searchParams: Promise<{ market?: string; package?: string }> }) {
  return <MainShell><section className="apply-hero ruled-bg"><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Apply" }]} /><div><p className="eyebrow"><span className="eyebrow-dot" />Free initial Product Clarity Call</p><h1>Tell us about the problem you want to turn into a product.</h1><p>You do not need technical language, wireframes, or a complete feature list. A short fit check comes before scheduling so the first conversation can focus on the most useful next decision.</p><ul><li><Check aria-hidden="true" />No account or payment</li><li><Check aria-hidden="true" />Progress saved during this session</li><li><Check aria-hidden="true" />Private, server-reviewed answers</li></ul></div></Container></section><section className="section application-page-section"><Container><ApplicationMarketResolver searchParams={searchParams} /></Container></section></MainShell>;
}

async function ApplicationMarketResolver({ searchParams }: { searchParams: Promise<{ market?: string; package?: string }> }) {
  const { market, package: packageInterest } = await searchParams;
  const validPackage = packageInterest === "blueprint-prototype" || packageInterest === "focused-mvp" || packageInterest === "custom-product" ? packageInterest : undefined;
  return <ApplicationForm market={market === "us" || market === "uk" ? market : defaultMarket} packageInterest={validPackage} />;
}
