import type { LucideIcon } from "lucide-react";
import { Gauge, Lightbulb, Route, Rocket, Workflow, Wrench } from "lucide-react";

export type MarketingCard = {
  readonly title: string;
  readonly copy: string;
  readonly icon: LucideIcon;
};

export const fitScenarios = [
  {
    title: "Replace a fragmented workflow",
    copy: "An important process still depends on spreadsheets, email, documents, disconnected tools, or manual follow-up.",
    icon: Workflow,
  },
  {
    title: "Shape a new product",
    copy: "You understand an industry problem but need to decide what the first useful version should include—and exclude.",
    icon: Lightbulb,
  },
  {
    title: "Improve an existing product",
    copy: "A live product is difficult to use, operate, extend, or connect to the systems around it.",
    icon: Wrench,
  },
] as const satisfies readonly MarketingCard[];

export const engagementPhases = [
  {
    number: "01",
    title: "Shape",
    copy: "Clarify the users, current workflow, desired outcome, priorities, and deliberate exclusions.",
    output: "A recommended direction and focused scope.",
    icon: Route,
  },
  {
    number: "02",
    title: "Build",
    copy: "Design, engineer, test, and release the product through visible milestones.",
    output: "A tested, production-ready release.",
    icon: Rocket,
  },
  {
    number: "03",
    title: "Learn",
    copy: "Observe real use, resolve early friction, and prioritize what deserves investment next.",
    output: "An evidence-led improvement plan.",
    icon: Gauge,
  },
] as const;

export const detailedProcessStages = [
  {
    number: "01",
    title: "Discuss",
    copy: "Explain the problem, current workflow, intended users, budget context, and desired outcome.",
    output: "A recommended starting point.",
    clientInput: "A clear, non-confidential description of what happens today.",
  },
  {
    number: "02",
    title: "Define",
    copy: "Map the core workflow, test assumptions, reduce scope, and agree the milestones.",
    output: "An agreed product direction and first-release scope.",
    clientInput: "Access to domain knowledge, users, and timely decisions.",
  },
  {
    number: "03",
    title: "Build",
    copy: "Design, develop, and test the product through visible milestone releases.",
    output: "A tested production release.",
    clientInput: "Focused milestone reviews and access to required systems.",
  },
  {
    number: "04",
    title: "Launch and learn",
    copy: "Release to real users, observe friction, and prioritize what deserves investment next.",
    output: "An evidence-led improvement plan.",
    clientInput: "Reachable users and honest operational feedback.",
  },
] as const;

export const homepageFaqIds = [
  "technical-specification",
  "free-call",
  "mvp-cost",
  "smaller-budget",
  "code-ownership",
  "existing-products",
] as const;

export const pricingFaqIds = [
  "free-call",
  "mvp-cost",
  "smaller-budget",
  "code-ownership",
  "product-market-fit",
] as const;

export const mvpFaqIds = [
  "technical-specification",
  "free-call-agenda",
  "mvp-cost",
  "smaller-budget",
  "product-market-fit",
] as const;
