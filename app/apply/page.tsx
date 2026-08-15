import type { Metadata } from "next";
import { MainShell } from "@/src/components/layout/main-shell";
import { ApplicationForm } from "@/src/components/forms/application-form";
import { Container, Breadcrumbs } from "@/src/components/ui/primitives";
import { defaultMarket } from "@/src/config/markets";

export const metadata: Metadata = {
  title: "Start a Project",
  description:
    "Share a short project note, approximate budget, and desired start. No technical specification is required.",
  alternates: { canonical: "/apply" },
};

export default function ApplyPage({ searchParams }: { searchParams: Promise<{ market?: string; package?: string }> }) {
  return (
    <MainShell>
      <section className="apply-hero apply-hero--minimal ruled-bg">
        <Container>
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Apply" }]} />
          <div>
            <p className="eyebrow"><span className="eyebrow-dot" />Start a project</p>
            <h1>A short note is enough to start.</h1>
            <p>Tell us what you would like to build or improve, your approximate first-phase budget, and when you hope to start. We will ask the deeper discovery questions later.</p>
            <p className="hero-disclosure">About 2 minutes · No technical specification · No payment required.</p>
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
