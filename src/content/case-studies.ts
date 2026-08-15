export type CaseStudyPermissionStatus =
  | "confirmed"
  | "pending"
  | "not-requested";

export type CaseStudyResult = {
  readonly value: string;
  readonly label: string;
  readonly verificationNote: string;
};

export type CaseStudyImage = {
  readonly src: string;
  readonly alt: string;
  readonly width: number;
  readonly height: number;
  readonly caption?: string;
};

export type CaseStudyWorkflowStep = {
  readonly title: string;
  readonly description: string;
};

export type CaseStudyProvenance = {
  readonly kind:
    | "verified-client-work"
    | "third-party-reference"
    | "public-product-profile";
  readonly label: string;
  readonly sourceName: string;
  readonly sourceUrl: string;
  readonly disclosure: string;
};

export type PublicLeader = {
  readonly name: string;
  readonly role: string;
  readonly sourceUrl: string;
};

export type CaseStudy = {
  readonly slug: string;
  readonly clientName: string;
  readonly productUrl: string;
  readonly title: string;
  readonly industry: string;
  readonly clientType: string;
  readonly summary: string;
  readonly originalProblem: string;
  readonly publicProductDirection: string;
  readonly solution: string;
  readonly capabilities: readonly string[];
  readonly tags: readonly string[];
  readonly publicLeadership: readonly PublicLeader[];
  readonly results: readonly CaseStudyResult[];
  readonly logo?: CaseStudyImage;
  readonly images: readonly CaseStudyImage[];
  readonly workflow?: readonly CaseStudyWorkflowStep[];
  readonly provenance: CaseStudyProvenance;
  readonly relatedSlugs: readonly string[];
  readonly sourceUrls: readonly string[];
  readonly featuredOrder: number;
  readonly reviewedAt: string;
  readonly testimonialId?: string;
  readonly permissionStatus: CaseStudyPermissionStatus;
  readonly published: boolean;
};

const captureCaption = (clientName: string) =>
  `Current public ${clientName} product website, captured in August 2026.`;

const codalMediaCaption = (description: string) =>
  `${description} Media published on Codal's public case study; all rights remain with the respective owners.`;

const archivedReferenceLabel = "Archived reference";
const archivedReferenceDisclosure =
  "Archived pending delivery ownership and publication permission verification.";
