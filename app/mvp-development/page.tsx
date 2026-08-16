import type { Metadata } from "next";
import { Check } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import {
  PageHero,
  Breadcrumbs,
  Container,
  SectionIntro,
  ButtonLink,
} from "@/src/components/ui/primitives";
import { ProcessSection, FaqSection, FinalCta } from "@/src/components/marketing/sections";
import { mvpFaqIds } from "@/src/content/home";
import { siteConfig } from "@/src/config/site";

export const metadata: Metadata = {
  title: { absolute: `Product-First AI MVP Development | ${siteConfig.brandName}` },
  description:
    "Build the right first phase: validate the problem, shape the right solution, and launch one complete workflow before scaling.",
  alternates: {
    canonical: "/mvp-development",
    languages: { "en-GB": "/mvp-development/uk", "en-US": "/mvp-development/us", "x-default": "/mvp-development" },
  },
};

export default function MvpDevelopmentPage() {
  return (
    <MainShell>
      <PageHero
        eyebrow="MVP development"
        title="One useful workflow, proven first."
        copy="A focused first phase is a practical way to reduce risk and get real user learning before full expansion."
      >
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "MVP development" }]} />
        <div className="button-row">
          <ButtonLink href="/apply">Discuss your idea, free</ButtonLink>
          <ButtonLink href="/pricing" variant="secondary">
            See starting prices
          </ButtonLink>
        </div>
      </PageHero>

      <section className="section section--surface">
        <Container>
          <SectionIntro eyebrow="A complete first release" title="What focused means in practice" />
          <div className="three-card-grid">
            <article className="editorial-card">
              <span className="card-tag">01 · Useful</span>
              <h3>One end-to-end outcome</h3>
              <p>
                The first release should let a real user complete something meaningful without a manual
                gap hidden in the middle.
              </p>
            </article>
            <article className="editorial-card">
              <span className="card-tag">02 · Operable</span>
              <h3>The systems behind the screen</h3>
              <p>
                Data, authentication, administration, notifications, quality, and deployment receive the
                attention needed for real use.
              </p>
            </article>
            <article className="editorial-card">
              <span className="card-tag">03 · Learnable</span>
              <h3>Evidence for the next decision</h3>
              <p>
                Analytics and early feedback show where users gain value, where they struggle, and what
                deserves the next investment.
              </p>
            </article>
          </div>
        </Container>
      </section>

      <ProcessSection />

      <section className="section section--muted">
        <Container>
          <div className="market-choice">
            <div>
              <p className="eyebrow">Market-specific detail</p>
              <h2>Choose the starting prices and language relevant to you.</h2>
              <p>
                The core approach is the same. UK and US campaign pages use manually configured local
                starting prices rather than automatic currency conversions.
              </p>
            </div>
            <div>
              <article>
                <span>UK · GBP</span>
                <h3>For United Kingdom teams</h3>
                <ul>
                  <li>
                    <Check />
                    Blueprints from £2,000
                  </li>
                  <li>
                    <Check />
                    Focused MVPs from £8,000
                  </li>
                </ul>
                <ButtonLink href="/mvp-development/uk" variant="secondary">
                  View the UK page
                </ButtonLink>
              </article>
              <article>
                <span>US · USD</span>
                <h3>For United States teams</h3>
                <ul>
                  <li>
                    <Check />
                    Blueprints from $2,500
                  </li>
                  <li>
                    <Check />
                    Focused MVPs from $10,000
                  </li>
                </ul>
                <ButtonLink href="/mvp-development/us" variant="secondary">
                  View the US page
                </ButtonLink>
              </article>
            </div>
          </div>
        </Container>
      </section>

      <FaqSection ids={mvpFaqIds} />
      <FinalCta />
    </MainShell>
  );
}
