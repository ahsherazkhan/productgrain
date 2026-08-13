export const marketKeys = ["uk", "us"] as const;

export type MarketKey = (typeof marketKeys)[number];

export type BudgetOption = {
  readonly value: string;
  readonly label: string;
};

export type MarketDefinition = {
  readonly key: MarketKey;
  readonly name: string;
  readonly shortName: string;
  readonly locale: "en-GB" | "en-US";
  readonly hrefLang: "en-GB" | "en-US";
  readonly countryCodes: readonly string[];
  readonly currency: "GBP" | "USD";
  readonly currencySymbol: "£" | "$";
  readonly landingPath: `/mvp-development/${MarketKey}`;
  readonly landingTitle: string;
  readonly landingDescription: string;
  readonly budgetOptions: readonly BudgetOption[];
};

const configuredDefaultMarket = process.env.NEXT_PUBLIC_MARKET_DEFAULT;
export const defaultMarket: MarketKey = configuredDefaultMarket === "us" ? "us" : "uk";

export const markets = {
  uk: {
    key: "uk",
    name: "United Kingdom",
    shortName: "UK",
    locale: "en-GB",
    hrefLang: "en-GB",
    countryCodes: ["GB", "UK"],
    currency: "GBP",
    currencySymbol: "£",
    landingPath: "/mvp-development/uk",
    landingTitle: "MVP Development for Nontechnical Founders | NeedFoundry UK",
    landingDescription:
      "NeedFoundry helps UK industry experts, business owners, and nontechnical founders shape and build focused software products.",
    budgetOptions: [
      { value: "under-2000", label: "Under £2,000" },
      { value: "2000-4000", label: "£2,000–£4,000" },
      { value: "4000-8000", label: "£4,000–£8,000" },
      { value: "8000-20000", label: "£8,000–£20,000" },
      { value: "20000-40000", label: "£20,000–£40,000" },
      { value: "above-40000", label: "Above £40,000" },
      { value: "not-sure", label: "Not sure yet" },
    ],
  },
  us: {
    key: "us",
    name: "United States",
    shortName: "US",
    locale: "en-US",
    hrefLang: "en-US",
    countryCodes: ["US"],
    currency: "USD",
    currencySymbol: "$",
    landingPath: "/mvp-development/us",
    landingTitle: "MVP Development for Nontechnical Founders | NeedFoundry US",
    landingDescription:
      "NeedFoundry helps US industry experts, business owners, and nontechnical founders shape and build focused software products.",
    budgetOptions: [
      { value: "under-2500", label: "Under $2,500" },
      { value: "2500-5000", label: "$2,500–$5,000" },
      { value: "5000-10000", label: "$5,000–$10,000" },
      { value: "10000-25000", label: "$10,000–$25,000" },
      { value: "25000-50000", label: "$25,000–$50,000" },
      { value: "above-50000", label: "Above $50,000" },
      { value: "not-sure", label: "Not sure yet" },
    ],
  },
} as const satisfies Record<MarketKey, MarketDefinition>;

export function isMarketKey(value: unknown): value is MarketKey {
  return typeof value === "string" && marketKeys.includes(value as MarketKey);
}

export function resolveMarket(
  value: unknown,
  fallback: MarketKey = defaultMarket,
): MarketKey {
  return isMarketKey(value) ? value : fallback;
}

export function getMarket(value: unknown): MarketDefinition {
  return markets[resolveMarket(value)];
}

export function getMarketFromCountry(countryCode: string): MarketKey | null {
  const normalizedCountryCode = countryCode.trim().toUpperCase();

  for (const marketKey of marketKeys) {
    const countryCodes: readonly string[] = markets[marketKey].countryCodes;

    if (countryCodes.includes(normalizedCountryCode)) {
      return marketKey;
    }
  }

  return null;
}

export function getMarketFromPathname(pathname: string): MarketKey | null {
  const match = pathname.match(/^\/mvp-development\/(uk|us)(?:\/|$)/);
  return match && isMarketKey(match[1]) ? match[1] : null;
}