const codalReferenceLabel = "Industry reference";
const codalReferenceDisclosure =
  "Industry reference compiled from Codal's public case study and credited product media.";

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "claimdeck",
    clientName: "ClaimDeck",
    productUrl: "https://claimdeck.com/",
    title:
      "Centralizing litigation workflows and legal data with AI-assisted support",
    industry: "Legal & insurance",
    clientType: "B2B SaaS platform",
    summary:
      "ClaimDeck brings claim adjusters and lawyers into one litigation workspace for task coordination, structured data exchange, document handling, analytics, and AI-assisted legal work.",
    originalProblem:
      "Claim adjusters and external counsel were coordinating through disconnected tools, redundant handoffs, and unstructured documents. That fragmentation made claim status harder to see, weakened auditability, and contributed to avoidable claims leakage.",
    publicProductDirection:
      "The platform was designed around two clear roles—adjusters and lawyers—with a shared claim record, accountable tasks, secure communication, configurable analytics, and open integrations. Structured data also created a foundation for practical AI features.",
    solution:
      "Codal documented a cloud-native AWS platform that combines claim overviews, task and request tracking, budgets, negotiations, legal documents, activity history, and direct messaging. Its natural-language AI assistant can summarize PDFs, draft templates and emails, and support public legal research while keeping the claim record at the center of the workflow.",
    workflow: [
      {
        title: "Create one claim record",
        description:
          "Matter details, documents, budgets, tasks, requests, and negotiations are organized around a shared source of truth.",
      },
      {
        title: "Coordinate both sides",
        description:
          "Adjusters and lawyers exchange requests, messages, and status updates inside an auditable workflow instead of scattered channels.",
      },
      {
        title: "Turn activity into insight",
        description:
          "Structured claim data feeds dashboards, client integrations, and AI-assisted document and research workflows.",
      },
    ],
    capabilities: [
      "Litigation workflow automation",
      "Claims tracking and task routing",
      "Secure document collaboration",
      "Audit-ready activity history",
      "AI-assisted legal support",
      "Custom integrations",
      "Configurable claim analytics",
    ],
    tags: ["AI-assisted", "Legal tech", "Workflow automation"],
    publicLeadership: [],
    results: [
      {
        value: "800%",
        label: "Growth in users since 2021 reported by Codal",
        verificationNote:
          "Published in the ClaimDeck case study on Codal.",
      },
      {
        value: "70%",
        label: "Increase in onboarded carriers and TPAs",
        verificationNote:
          "Published in the ClaimDeck case study on Codal.",
      },
      {
        value: "1,400+",
        label: "Data points captured per claim",
        verificationNote:
          "Published in the ClaimDeck case study on Codal.",
      },
    ],
    logo: {
      src: "/work/codal/claimdeck-logo.svg",
      alt: "ClaimDeck logo",
      width: 436,
      height: 104,
    },
    images: [
      {
        src: "/work/codal/claimdeck-cover.webp",
        alt: "ClaimDeck litigation management software displayed on a laptop",
        width: 1490,
        height: 1080,
        caption: codalMediaCaption("ClaimDeck product overview."),
      },
      {
        src: "/work/codal/claimdeck-overview.webp",
        alt: "ClaimDeck claim overview beside a legal professional handling a call",
        width: 946,
        height: 532,
        caption: codalMediaCaption("ClaimDeck claim-overview workflow."),
      },
      {
        src: "/work/codal/claimdeck-tablet.webp",
        alt: "ClaimDeck navigation and claim workspace shown on a tablet",
        width: 946,
        height: 532,
        caption: codalMediaCaption("ClaimDeck responsive claim workspace."),
      },
      {
        src: "/work/codal/claimdeck-ui.webp",
        alt: "ClaimDeck interface system showing claims workflow components",
        width: 946,
        height: 532,
        caption: codalMediaCaption("ClaimDeck interface system."),
      },
      {
        src: "/work/codal/claimdeck-ai.webp",
        alt: "ClaimDeck AI interface shown on a desktop display",
        width: 946,
        height: 532,
        caption: codalMediaCaption("ClaimDeck AI workflow."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: codalReferenceLabel,
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/claimdeck/",
      disclosure: codalReferenceDisclosure,
    },
    relatedSlugs: ["cpap", "callpotential"],
    sourceUrls: ["https://codal.com/work/claimdeck/"],
    featuredOrder: 1,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "cpap",
    clientName: "CPAP.com",
    productUrl: "https://www.cpap.com/",
    title: "Automating prescription review with OCR and generative AI",
    industry: "Healthcare eCommerce",
    clientType: "Regulated eCommerce platform",
    summary:
      "CPAP.com paired a Shopify migration with an AI prescription service that extracts clinical data, applies validation rules, processes clear cases, and routes uncertain documents to customer support.",
    originalProblem:
      "A rigid legacy commerce platform limited integrations and product-catalog flexibility, while prescription validation depended on slow manual review of handwritten and structured documents. The migration also had to preserve search visibility across a large catalog.",
    publicProductDirection:
      "The new foundation combines modular Shopify commerce, personalized product discovery, complex prescription-aware catalog logic, and a focused AI service that automates routine reviews without removing human judgment from exceptions.",
    solution:
      "Codal documented a hybrid pipeline using AWS Textract for OCR and Anthropic Claude through AWS Bedrock to interpret extracted data. The service evaluates 99 mapped metafields and business rules, advances valid prescriptions into order processing, and alerts a customer service representative when confidence or completeness requires review.",
    workflow: [
      {
        title: "Read the prescription",
        description:
          "OCR extracts data from structured, unstructured, and handwritten prescription documents.",
      },
      {
        title: "Interpret and validate",
        description:
          "The language model interprets the extracted fields and the service applies product, prescription, and compliance rules.",
      },
      {
        title: "Process or escalate",
        description:
          "Clear cases continue automatically; incomplete or uncertain cases are routed to a customer service representative.",
      },
    ],
    capabilities: [
      "AI-enhanced document extraction",
      "Prescription validation rules",
      "Human exception routing",
      "Order workflow automation",
      "Shopify platform migration",
      "Regulated data processing",
    ],
    tags: ["Generative AI", "Document AI", "Healthcare"],
    publicLeadership: [],
    results: [
      {
        value: "Minutes",
        label: "Prescription validation timeline reported by Codal",
        verificationNote: "Published in the CPAP.com case study on Codal.",
      },
      {
        value: "2M+",
        label: "Customers supported by the new platform foundation",
        verificationNote: "Published in the CPAP.com case study on Codal.",
      },
    ],
    logo: {
      src: "/work/codal/cpap-logo.svg",
      alt: "CPAP.com logo",
      width: 420,
      height: 120,
    },
    images: [
      {
        src: "/work/codal/cpap-cover.webp",
        alt: "CPAP.com healthcare commerce website displayed on a laptop",
        width: 1490,
        height: 1080,
        caption: codalMediaCaption("CPAP.com platform overview."),
      },
      {
        src: "/work/codal/cpap-overview.webp",
        alt: "CPAP.com responsive storefront and product discovery experience",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("CPAP.com commerce experience."),
      },
      {
        src: "/work/codal/cpap-product.webp",
        alt: "CPAP.com product-detail experience for guided equipment shopping",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("CPAP.com product-detail experience."),
      },
      {
        src: "/work/codal/cpap-ui.webp",
        alt: "CPAP.com product recommendations, reviews, and prescription status interface components",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("CPAP.com commerce and prescription UI system."),
      },
      {
        src: "/work/codal/cpap-rx-processing.webp",
        alt: "CPAP.com AI prescription processing workflow interface",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("CPAP.com prescription-processing workflow."),
      },
      {
        src: "/work/codal/cpap-storefront.webp",
        alt: "CPAP.com responsive storefront and guided shopping experience",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("CPAP.com responsive storefront."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: codalReferenceLabel,
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/cpap-com/",
      disclosure: codalReferenceDisclosure,
    },
    relatedSlugs: ["claimdeck", "fuze-health"],
    sourceUrls: ["https://codal.com/work/cpap-com/", "https://www.cpap.com/"],
    featuredOrder: 2,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "callpotential",
    clientName: "CallPotential",
    productUrl: "https://www.callpotential.com/",
    title: "Using AI to protect call data and automate storage operations",
    industry: "Self-storage technology",
    clientType: "Call center and workflow platform",
    summary:
      "CallPotential gives multi-site storage operators a configurable control layer for caller routing, collections, lead follow-up, recording review, and real-time call-center performance.",
    originalProblem:
      "Operators managing tens of facilities could receive hundreds of calls a day across payments, rentals, gate access, and support. Agents lacked immediate customer context, while overdue-payment outreach, lead follow-up, recording review, and sensitive-data handling consumed staff time.",
    publicProductDirection:
      "The product lets each operator define its own routing and follow-up rules, connect existing storage systems through APIs, and monitor outcomes in real time. AI is applied narrowly to organize recordings and protect sensitive spoken information.",
    solution:
      "Codal documented an intelligent backend that recognizes callers, retrieves account context, and routes each request according to operator-defined logic. Drag-and-drop workflows automate collections and sales outreach; analytics expose call-center performance; and AI organizes recordings and redacts sensitive spoken details.",
    workflow: [
      {
        title: "Recognize the caller",
        description:
          "The platform uses the phone number to retrieve unit, balance, and account context from connected systems.",
      },
      {
        title: "Apply operator rules",
        description:
          "Configurable logic routes the caller to the right agent or automated service and starts the appropriate follow-up sequence.",
      },
      {
        title: "Learn from every interaction",
        description:
          "Recordings are classified and redacted, while live analytics show service, sales, and collections performance.",
      },
    ],
    capabilities: [
      "AI-assisted audio redaction",
      "Content-based call organization",
      "Intelligent customer routing",
      "Payment collection automation",
      "Lead nurture workflows",
      "Real-time call center analytics",
    ],
    tags: ["Applied AI", "Voice workflows", "Operations automation"],
    publicLeadership: [],
    results: [
      {
        value: "35%",
        label: "Faster payment collection reported by Codal",
        verificationNote:
          "Published in the CallPotential case study on Codal.",
      },
      {
        value: "45%",
        label: "Reduction in advertising spend reported by Codal",
        verificationNote:
          "Published in the CallPotential case study on Codal.",
      },
      {
        value: "99%",
        label: "Customer retention rate reported by Codal",
        verificationNote:
          "Published in the CallPotential case study on Codal.",
      },
    ],
    logo: {
      src: "/work/codal/callpotential-logo.svg",
      alt: "CallPotential logo",
      width: 562,
      height: 107,
    },
    images: [
      {
        src: "/work/codal/callpotential-cover.webp",
        alt: "Self-storage facility representing CallPotential operations software",
        width: 946,
        height: 532,
        caption: codalMediaCaption("CallPotential industry overview."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: codalReferenceLabel,
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/callpotential/",
      disclosure: codalReferenceDisclosure,
    },
    relatedSlugs: ["built-by-girls", "claimdeck"],
    sourceUrls: [
      "https://codal.com/work/callpotential/",
      "https://www.callpotential.com/",
    ],
    featuredOrder: 3,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "built-by-girls",
    clientName: "BUILT BY GIRLS",
    productUrl: "https://codal.com/work/built-by-girls/",
    title: "Matching young women with technology mentors using machine learning",
    industry: "Social impact",
    clientType: "Mentorship platform",
    summary:
      "The WAVE platform supports the mentorship journey from onboarding and profile creation through advisor matching, timezone-aware scheduling, session preparation, and continued engagement.",
    originalProblem:
      "The mentorship journey relied on a complex matching system and cumbersome scheduling flows that created friction for both advisors and advisees.",
    publicProductDirection:
      "The redesigned experience focuses on understandable onboarding, stronger matches, timezone-aware scheduling, and personalized session content.",
    solution:
      "Codal documented a decision engine that weights participant criteria and machine-learning signals to improve advisor–advisee matching. A card-led interface simplifies onboarding, while timezone-aware scheduling and a historical-data-driven topic generator reduce friction around each session.",
    workflow: [
      {
        title: "Build a useful profile",
        description:
          "Advisors and advisees provide goals, interests, preferences, and availability through a guided onboarding flow.",
      },
      {
        title: "Create a stronger match",
        description:
          "A weighted decision engine combines participant criteria with machine-learning signals to recommend compatible pairs.",
      },
      {
        title: "Support the relationship",
        description:
          "Timezone-aware booking and personalized conversation prompts help each pair prepare for and sustain mentoring sessions.",
      },
    ],
    capabilities: [
      "Machine-learning matching",
      "Preference-based decision engine",
      "Timezone-aware scheduling",
      "Personalized topic generation",
      "Mentorship journey design",
      "Accessible onboarding flows",
    ],
    tags: ["Machine learning", "Matching", "Social impact"],
    publicLeadership: [],
    results: [
      {
        value: "4,950+",
        label: "New platform users reported by Codal",
        verificationNote:
          "Published in the BUILT BY GIRLS case study on Codal.",
      },
      {
        value: "11,000+",
        label: "Mentorship hours facilitated",
        verificationNote:
          "Published in the BUILT BY GIRLS case study on Codal.",
      },
      {
        value: "6 months",
        label: "Initial launch timeline",
        verificationNote:
          "Published in the BUILT BY GIRLS case study on Codal.",
      },
    ],
    logo: {
      src: "/work/codal/built-by-girls-logo.svg",
      alt: "BUILT BY GIRLS logo",
      width: 420,
      height: 120,
    },
    images: [
      {
        src: "/work/codal/built-by-girls-cover.webp",
        alt: "Young woman using the BUILT BY GIRLS mentorship platform",
        width: 1728,
        height: 1253,
        caption: codalMediaCaption("BUILT BY GIRLS mentorship experience."),
      },
      {
        src: "/work/codal/built-by-girls-classroom.webp",
        alt: "Student using a tablet during a technology learning session",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("BUILT BY GIRLS mentorship context."),
      },
      {
        src: "/work/codal/built-by-girls-dashboard.webp",
        alt: "BUILT BY GIRLS WAVE mentorship dashboard interface",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("WAVE mentorship dashboard."),
      },
      {
        src: "/work/codal/built-by-girls-booking.webp",
        alt: "BUILT BY GIRLS mentorship session booking interface",
        width: 1728,
        height: 973,
        caption: codalMediaCaption("WAVE session-booking experience."),
      },
      {
        src: "/work/codal/built-by-girls-session.webp",
        alt: "Young woman preparing notes for a mentorship session",
        width: 1728,
        height: 973,
        caption: codalMediaCaption("WAVE mentorship-session context."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: codalReferenceLabel,
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/built-by-girls/",
      disclosure: codalReferenceDisclosure,
    },
    relatedSlugs: ["callpotential", "cpap"],
    sourceUrls: ["https://codal.com/work/built-by-girls/"],
    featuredOrder: 4,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "fuze-health",
    clientName: "Fuze Health",
    productUrl: "https://codal.com/work/truepill-fuze-health/",
    title:
      "Accelerating specialty pharmacy operations and clinical platform modernization",
    industry: "Life sciences & pharmaceuticals",
    clientType: "Healthcare platform",
    summary:
      "Fuze Health needed to expand into specialty pharmacy while modernizing clinical workflows, payer coordination, and fulfillment operations in a tight timeline.",
    originalProblem:
      "The organization was launching specialized immunology programs with higher-touch engagement and coordination needs across insurance, fulfillment, and patient communication.",
    publicProductDirection:
      "The public platform became a scalable, patient-centered architecture with stronger onboarding, workflow automation, and payer visibility.",
    solution:
      "Codal documented focused discovery and technical blueprinting followed by full-stack work in Node.js, React, Playwright, and Contentful, including specialty pharmacy lookup, savings-card integration, and appeal status visibility.",
    workflow: [
      {
        title: "Translate the care model",
        description:
          "A focused discovery turns therapy, payer, patient, pharmacy, and timeline requirements into a technical product blueprint.",
      },
      {
        title: "Coordinate access",
        description:
          "Patients can locate a qualified specialty pharmacy, receive savings-card support, and see where an insurance appeal stands.",
      },
      {
        title: "Reuse the foundation",
        description:
          "API-led workflows and configurable content create a repeatable base for future specialty therapies and clinical programs.",
      },
    ],
    capabilities: [
      "Specialty pharmacy workflow",
      "Payer coordination",
      "Patient communication",
      "Fulfillment operations",
      "API-driven insurance workflows",
      "Clinical integration planning",
      "AI-ready data capture",
    ],
    tags: ["AI-enabled", "HealthTech", "Platform modernization"],
    publicLeadership: [],
    results: [
      {
        value: "12 weeks",
        label: "Pilot delivery timeline",
        verificationNote:
          "Published in the Fuze Health case study on Codal.",
      },
      {
        value: "AI support",
        label: "Project positioned as scalable for future AI-driven care expansion",
        verificationNote:
          "Mentioned through AI-capable workflows and follow-on EMR modernization scope in the case study.",
      },
    ],
    logo: {
      src: "/work/codal/fuze-logo.svg",
      alt: "Fuze Health logo",
      width: 420,
      height: 120,
    },
    images: [
      {
        src: "/work/codal/fuze-cover.webp",
        alt: "Fuze Health pharmacy platform displayed across digital devices",
        width: 2560,
        height: 1723,
        caption: codalMediaCaption("Fuze Health platform overview."),
      },
      {
        src: "/work/codal/fuze-mobile.webp",
        alt: "Fuze Health patient experience shown in a mobile interface mockup",
        width: 2048,
        height: 1152,
        caption: codalMediaCaption("Fuze Health mobile workflow."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: codalReferenceLabel,
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/truepill-fuze-health/",
      disclosure: codalReferenceDisclosure,
    },
    relatedSlugs: ["children-health", "claimdeck"],
    sourceUrls: ["https://codal.com/work/truepill-fuze-health/"],
    featuredOrder: 6,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "children-health",
    clientName: "Children's Health",
    productUrl: "https://www.childrens.com/",
    title:
      "Migrating a pediatric health system to a headless CMS with zero downtime",
    industry: "Healthcare",
    clientType: "Healthcare CMS modernization",
    summary:
      "Children’s Health needed to replace a sunsetting legacy CMS while preserving operations across three high-volume websites.",
    originalProblem:
      "Their legacy setup made editing and publishing across many templates and pages too slow for healthcare communications and campaign agility.",
    publicProductDirection:
      "The platform pivoted to a modern headless architecture and componentized content system to improve team speed, flexibility, and performance.",
    solution:
      "Codal documented a migration to Builder.io and Contentful, redesigned content models, reusable component templates, and performance-focused frontend delivery.",
    workflow: [
      {
        title: "Audit and prioritize",
        description:
          "Teams inventory three sites, thousands of pages, templates, integrations, and high-traffic journeys before sequencing the migration.",
      },
      {
        title: "Move in controlled releases",
        description:
          "Templates are replicated, consolidated, or redesigned and released in phases while the live healthcare experience remains available.",
      },
      {
        title: "Give editors control",
        description:
          "Contentful, Builder.io, and reusable Next.js components let marketing teams publish and update content without routine developer support.",
      },
    ],
    capabilities: [
      "Headless CMS migration",
      "Content model design",
      "Performance-focused frontend",
      "Template architecture",
      "Cross-team content governance",
      "Scalable content publishing",
    ],
    tags: ["CMS migration", "Healthcare", "Builder.io", "Contentful"],
    publicLeadership: [
      {
        name: "Children's Health team",
        role: "Project stakeholders",
        sourceUrl: "https://codal.com/work/childrens-health/",
      },
    ],
    results: [
      {
        value: "0",
        label: "Operational downtime",
        verificationNote:
          "Published in the Children’s Health case study on Codal.",
      },
      {
        value: "3",
        label: "Website ecosystem consolidated",
        verificationNote:
          "Published in the Children’s Health case study on Codal.",
      },
      {
        value: "20",
        label: "Phased releases",
        verificationNote:
          "Published in the Children’s Health case study on Codal.",
      },
    ],
    logo: {
      src: "/work/codal/children-health-logo.svg",
      alt: "Children's Health logo",
      width: 420,
      height: 120,
    },
    images: [
      {
        src: "/work/codal/children-health-cover.webp",
        alt: "Children's Health website experience displayed on digital devices",
        width: 2560,
        height: 1723,
        caption: codalMediaCaption("Children's Health website overview."),
      },
      {
        src: "/work/codal/children-health-homepage.webp",
        alt: "Children's Health redesigned homepage shown in a desktop mockup",
        width: 2048,
        height: 1152,
        caption: codalMediaCaption("Children's Health homepage experience."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: codalReferenceLabel,
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/childrens-health/",
      disclosure: codalReferenceDisclosure,
    },
    relatedSlugs: ["fuze-health", "mantl"],
    sourceUrls: ["https://codal.com/work/childrens-health/"],
    featuredOrder: 7,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "mantl",
    clientName: "MANTL",
    productUrl: "https://mantl.com/",
    title:
      "Repositioning a mobile-banking platform with conversion-focused experience design",
    industry: "Financial services",
    clientType: "Digital banking growth platform",
    summary:
      "MANTL needed to communicate both business and consumer onboarding products clearly and increase lead conversion from web traffic.",
    originalProblem:
      "The previous page experience did not convert enough visitors into meaningful actions across demos, case studies, and campaign content.",
    publicProductDirection:
      "The redesign prioritized clear value messaging, persistent CTAs, reusable content blocks, and a stronger mobile experience.",
    solution:
      "Codal documented rebuilt key pages, campaign-ready landing patterns, case-study capture, stronger calls to action, and tighter mobile responsiveness.",
    workflow: [
      {
        title: "Clarify the offer",
        description:
          "Core pages separate MANTL's business and consumer value propositions and give each audience a clearer next step.",
      },
      {
        title: "Create conversion paths",
        description:
          "Persistent calls to action, contact forms, case studies, and campaign landing pages move interest toward measurable actions.",
      },
      {
        title: "Support continuous growth",
        description:
          "Reusable content patterns, responsive layouts, and marketing integrations let teams launch and optimize campaigns faster.",
      },
    ],
    capabilities: [
      "Conversion-focused redesign",
      "Lead generation flow design",
      "Campaign landing architecture",
      "Product positioning strategy",
      "Responsive interface engineering",
      "Marketing automation integration",
    ],
    tags: ["Fintech", "UX design", "Growth optimization"],
    publicLeadership: [
      {
        name: "MANTL team",
        role: "Leadership and product stakeholders",
        sourceUrl: "https://codal.com/work/mantl/",
      },
    ],
    results: [
      {
        value: "4%",
        label: "Potential account application lift reported by Codal",
        verificationNote:
          "Published in the MANTL case study on Codal.",
      },
      {
        value: "60%",
        label: "Homepage drop-off reduction",
        verificationNote:
          "Published in the MANTL case study on Codal.",
      },
    ],
    logo: {
      src: "/work/codal/mantl-logo.svg",
      alt: "MANTL logo",
      width: 196,
      height: 104,
    },
    images: [
      {
        src: "/work/codal/mantl-cover.webp",
        alt: "Customer using the MANTL digital banking website on a laptop",
        width: 946,
        height: 686,
        caption: codalMediaCaption("MANTL digital banking website overview."),
      },
      {
        src: "/work/codal/mantl-desktop.webp",
        alt: "MANTL website desktop interface and conversion-focused content",
        width: 946,
        height: 532,
        caption: codalMediaCaption("MANTL desktop website experience."),
      },
      {
        src: "/work/codal/mantl-content.webp",
        alt: "MANTL website content and conversion sections shown on desktop",
        width: 946,
        height: 532,
        caption: codalMediaCaption("MANTL conversion-focused content system."),
      },
      {
        src: "/work/codal/mantl-landscape.webp",
        alt: "MANTL editorial banking content experience",
        width: 946,
        height: 532,
        caption: codalMediaCaption("MANTL editorial content experience."),
      },
      {
        src: "/work/codal/mantl-mobile.webp",
        alt: "MANTL responsive banking website displayed on mobile screens",
        width: 946,
        height: 532,
        caption: codalMediaCaption("MANTL mobile website experience."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: codalReferenceLabel,
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/mantl/",
      disclosure: codalReferenceDisclosure,
    },
    relatedSlugs: ["children-health", "ticketrev"],
    sourceUrls: ["https://codal.com/work/mantl/"],
    featuredOrder: 8,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "ticketrev",
    clientName: "TicketRev",
    productUrl: "https://www.ticketrev.com/",
    title: "Opening a new ticket-buying path for sports fans",
    industry: "Sports and entertainment",
    clientType: "B2B ticketing platform",
    summary:
      "TicketRev gives sports and entertainment organizations a customizable way to reach fans and extend ticket sales around their existing systems.",
    originalProblem:
      "Teams, venues, and organizations want to increase ticket sales, reach new fans, and understand their audience without replacing core ticketing infrastructure.",
    publicProductDirection:
      "The public product provides a configurable, white-label purchasing and fan-engagement layer designed to sit alongside established ticketing operations.",
    solution:
      "The public product presents branded ticket experiences, team and event integrations, audience insight, and purchase journeys designed for sports and live entertainment.",
    capabilities: [
      "White-label experiences",
      "Ticketing integrations",
      "Fan engagement",
      "Audience insight",
      "Responsive purchase journeys",
    ],
    tags: ["B2B SaaS", "Ticketing", "Fan engagement"],
    publicLeadership: [
      {
        name: "Jason Shatsky",
        role: "Co-Founder & CEO",
        sourceUrl: "https://www.ticketrev.com/about",
      },
      {
        name: "Jabari Browne",
        role: "Co-Founder & CTO",
        sourceUrl: "https://www.ticketrev.com/about",
      },
    ],
    results: [],
    images: [
      {
        src: "/work/ticketrev.png",
        alt: "TicketRev product website showing a white-label sports ticketing experience",
        width: 1440,
        height: 1000,
        caption: captureCaption("TicketRev"),
      },
    ],
    provenance: {
      kind: "public-product-profile",
      label: archivedReferenceLabel,
      sourceName: "TicketRev",
      sourceUrl: "https://www.ticketrev.com/",
      disclosure: archivedReferenceDisclosure,
    },
    relatedSlugs: ["children-health", "mantl"],
    sourceUrls: [
      "https://www.ticketrev.com/",
      "https://www.ticketrev.com/about",
    ],
    featuredOrder: 9,
    reviewedAt: "2026-08-14",
    permissionStatus: "not-requested",
    published: false,
  },
  {
    slug: "tributi",
    clientName: "Tributi",
    productUrl: "https://www.tributi.com/",
    title: "Guiding Colombian taxpayers through a complex filing journey",
    industry: "Tax technology",
    clientType: "Consumer fintech",
    summary:
      "Tributi provides a guided digital path for Colombian individuals to prepare their income-tax return through an app or expert-assisted service.",
    originalProblem:
      "Income-tax filing asks individuals to understand rules, documents, deadlines, and personal financial data that are difficult to navigate without support.",
    publicProductDirection:
      "The public offering presents two clear service paths: guided self-service for people who want control and an expert-assisted experience for people who want support.",
    solution:
      "The public journey imports available DIAN information, guides document collection and questions, prepares a draft for review, and supports filing and tax planning.",
    capabilities: [
      "Guided tax workflow",
      "Document collection",
      "DIAN data import",
      "Expert-assisted service",
      "Draft review and filing",
    ],
    tags: ["Fintech", "Consumer workflow", "Colombia"],
    publicLeadership: [],
    results: [],
    images: [
      {
        src: "/work/tributi.png",
        alt: "Tributi product website presenting its guided Colombian income-tax service",
        width: 1440,
        height: 1000,
        caption: captureCaption("Tributi"),
      },
    ],
    provenance: {
      kind: "public-product-profile",
      label: archivedReferenceLabel,
      sourceName: "Tributi",
      sourceUrl: "https://www.tributi.com/",
      disclosure: archivedReferenceDisclosure,
    },
    relatedSlugs: ["ticketrev", "claimdeck"],
    sourceUrls: [
      "https://www.tributi.com/",
      "https://www.tributi.com/blog/preguntas-frecuentes",
    ],
    featuredOrder: 10,
    reviewedAt: "2026-08-14",
    permissionStatus: "not-requested",
    published: false,
  },
  {
    slug: "loopple",
    clientName: "Loopple",
    productUrl: "https://www.loopple.com/",
    title: "Making website creation a conversational workflow",
    industry: "Website creation",
    clientType: "AI web platform",
    summary:
      "Loopple uses a conversational AI workflow to generate, customize, and publish responsive business websites.",
    originalProblem:
      "Small teams need a credible business website but often do not want to begin with a blank canvas or a traditional code-first workflow.",
    publicProductDirection:
      "The public product turns website creation into a prompt-led workflow where users can generate a starting point, refine it through conversation, and publish from one place.",
    solution:
      "The public platform generates sites from a description, supports conversational editing and content creation, and publishes to a Loopple or custom domain.",
    capabilities: [
      "Prompt-to-site generation",
      "Conversational editing",
      "Responsive layouts",
      "Content generation",
      "Managed publishing",
    ],
    tags: ["AI-native", "No-code", "Website builder"],
    publicLeadership: [],
    results: [],
    images: [
      {
        src: "/work/loopple.png",
        alt: "Loopple website showing its conversational AI website builder",
        width: 1440,
        height: 1000,
        caption: captureCaption("Loopple"),
      },
    ],
    provenance: {
      kind: "public-product-profile",
      label: archivedReferenceLabel,
      sourceName: "Loopple",
      sourceUrl: "https://www.loopple.com/",
      disclosure: archivedReferenceDisclosure,
    },
    relatedSlugs: ["children-health", "claimdeck"],
    sourceUrls: [
      "https://www.loopple.com/",
      "https://www.loopple.com/low-code-builder",
      "https://www.loopple.com/blog/front-end-developer-tools/",
    ],
    featuredOrder: 11,
    reviewedAt: "2026-08-14",
    permissionStatus: "not-requested",
    published: false,
  },
] as const;

export const capabilityLedWorkAlternative = {
  eyebrow: "Clear commitments",
  heading: "Know what you are committing to before development begins",
  copy:
    "The engagement is designed to make scope, progress, and product risk visible before the next commitment is made.",
  items: [
    {
      title: "Scope before spend",
      copy:
        "Paid work begins only after priorities, exclusions, milestones, responsibilities, timeline, and price are agreed.",
    },
    {
      title: "Visible progress",
      copy:
        "Milestone reviews keep working progress, trade-offs, decisions, and risks visible throughout delivery.",
    },
    {
      title: "Honest product risk",
      copy:
        "No studio can guarantee adoption. A focused release creates real evidence for the next product decision.",
    },
  ],
} as const;

export function getPublishedCaseStudies(): readonly CaseStudy[] {
  return caseStudies
    .filter(
      (caseStudy) =>
        caseStudy.published &&
        (caseStudy.provenance.kind === "third-party-reference" ||
          (caseStudy.provenance.kind === "verified-client-work" &&
            caseStudy.permissionStatus === "confirmed")) &&
        caseStudy.sourceUrls.includes(caseStudy.provenance.sourceUrl)
    )
    .sort((a, b) => a.featuredOrder - b.featuredOrder);
}

export function getFeaturedCaseStudies(limit = 3): readonly CaseStudy[] {
  return getPublishedCaseStudies().slice(0, limit);
}

export function getPublishedCaseStudyBySlug(
  slug: string,
): CaseStudy | undefined {
  return getPublishedCaseStudies().find(
    (caseStudy) => caseStudy.slug === slug,
  );
}

export function getRelatedCaseStudies(
  caseStudy: CaseStudy,
  limit = 2,
): readonly CaseStudy[] {
  const published = getPublishedCaseStudies();
  const selected = caseStudy.relatedSlugs
    .map((slug) => published.find((item) => item.slug === slug))
    .filter((item): item is CaseStudy => Boolean(item));

  if (selected.length >= limit) return selected.slice(0, limit);

  const selectedSlugs = new Set([
    caseStudy.slug,
    ...selected.map((item) => item.slug),
  ]);
  return [
    ...selected,
    ...published.filter((item) => !selectedSlugs.has(item.slug)),
  ].slice(0, limit);
}

export function shouldUseCapabilityLedWork(): boolean {
  return getPublishedCaseStudies().length < 2;
}
