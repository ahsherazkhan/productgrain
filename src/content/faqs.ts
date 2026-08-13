export type Faq = {
  readonly id: string;
  readonly question: string;
  readonly answer: string;
};

export const faqs = [
  {
    id: "technical-specification",
    question: "Do I need a technical specification?",
    answer:
      "No. You should be able to explain the problem, intended users, and current workflow. We will help translate that information into a practical product direction.",
  },
  {
    id: "free-call",
    question: "Is the first call really free?",
    answer:
      "Yes. The initial Product Clarity Call is free and carries no obligation. Paid work begins only after the scope, milestones, timeline, and price have been agreed.",
  },
  {
    id: "free-call-agenda",
    question: "What happens during the free call?",
    answer:
      "We discuss the problem, intended users, current process, existing evidence, priorities, budget context, and the most sensible first step.",
  },
  {
    id: "free-call-exclusions",
    question: "What is not included in the free call?",
    answer:
      "The call does not include a complete product specification, detailed architecture, full competitor report, finished prototype, or several days of unpaid consulting.",
  },
  {
    id: "mvp-cost",
    question: "How much does an MVP cost?",
    answer:
      "A focused MVP typically starts at $10,000 in the US or £8,000 in the UK. The final amount depends on user roles, workflows, integrations, data, design depth, and launch requirements.",
  },
  {
    id: "smaller-budget",
    question: "Can we begin with a smaller budget?",
    answer:
      "Yes. A smaller budget can begin with a prototype, a product blueprint, or one high-value workflow. We reduce the first-phase scope rather than lowering engineering standards.",
  },
  {
    id: "code-ownership",
    question: "Who owns the code?",
    answer:
      "Ownership terms are stated clearly in the project agreement. Unless otherwise agreed, the client receives ownership of the paid project deliverables after the relevant payments have been completed.",
  },
  {
    id: "nda",
    question: "Can you sign an NDA?",
    answer:
      "Yes, where an NDA is appropriate. We can also begin with a non-confidential description of the problem.",
  },
  {
    id: "marketing",
    question: "Do you provide marketing?",
    answer:
      "We provide launch support such as analytics, onboarding improvements, landing-page refinement, and early-user learning. Full-service ongoing marketing is scoped separately.",
  },
  {
    id: "existing-products",
    question: "Do you work with existing products?",
    answer:
      "Yes. We can improve, extend, redesign, or stabilize an existing software product.",
  },
  {
    id: "mobile-applications",
    question: "Can you build mobile applications?",
    answer:
      "Yes. The recommended approach depends on the required device capabilities, target users, budget, and whether a responsive web product can solve the initial problem.",
  },
  {
    id: "product-market-fit",
    question: "Do you guarantee product-market fit?",
    answer:
      "No responsible development partner can guarantee market adoption. We provide a structured process for reducing uncertainty, building the right first release, and learning from real usage.",
  },
] as const satisfies readonly Faq[];
