"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { Container, SectionIntro, ButtonLink } from "@/src/components/ui/primitives";
import { getPricingPackages, pricingCopy } from "@/src/config/pricing";
import type { MarketKey } from "@/src/config/markets";
import { createEventId, trackClientEvent } from "@/src/lib/client/analytics";

export function PricingSection({
  initialMarket = "uk",
  showMarketToggle = false,
  embedded = false,
}: {
  initialMarket?: MarketKey;
  showMarketToggle?: boolean;
  embedded?: boolean;
}) {
  const [market, setMarket] = useState<MarketKey>(initialMarket);
  const sectionRef = useRef<HTMLElement>(null);
  const trackedRef = useRef(false);
  const packages = getPricingPackages(market);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || trackedRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || trackedRef.current) return;
        trackedRef.current = true;
        trackClientEvent(
          "pricing_view",
          { market, placement: embedded ? "campaign" : "site" },
          "ViewContent",
          createEventId("pricing"),
        );
        observer.disconnect();
      },
      { threshold: 0.2 },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, [embedded, market]);

  return (
    <section ref={sectionRef} className={`section section--paper pricing-section ${embedded ? "pricing-section--embedded" : ""}`} id="pricing">
      <Container>
        <div className="pricing-heading-row">
          <SectionIntro eyebrow="Starting points, not rigid bundles" title={pricingCopy.heading} copy={pricingCopy.introduction} />
          {showMarketToggle ? (
            <div className="market-toggle" role="group" aria-label="Choose pricing market">
              <button type="button" className={market === "uk" ? "is-active" : ""} aria-pressed={market === "uk"} onClick={() => setMarket("uk")}>UK · GBP</button>
              <button type="button" className={market === "us" ? "is-active" : ""} aria-pressed={market === "us"} onClick={() => setMarket("us")}>US · USD</button>
            </div>
          ) : <span className="market-label">{market === "uk" ? "UK · GBP" : "US · USD"}</span>}
        </div>
        <div className="pricing-grid">
          {packages.map((pricingPackage) => (
            <article key={pricingPackage.id} className={`price-card ${pricingPackage.badge ? "price-card--featured" : ""}`}>
              {pricingPackage.badge ? <span className="price-badge">{pricingPackage.badge}</span> : null}
              <p className="price-kicker">{pricingPackage.name}</p>
              <p className="price-value">{pricingPackage.price.display}</p>
              <p className="price-tagline">{pricingPackage.tagline}</p>
              <p className="price-timeline">{pricingPackage.timeline}</p>
              <div className="price-list"><p>{pricingPackage.itemLabel}</p><ul>{pricingPackage.items.map((item) => <li key={item}><Check aria-hidden="true" size={15} />{item}</li>)}</ul></div>
              <ButtonLink href={`${pricingPackage.ctaHref}?market=${market}&package=${pricingPackage.id}`} variant={pricingPackage.badge ? "primary" : "secondary"}>{pricingPackage.ctaLabel}</ButtonLink>
            </article>
          ))}
        </div>
        <div className="pricing-notes">
          <p><strong>{pricingCopy.startingPriceNotice}</strong> {pricingCopy.scopeNotice}</p>
          <p>{pricingCopy.pricingFooter} {pricingCopy.paymentNotice}</p>
          <p><strong>AI is not mandatory:</strong> {pricingCopy.notForEveryProblem}</p>
        </div>
      </Container>
    </section>
  );
}
