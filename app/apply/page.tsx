import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { ApplicationForm } from "@/src/components/forms/application-form";
import { Container, Breadcrumbs } from "@/src/components/ui/primitives";
import { defaultMarket } from "@/src/config/markets";

export const metadata: Metadata = { title: "Product Fit Check", description: "Share the problem, current workflow, users, evidence, budget context, and timeline in a short product-fit application.", alternates: { canonical: "/apply" } };

export default function ApplyPage({ searchParams }: { searchParams: Promise<{ market?: string; package?: string }> }) {
  return <MainShell><section className="apply-hero apply-hero--minimal ruled-bg"><Container><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Apply" }]} /><div><p className="eyebrow"><span className="eyebrow-dot" />Product fit check</p><h1>Tell us about the problem.</h1><p>Share the current workflow, intended users, budget range, and timing. We will review it and recommend the most practical next step.</p><p className="hero-disclosure">About 6–8 minutes · Progress saved in this session · No account or payment</p></div></Container></section><section className="section application-page-section"><Container><ApplicationMarketResolver searchParams={searchParams} /></Container></section></MainShell>;
}

async function ApplicationMarketResolver({ searchParams }: { searchParams: Promise<{ market?: string; package?: string }> }) {
  const { market, package: packageInterest } = await searchParams;
  const validPackage = packageInterest === "blueprint-prototype" || packageInterest === "focused-mvp" || packageInterest === "custom-product" ? packageInterest : undefined;
  return <ApplicationForm market={market === "us" || market === "uk" ? market : defaultMarket} packageInterest={validPackage} />;
}
