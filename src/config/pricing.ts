import type { MarketKey } from "./markets";
import { resolveMarket } from "./markets";

export const pricingPackageIds = [
  "blueprint-prototype",
  "focused-mvp",
  "custom-product",
] as const;

export type PricingPackageId = (typeof pricingPackageIds)[number];

export type MarketPrice = {
  readonly amount: number;
  readonly currency: "GBP" | "USD";
  readonly display: string;
};

export type PricingPackageDefinition = {
  readonly id: PricingPackageId;
  readonly name: string;
  readonly badge: string | null;
  readonly tagline: string;
  readonly itemLabel: "Includes" | "Possible scope";
  readonly items: readonly string[];
  readonly timeline: string;
  readonly ctaLabel: string;
  readonly ctaHref: "/apply";
  readonly prices: Readonly<Record<MarketKey, MarketPrice>>;
};

export type MarketPricingPackage = Omit<PricingPackageDefinition, "prices"> & {
  readonly market: MarketKey;
  readonly price: MarketPrice;
};

export const pricingPackages = [
  {
    id: "blueprint-prototype",
    name: "Product Blueprint & Prototype",
    badge: null,
    tagline: "Turn an idea into a clear, testable product direction.",
    itemLabel: "Includes",
    items: [
      "Product workshop.",
      "Refined problem statement.",
      "Primary user definition.",
      "Core user flow.",
      "MVP feature priorities.",
      "Features excluded from the first release.",
      "Five to ten key screens.",
      "Clickable prototype.",
      "High-level technical direction.",
      "Indicative build range.",
      "One revision round.",
    ],
    timeline: "Approximately 1–2 weeks.",
    ctaLabel: "Discuss the prototype",
    ctaHref: "/apply",
    prices: {
      uk: { amount: 2_000, currency: "GBP", display: "From £2,000" },
      us: { amount: 2_500, currency: "USD", display: "From $2,500" },
    },
  },
  {
    id: "focused-mvp",
    name: "Focused MVP Build",
    badge: "Most common starting point",
    tagline: "Build and launch one complete, high-value workflow.",
    itemLabel: "Includes",
    items: [
      "Product and UX definition.",
      "Responsive application.",
      "One or two primary user roles.",
      "Authentication.",
      "Core database and backend.",
      "One complete user workflow.",
      "Basic administration.",
      "One standard integration.",
      "Transactional email or notifications.",
      "Product analytics.",
      "Quality assurance.",
      "Production deployment.",
      "Technical handover.",
      "Thirty days of defect support.",
    ],
    timeline: "Approximately 6–10 weeks, depending on scope.",
    ctaLabel: "Discuss your MVP",
    ctaHref: "/apply",
    prices: {
      uk: { amount: 8_000, currency: "GBP", display: "From £8,000" },
      us: { amount: 10_000, currency: "USD", display: "From $10,000" },
    },
  },
  {
    id: "custom-product",
    name: "Custom Product Build",
    badge: null,
    tagline:
      "Build a broader product with more users, integrations, and operational depth.",
    itemLabel: "Possible scope",
    items: [
      "Multiple user types.",
      "Advanced administration.",
      "Payments or subscriptions.",
      "Several integrations.",
      "AI-enabled workflows.",
      "More complex permissions.",
      "Mobile or cross-platform requirements.",
      "Data migration.",
      "Ongoing development capacity.",
      "Product analytics and growth iterations.",
    ],
    timeline: "Defined after scoping.",
    ctaLabel: "Plan a custom build",
    ctaHref: "/apply",
    prices: {
      uk: { amount: 20_000, currency: "GBP", display: "From £20,000" },
      us: { amount: 25_000, currency: "USD", display: "From $25,000" },
    },
  },
] as const satisfies readonly PricingPackageDefinition[];

export const pricingCopy = {
  heading: "Start with the level of clarity and product depth you need",
  introduction:
    "Every project begins with a free product discussion. The packages below show typical starting points, not rigid feature bundles.",
  startingPriceNotice:
    "Starting prices reflect a focused first release. Final scope, milestones, and pricing are agreed after the free product call.",
  smallerFirstStep:
    "Need a smaller first step? We can phase the roadmap around one high-value workflow.",
  pricingFooter:
    "Need a smaller first step? We can phase the roadmap around one valuable workflow rather than reducing engineering quality.",
  scopeNotice:
    "Final pricing depends on product complexity, integrations, user roles, data requirements, and launch expectations.",
  paymentNotice:
    "No payment is required for the initial call. Paid work begins only after the scope, timeline, and milestones have been agreed.",
} as const;

export function getPricingPackages(
  marketInput: unknown,
): readonly MarketPricingPackage[] {
  const market = resolveMarket(marketInput);

  return pricingPackages.map(({ prices, ...pricingPackage }) => ({
    ...pricingPackage,
    market,
    price: prices[market],
  }));
}

export function getPricingPackage(
  packageId: PricingPackageId,
  marketInput: unknown,
): MarketPricingPackage {
  const market = resolveMarket(marketInput);
  const pricingPackage = pricingPackages.find(({ id }) => id === packageId);

  if (!pricingPackage) {
    throw new Error(`Unknown pricing package: ${packageId}`);
  }

  const { prices, ...definition } = pricingPackage;
  return { ...definition, market, price: prices[market] };
}
