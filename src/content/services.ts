export type ServiceSummary = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly capabilities: readonly string[];
};

export type DetailedService = ServiceSummary & {
  readonly slug: string;
  readonly clientOutcome: string;
};

export const homepageServices = [
  {
    id: "product-direction",
    title: "Product direction",
    description:
      "Clarify the problem, customer, and first product decision before major development begins.",
    capabilities: [
      "Problem clarification.",
      "Customer and workflow definition.",
      "MVP prioritization.",
      "Roadmap development.",
    ],
  },
  {
    id: "ux-product-design",
    title: "UX and product design",
    description:
      "Turn the intended workflow into a product experience that can be reviewed and tested.",
    capabilities: [
      "User flows.",
      "Wireframes.",
      "Interactive prototypes.",
      "Interface design.",
      "Design systems.",
    ],
  },
  {
    id: "mvp-development",
    title: "MVP development",
    description:
      "Build one complete, useful first release with the systems needed to operate it.",
    capabilities: [
      "Responsive web applications.",
      "Backend systems.",
      "Databases.",
      "Authentication.",
      "Administration tools.",
    ],
  },
  {
    id: "ai-enabled-products",
    title: "AI-enabled products",
    description:
      "Introduce AI where it improves a real workflow while keeping people involved in important decisions.",
    capabilities: [
      "AI assistants.",
      "Document workflows.",
      "Knowledge search.",
      "Business process automation.",
      "Human-in-the-loop experiences.",
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    description:
      "Connect the product to the systems the business already relies on.",
    capabilities: [
      "Payments.",
      "CRM systems.",
      "Third-party APIs.",
      "Business tools.",
      "Existing internal systems.",
    ],
  },
  {
    id: "launch-support",
    title: "Launch support",
    description:
      "Deploy the first release, observe early use, and turn evidence into the next priorities.",
    capabilities: [
      "Analytics.",
      "Deployment.",
      "Onboarding refinement.",
      "User feedback.",
      "Product iterations.",
    ],
  },
] as const satisfies readonly ServiceSummary[];

export const services = [
  {
    id: "product-discovery-direction",
    slug: "product-discovery-and-direction",
    title: "Product discovery and direction",
    description:
      "Start with the customer, current workflow, business constraint, and outcome before deciding what software to build.",
    capabilities: [
      "Problem and opportunity clarification.",
      "User and stakeholder definition.",
      "Current-workflow mapping.",
      "MVP priorities and exclusions.",
      "Product roadmap direction.",
    ],
    clientOutcome:
      "A clearer product decision and a practical next step grounded in the real workflow.",
  },
  {
    id: "ux-interface-design",
    slug: "ux-and-interface-design",
    title: "UX and interface design",
    description:
      "Shape the complete core journey before engineering decisions become expensive to change.",
    capabilities: [
      "User flows and information architecture.",
      "Wireframes and interactive prototypes.",
      "Responsive interface design.",
      "Reusable design systems.",
      "Usability refinement.",
    ],
    clientOutcome:
      "A product experience that stakeholders can understand, review, and test before or during development.",
  },
  {
    id: "full-stack-web-development",
    slug: "full-stack-web-development",
    title: "Full-stack web development",
    description:
      "Design, build, test, and deploy responsive products with the backend and operational tools they need.",
    capabilities: [
      "Responsive web applications.",
      "Backend systems and databases.",
      "Authentication and permissions.",
      "Administration tools.",
      "Transactional notifications.",
    ],
    clientOutcome:
      "A production-ready first release built around one useful end-to-end workflow.",
  },
  {
    id: "ai-product-development",
    slug: "ai-product-development",
    title: "AI product development",
    description:
      "Use existing AI capabilities to improve a defined workflow without treating AI as the product strategy.",
    capabilities: [
      "AI assistants.",
      "Document processing workflows.",
      "Knowledge search.",
      "Business process automation.",
      "Human review and control points.",
    ],
    clientOutcome:
      "An AI-enabled experience with clear boundaries, review points, and a practical business use.",
  },
  {
    id: "integrations-automation",
    slug: "integrations-and-automation",
    title: "Integrations and automation",
    description:
      "Connect new product workflows to payments, CRM systems, business tools, and existing internal software.",
    capabilities: [
      "Third-party API integrations.",
      "Payments and subscriptions.",
      "CRM and business-tool connections.",
      "Notifications and data movement.",
      "Operational workflow automation.",
    ],
    clientOutcome:
      "A connected workflow that reduces duplicate handling and keeps the right systems in sync.",
  },
  {
    id: "existing-product-improvement",
    slug: "existing-product-improvement",
    title: "Existing-product improvement",
    description:
      "Improve, extend, redesign, or stabilize a product that already has users, code, or operational history.",
    capabilities: [
      "Product and codebase assessment.",
      "Workflow and usability improvements.",
      "Feature prioritization.",
      "Reliability and maintainability work.",
      "Incremental redesign and development.",
    ],
    clientOutcome:
      "A prioritized improvement plan and focused delivery that respects the product already in use.",
  },
  {
    id: "deployment-launch-support",
    slug: "deployment-and-launch-support",
    title: "Deployment and launch support",
    description:
      "Prepare the product for real users, monitor the first release, and improve early friction using evidence.",
    capabilities: [
      "Production deployment.",
      "Product analytics.",
      "Onboarding refinement.",
      "Early-user feedback.",
      "Launch-priority fixes.",
    ],
    clientOutcome:
      "A supported launch and a practical evidence-based list of what to improve next.",
  },
  {
    id: "ongoing-product-development",
    slug: "ongoing-product-development",
    title: "Ongoing product development",
    description:
      "Continue product design and engineering after launch through defined priorities and measurable stages.",
    capabilities: [
      "Roadmap and iteration planning.",
      "New workflow development.",
      "Analytics-informed improvements.",
      "Technical maintenance.",
      "Ongoing quality assurance.",
    ],
    clientOutcome:
      "Continued product progress without separating product decisions from the team implementing them.",
  },
] as const satisfies readonly DetailedService[];

export function getServiceBySlug(slug: string): DetailedService | undefined {
  return services.find((service) => service.slug === slug);
}
