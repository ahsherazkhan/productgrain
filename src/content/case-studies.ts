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

export type CaseStudyVideo = {
  readonly embedUrl: string;
  readonly title: string;
  readonly caption: string;
  readonly sourceUrl: string;
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
  readonly videos?: readonly CaseStudyVideo[];
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

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "claimdeck",
    clientName: "ClaimDeck",
    productUrl: "https://claimdeck.com/",
    title:
      "Building a litigation platform with AI-assisted workflows for insurers and law firms",
    industry: "Legal & insurance",
    clientType: "B2B SaaS platform",
    summary:
      "ClaimDeck needed a modern litigation management system that could reduce claims leakage, centralize claim data, and make insurer-lawyer collaboration far more efficient.",
    originalProblem:
      "Claims teams were using isolated systems with disconnected communication, manual task handoffs, and fragmented datasets that increased process errors and costs.",
    publicProductDirection:
      "The public platform needed to centralize claims, support secure legal workflows, and add AI-powered productivity while remaining easy for non-technical users.",
    solution:
      "Codal documented a role-led discovery process followed by a cloud-native product with claim tracking, task orchestration, structured legal data capture, secure document workflows, and AI support for legal research and document drafting.",
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
      label: "Reference project · delivered by Codal",
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/claimdeck/",
      disclosure:
        "This project was delivered and documented by Codal. NeedFoundry presents it as an attributed industry reference, not as NeedFoundry client work.",
    },
    relatedSlugs: ["fuze-health", "cost-plus-drugs"],
    sourceUrls: ["https://codal.com/work/claimdeck/"],
    featuredOrder: 1,
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
      label: "Reference project · delivered by Codal",
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/truepill-fuze-health/",
      disclosure:
        "This project was delivered and documented by Codal. NeedFoundry presents it as an attributed industry reference, not as NeedFoundry client work.",
    },
    relatedSlugs: ["children-health", "claimdeck"],
    sourceUrls: ["https://codal.com/work/truepill-fuze-health/"],
    featuredOrder: 2,
    reviewedAt: "2026-08-15",
    permissionStatus: "not-requested",
    published: true,
  },
  {
    slug: "cost-plus-drugs",
    clientName: "Mark Cuban Cost Plus Drugs",
    productUrl: "https://costplusdrugs.com/",
    title:
      "Modernizing a pharmacy backend for faster fulfillment and scalable growth",
    industry: "Life sciences & pharmaceuticals",
    clientType: "HealthTech product platform",
    summary:
      "Cost Plus Drugs needed a more adaptable digital stack to speed innovation, unify product experiences, and increase fulfillment reliability.",
    originalProblem:
      "The prior setup limited agility across prescription processing and customer support as demand, pricing logic, and operations complexity increased.",
    publicProductDirection:
      "The project moved from fragmented tooling toward a unified platform with stronger data control, API flexibility, and real-time operational behavior.",
    solution:
      "Codal documented end-to-end workflow discovery followed by restructured backend services and custom capabilities across ordering, fulfillment, copay audits, and CMS synchronization.",
    capabilities: [
      "Prescription fulfillment engineering",
      "Real-time CMS and pricing updates",
      "API modernization",
      "Prescription migration tooling",
      "Customer service optimization",
      "Compliance-minded backend design",
    ],
    tags: ["HealthTech", "Operations engineering", "eCommerce platform"],
    publicLeadership: [
      {
        name: "Paul Vasquez",
        role: "COO & Head of Pharmacy",
        sourceUrl: "https://codal.com/work/costplusdrugs/",
      },
    ],
    results: [
      {
        value: "Faster",
        label: "Feature release and iteration velocity",
        verificationNote:
          "Published in the Cost Plus Drugs case study on Codal.",
      },
      {
        value: "All-time-low",
        label: "Order-to-fulfillment friction",
        verificationNote:
          "Published in the Cost Plus Drugs case study on Codal.",
      },
    ],
    logo: {
      src: "/work/codal/cost-plus-logo.svg",
      alt: "Mark Cuban Cost Plus Drug Company logo",
      width: 420,
      height: 120,
    },
    images: [
      {
        src: "/work/codal/cost-plus-cover.webp",
        alt: "Cost Plus Drugs pharmacy storefront displayed on a desktop screen",
        width: 1728,
        height: 1163,
        caption: codalMediaCaption("Cost Plus Drugs platform overview."),
      },
      {
        src: "/work/codal/cost-plus-prescription.webp",
        alt: "Cost Plus Drugs online prescription experience interface",
        width: 1728,
        height: 972,
        caption: codalMediaCaption("Cost Plus Drugs prescription experience."),
      },
    ],
    videos: [
      {
        embedUrl:
          "https://player.vimeo.com/video/1120947017?dnt=1&title=0&byline=0&portrait=0",
        title: "Cost Plus Drugs homepage product demonstration",
        caption: "Homepage product demonstration published by Codal.",
        sourceUrl: "https://codal.com/work/costplusdrugs/",
      },
      {
        embedUrl:
          "https://player.vimeo.com/video/1120951765?dnt=1&title=0&byline=0&portrait=0",
        title: "Cost Plus Drugs ordering workflow demonstration",
        caption: "Ordering workflow demonstration published by Codal.",
        sourceUrl: "https://codal.com/work/costplusdrugs/",
      },
      {
        embedUrl:
          "https://player.vimeo.com/video/1120954586?dnt=1&title=0&byline=0&portrait=0",
        title: "Cost Plus Drugs pricing calculator demonstration",
        caption: "Pricing calculator demonstration published by Codal.",
        sourceUrl: "https://codal.com/work/costplusdrugs/",
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: "Reference project · delivered by Codal",
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/costplusdrugs/",
      disclosure:
        "This project was delivered and documented by Codal. NeedFoundry presents it as an attributed industry reference, not as NeedFoundry client work.",
    },
    relatedSlugs: ["claimdeck", "mantl"],
    sourceUrls: [
      "https://codal.com/work/costplusdrugs/",
      "https://costplusdrugs.com/",
    ],
    featuredOrder: 3,
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
      label: "Reference project · delivered by Codal",
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/childrens-health/",
      disclosure:
        "This project was delivered and documented by Codal. NeedFoundry presents it as an attributed industry reference, not as NeedFoundry client work.",
    },
    relatedSlugs: ["fuze-health", "cost-plus-drugs"],
    sourceUrls: ["https://codal.com/work/childrens-health/"],
    featuredOrder: 4,
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
        src: "/work/codal/mantl-mobile.webp",
        alt: "MANTL responsive banking website displayed on mobile screens",
        width: 946,
        height: 532,
        caption: codalMediaCaption("MANTL mobile website experience."),
      },
    ],
    provenance: {
      kind: "third-party-reference",
      label: "Reference project · delivered by Codal",
      sourceName: "Codal",
      sourceUrl: "https://codal.com/work/mantl/",
      disclosure:
        "This project was delivered and documented by Codal. NeedFoundry presents it as an attributed industry reference, not as NeedFoundry client work.",
    },
    relatedSlugs: ["children-health", "ticketrev"],
    sourceUrls: ["https://codal.com/work/mantl/"],
    featuredOrder: 5,
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
      label: "Independent public product profile",
      sourceName: "TicketRev",
      sourceUrl: "https://www.ticketrev.com/",
      disclosure:
        "This independent profile is based on public product information and is not presented as verified NeedFoundry client work.",
    },
    relatedSlugs: ["children-health", "mantl"],
    sourceUrls: [
      "https://www.ticketrev.com/",
      "https://www.ticketrev.com/about",
    ],
    featuredOrder: 6,
    reviewedAt: "2026-08-14",
    permissionStatus: "not-requested",
    published: true,
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
      label: "Independent public product profile",
      sourceName: "Tributi",
      sourceUrl: "https://www.tributi.com/",
      disclosure:
        "This independent profile is based on public product information and is not presented as verified NeedFoundry client work.",
    },
    relatedSlugs: ["ticketrev", "claimdeck"],
    sourceUrls: [
      "https://www.tributi.com/",
      "https://www.tributi.com/blog/preguntas-frecuentes",
    ],
    featuredOrder: 7,
    reviewedAt: "2026-08-14",
    permissionStatus: "not-requested",
    published: true,
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
      label: "Independent public product profile",
      sourceName: "Loopple",
      sourceUrl: "https://www.loopple.com/",
      disclosure:
        "This independent profile is based on public product information and is not presented as verified NeedFoundry client work.",
    },
    relatedSlugs: ["children-health", "claimdeck"],
    sourceUrls: [
      "https://www.loopple.com/",
      "https://www.loopple.com/low-code-builder",
      "https://www.loopple.com/blog/front-end-developer-tools/",
    ],
    featuredOrder: 8,
    reviewedAt: "2026-08-14",
    permissionStatus: "not-requested",
    published: true,
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
        caseStudy.sourceUrls.includes(caseStudy.provenance.sourceUrl) &&
        (caseStudy.provenance.kind !== "verified-client-work" ||
          caseStudy.permissionStatus === "confirmed"),
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
