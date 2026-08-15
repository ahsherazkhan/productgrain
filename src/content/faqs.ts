import { siteConfig } from "@/src/config/site";

export type Faq = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export const faqs = [
  {
    id: "technical-specification",
    question: "Do I need to know what the solution should be?",
    answer:
      "No. A short note about what you would like to build or improve is enough to start. We explore the workflow, users, and right product direction together later.",
  },
  {
    id: "ai-native",
    question: `What does AI-native mean at ${siteConfig.brandName}?`,
    answer:
      "AI is considered from the beginning rather than being attached at the end. We evaluate where intelligence affects the product, workflow, data, safeguards, and business model, and include it only where it adds meaningful advantage.",
  },
  {
    id: "ai-per-product",
    question: "Does every product you build use AI?",
    answer:
      "No. AI is included only when it creates a stronger product, better workflow, or genuine competitive advantage. Some problems are better solved with conventional software.",
  },
  {
    id: "free-call",
    question: "Is the initial call really free?",
    answer:
      "Yes. The initial Product Clarity Call is free and carries no obligation. Detailed research, validation, product definition, and prototyping are part of paid Product Discovery after scope is approved.",
  },
  {
    id: "existing-products",
    question: "Can you build AI into an existing product?",
    answer:
      "Yes. We can add focused AI capabilities inside existing products when it improves workflow, quality, decisions, or adoption.",
  },
  {
    id: "mvp-cost",
    question: "How much does an AI MVP cost?",
    answer:
      "A focused AI MVP typically starts at $10,000 for US engagements or £8,000 for UK engagements. Final pricing depends on users, integrations, data requirements, AI confidence work, design depth, and timeline.",
  },
] as const satisfies readonly Faq[];

export const homepageFaqIds = [
  "technical-specification",
  "ai-native",
  "free-call",
  "ai-per-product",
  "existing-products",
  "mvp-cost",
] as const;

export const pricingFaqIds = [
  "mvp-cost",
  "free-call",
  "ai-per-product",
  "existing-products",
] as const;

export const mvpFaqIds = [
  "technical-specification",
  "free-call",
  "mvp-cost",
  "existing-products",
  "ai-per-product",
] as const;
