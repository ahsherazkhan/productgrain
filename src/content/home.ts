import type { LucideIcon } from "lucide-react";
import { Gauge, Lightbulb, Route, Rocket, Workflow, Wrench } from "lucide-react";

export type MarketingCard = {
  readonly title: string;
  readonly copy: string;
  readonly icon: LucideIcon;
};

export const fitScenarios = [
  {
    title: "Understand the real problem",
    copy:
      "We clarify the people involved, current workflow, business impact, and assumptions before we propose a direction.",
    icon: Workflow,
  },
  {
    title: "Validate the opportunity",
    copy:
      "We compare alternatives, test the riskiest assumptions, and decide whether a software build is the strongest next move.",
    icon: Lightbulb,
  },
  {
    title: "Shape the right first product",
    copy:
      "We define one useful first release, a complete user workflow, and clear exclusions before development begins.",
    icon: Wrench,
  },
] as const satisfies readonly MarketingCard[];

export const productTypeLines = [
  "Vertical AI SaaS",
  "Productized services",
  "AI-enhanced existing products",
  "Focused workflow software",
] as const;

export const aiOpportunityPaths = [
  "Build a focused AI product",
  "Productize a repeated service",
  "Improve an existing product",
] as const;

export const engagementPhases = [
  {
    number: "01",
    title: "Research the problem",
    copy: "We study intended users, current workflow, alternatives, and assumptions behind the idea.",
    output: "A clearer recommendation: build now, test more, or pause.",
    icon: Route,
  },
  {
    number: "02",
    title: "Prove the experience",
    copy: "We map the core journey, prototype the strongest direction, and validate assumptions before development.",
    output: "An agreed product direction with clear scope and explicit exclusions.",
    icon: Rocket,
  },
  {
    number: "03",
    title: "Build, launch, and learn",
    copy: "Our in-house team designs, develops, tests, and launches one complete product release.",
    output: "A production release designed for real users and learning.",
    icon: Gauge,
  },
] as const;

export const detailedProcessStages = [
  {
    number: "01",
    title: "Research the problem",
    copy: "Explain the problem, current workflow, intended users, and what is currently working or not working.",
    output: "A clear understanding of what is worth building.",
    clientInput: "A concise summary of who is affected and how this impacts outcomes today.",
  },
  {
    number: "02",
    title: "Shape and validate",
    copy: "Map the user journey, test assumptions, refine scope, and choose where AI creates measurable advantage.",
    output: "An agreed product direction and first-release scope.",
    clientInput: "Input on users, current workflow, and what constraints must not be relaxed.",
  },
  {
    number: "03",
    title: "Build a focused release",
    copy: "Define the MVP scope in detail, implement the product, and release with testing and quality assurance.",
    output: "A production release with reliable workflows and practical safeguards.",
    clientInput: "Decision-making support through milestones and access to required environments.",
  },
  {
    number: "04",
    title: "Launch and learn",
    copy: "Release to real users, observe outcomes, and decide what should become the next valuable investment.",
    output: "An evidence-led improvement plan.",
    clientInput: "Accessible users and a commitment to review early feedback with the team.",
  },
] as const;

export const homepageFaqIds = [
  "technical-specification",
  "ai-native",
  "free-call",
  "ai-per-product",
  "existing-products",
  "mvp-cost",
] as const;

export const homepageCoreFaqIds = [
  "ai-per-product",
  "free-call",
  "technical-specification",
  "existing-products",
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
