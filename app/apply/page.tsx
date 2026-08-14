import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { ApplicationForm } from "@/src/components/forms/application-form";
import { Container, Breadcrumbs } from "@/src/components/ui/primitives";
import { defaultMarket } from "@/src/config/markets";

export const metadata: Metadata = {
  title: "Product Fit Check",
  description:
    "Tell us about the problem—not the feature list. Share what happens today, who experiences it, and why it matters.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage({ searchParams }: { searchParams: Promise<{ market?: string; package?: string }> }) {
  return (
    <MainShell>
      <section className="apply-hero apply-hero--minimal ruled-bg">
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Apply" }]} />
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" />Product fit check</p>
            <h1>Tell us about the problem — not the feature list.</h1>
            <p>You do not need to have the product completely figured out. Share what happens today, who experiences the problem, and why solving it matters.</p>
            <p className="hero-disclosure">6–8 minute fit check · Qualified enquiries can book a free 30-minute call.</p>
          </div>
        </Container>
      </section>
      <section className="section application-page-section">
        <Container>
          <ApplicationMarketResolver searchParams={searchParams} />
        </Container>
      </section>
    </MainShell>
  );
}

async function ApplicationMarketResolver({ searchParams }: { searchParams: Promise<{ market?: string; package?: string }> }) {
  const { market, package: packageInterest } = await searchParams;
  const validPackage = packageInterest === "blueprint-prototype" || packageInterest === "focused-mvp" || packageInterest === "custom-product" ? packageInterest : undefined;
  return <ApplicationForm market={market === "us" || market === "uk" ? market : defaultMarket} packageInterest={validPackage} />;
}
