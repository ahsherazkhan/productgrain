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
      "Product workshop and problem definition.",
      "Core user flow and prioritized scope.",
      "Five to ten key screens and a clickable prototype.",
      "Indicative build direction and range.",
    ],
    timeline: "Approximately 1–2 weeks.",
    ctaLabel: "Start with a blueprint",
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
      "Responsive product around one core workflow.",
      "Backend, authentication, and administration.",
      "One standard integration and notifications.",
      "Quality assurance, analytics, and deployment.",
      "Handover and thirty days of defect support.",
    ],
    timeline: "Approximately 6–10 weeks, depending on scope.",
    ctaLabel: "Tell us about your MVP",
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
      "Multiple users, roles, and permissions.",
      "Advanced administration and data workflows.",
      "Payments, subscriptions, or several integrations.",
      "AI-enabled, mobile, or migration requirements.",
      "A phased scope and delivery plan.",
    ],
    timeline: "Defined after scoping.",
    ctaLabel: "Tell us about the product",
    ctaHref: "/apply",
    prices: {
      uk: { amount: 20_000, currency: "GBP", display: "From £20,000" },
      us: { amount: 25_000, currency: "USD", display: "From $25,000" },
    },
  },
] as const satisfies readonly PricingPackageDefinition[];

export const pricingCopy = {
  heading: "Choose the right first step",
  introduction:
    "These starting points show the typical depth of a focused first phase. Final scope, milestones, and price are agreed before paid work begins.",
  startingPriceNotice:
    "Starting prices reflect a focused first release. Final scope, milestones, and pricing are agreed after the fit review and, where appropriate, the free product call.",
  smallerFirstStep:
    "Need a smaller first step? We can phase the roadmap around one high-value workflow.",
  pricingFooter:
    "A smaller first step can be a blueprint, prototype, or one valuable workflow. We reduce scope rather than engineering quality.",
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
