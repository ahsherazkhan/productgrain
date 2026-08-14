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
    name: "Product Discovery and Prototype",
    badge: null,
    tagline: "Research the problem, evaluate the opportunity, and shape the strongest solution before committing to full development.",
    itemLabel: "Includes",
    items: [
      "Product and stakeholder workshop.",
      "Target-user definition.",
      "Problem and workflow analysis.",
      "Competitor and alternative review.",
      "Early market or user research.",
      "Solution options.",
      "AI-opportunity and feasibility review where relevant.",
      "Core user journey.",
      "Prioritized first-release scope.",
      "Explicit exclusions.",
      "Five to ten key screens.",
      "Clickable prototype.",
      "High-level technical direction.",
      "Indicative development range.",
      "Build, refine, or pause recommendation.",
    ],
    timeline: "Approximately 1–2 weeks, depending on research scope.",
    ctaLabel: "Discuss product discovery",
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
    tagline: "Build and launch one complete, high-value product workflow based on approved product direction.",
    itemLabel: "Includes",
    items: [
      "Product and UX definition.",
      "Responsive web application around one primary workflow.",
      "Authentication and permissions.",
      "Core backend and database.",
      "AI model or service integration where it creates value.",
      "One complete user workflow.",
      "Basic administration.",
      "One standard third-party integration.",
      "AI evaluation or human review where appropriate.",
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
      "Build a broader software or AI-native product with more workflows, roles, integrations, and operational depth.",
    itemLabel: "Possible scope",
    items: [
      "Multiple user roles.",
      "Advanced permissions and administration.",
      "Payments, subscriptions, or several integrations.",
      "Retrieval and knowledge systems.",
      "Multi-step AI workflows and AI agents where appropriate.",
      "Human-review and approval systems.",
      "AI evaluation and observability.",
      "Advanced administration and data governance.",
      "Data migration.",
      "Mobile or cross-platform experiences.",
      "Ongoing product development.",
    ],
    timeline: "Defined after discovery and scoping.",
    ctaLabel: "Plan a custom product",
    ctaHref: "/apply",
    prices: {
      uk: { amount: 20_000, currency: "GBP", display: "From £20,000" },
      us: { amount: 25_000, currency: "USD", display: "From $25,000" },
    },
  },
] as const satisfies readonly PricingPackageDefinition[];

export const pricingCopy = {
  heading: "Start with the right level of product certainty.",
  introduction:
    "The initial Product Clarity Call is free. Paid work begins only after you approve research scope, deliverables, milestones, timeline, and price.",
  startingPriceNotice:
    "Starting prices reflect a focused first release, not a guarantee of final scope.",
  smallerFirstStep:
    "Need a smaller first phase? We can narrow the roadmap to one valuable workflow rather than lowering quality.",
  pricingFooter:
    "Need a smaller first phase? We can focus the roadmap around one high-value workflow rather than lowering engineering quality.",
  scopeNotice:
    "Final pricing depends on product complexity, integrations, user roles, data requirements, and launch expectations.",
  paymentNotice:
    "No payment is required for the initial call. Paid work begins only after the scope, timeline, and milestones have been agreed.",
  notForEveryProblem:
    "Not every product requires AI. The final recommendation may be AI-native, AI-enabled, or conventional software.",
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
