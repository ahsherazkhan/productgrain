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
  readonly images: readonly CaseStudyImage[];
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

export const caseStudies: readonly CaseStudy[] = [
  {
    slug: "duro",
    clientName: "Duro",
    productUrl: "https://durolabs.co/",
    title: "Giving hardware teams a programmable product-data backbone",
    industry: "Hardware engineering",
    clientType: "B2B product platform",
    summary:
      "Duro Design and Duro Drive connect product lifecycle and product data management for modern hardware teams.",
    originalProblem:
      "Hardware data moves across design, sourcing, manufacturing, and operations, making reliable product records and change control difficult to maintain.",
    publicProductDirection:
      "The public product is positioned as an AI-native, API-first platform built around the hardware digital thread rather than a rigid legacy PLM workflow.",
    solution:
      "The public product centralizes parts and bill-of-material data, manages change orders, protects CAD work, and connects CAD, ERP, MES, and other systems.",
    capabilities: [
      "Product lifecycle management",
      "Product data management",
      "Change control",
      "Hardware integrations",
      "API-first workflows",
    ],
    tags: ["AI-native", "B2B SaaS", "Hardware"],
    publicLeadership: [
      {
        name: "Michael Corr",
        role: "Co-Founder & CEO",
        sourceUrl:
          "https://durolabs.co/press/duro-takes-another-step-in-reshaping-hardware-engineering/",
      },
      {
        name: "Kellan O’Connor",
        role: "Co-Founder",
        sourceUrl:
          "https://durolabs.co/press/duro-takes-another-step-in-reshaping-hardware-engineering/",
      },
    ],
    results: [],
    images: [
      {
        src: "/work/duro.png",
        alt: "Duro product website showing its hardware product-data platform",
        width: 1440,
        height: 1000,
        caption: captureCaption("Duro"),
      },
    ],
    relatedSlugs: ["genuity", "ticketrev"],
    sourceUrls: [
      "https://durolabs.co/",
      "https://durolabs.co/press/duro-unveils-duro-design/",
      "https://durolabs.co/press/duro-takes-another-step-in-reshaping-hardware-engineering/",
    ],
    featuredOrder: 1,
    reviewedAt: "2026-08-14",
    permissionStatus: "confirmed",
    published: true,
  },
  {
    slug: "genuity",
    clientName: "Genuity",
    productUrl: "https://gogenuity.com/",
    title: "Unifying the tools behind day-to-day IT operations",
    industry: "IT operations",
    clientType: "B2B SaaS and marketplace",
    summary:
      "Genuity brings IT management, purchasing, and support workflows into one connected platform for technology teams.",
    originalProblem:
      "IT teams need to manage support, assets, spend, contracts, vendors, and networks without stitching together a separate tool for every job.",
    publicProductDirection:
      "The public product brings the core operational jobs of an IT team into one integrated suite, paired with a marketplace for software and services.",
    solution:
      "The public platform combines help desk, asset management, vendor spend, contracts, telecom expenses, network monitoring, and IT purchasing.",
    capabilities: [
      "IT help desk",
      "Asset management",
      "Vendor spend",
      "Contract management",
      "Network monitoring",
    ],
    tags: ["B2B SaaS", "IT operations", "Workflow platform"],
    publicLeadership: [
      {
        name: "Colum Donahue",
        role: "Co-Founder & CEO",
        sourceUrl: "https://gogenuity.com/why-genuity/genuity-vs-spiceworks/",
      },
    ],
    results: [],
    images: [
      {
        src: "/work/genuity.png",
        alt: "Genuity product website presenting its integrated IT management platform",
        width: 1440,
        height: 1000,
        caption: captureCaption("Genuity"),
      },
    ],
    relatedSlugs: ["duro", "ticketrev"],
    sourceUrls: [
      "https://gogenuity.com/",
      "https://gogenuity.com/company/about-us/",
      "https://gogenuity.com/why-genuity/genuity-vs-spiceworks/",
    ],
    featuredOrder: 2,
    reviewedAt: "2026-08-14",
    permissionStatus: "confirmed",
    published: true,
  },
  {
    slug: "purpose",
    clientName: "Purpose",
    productUrl: "https://purpose.app/",
    title: "Turning personal reflection into guided, AI-supported action",
    industry: "Personal growth",
    clientType: "Consumer AI product",
    summary:
      "Purpose is an AI-powered personal-growth mentor designed to help people reflect, find direction, and take practical next steps.",
    originalProblem:
      "People looking for practical personal-growth guidance need more than a generic conversation: they need context, reflection, direction, and continuity over time.",
    publicProductDirection:
      "The public product combines conversational AI with evidence-backed psychological frameworks while clearly placing itself outside clinical care.",
    solution:
      "The public web and mobile experience supports reflective conversations, guided assessments, actionable next steps, and progress over time.",
    capabilities: [
      "Conversational guidance",
      "Guided assessments",
      "Action planning",
      "Progress reflection",
      "Web and mobile access",
    ],
    tags: ["AI-native", "Consumer app", "Personalisation"],
    publicLeadership: [
      {
        name: "Mark Manson",
        role: "Co-Founder",
        sourceUrl: "https://purpose.app/careers/",
      },
    ],
    results: [],
    images: [
      {
        src: "/work/purpose.png",
        alt: "Purpose product website introducing its AI personal-growth mentor",
        width: 1440,
        height: 1000,
        caption: captureCaption("Purpose"),
      },
    ],
    relatedSlugs: ["loopple", "ticketrev"],
    sourceUrls: [
      "https://purpose.app/",
      "https://purpose.app/about/",
      "https://purpose.app/careers/",
    ],
    featuredOrder: 3,
    reviewedAt: "2026-08-14",
    permissionStatus: "confirmed",
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
    relatedSlugs: ["tributi", "genuity"],
    sourceUrls: [
      "https://www.ticketrev.com/",
      "https://www.ticketrev.com/about",
    ],
    featuredOrder: 4,
    reviewedAt: "2026-08-14",
    permissionStatus: "confirmed",
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
    relatedSlugs: ["ticketrev", "genuity"],
    sourceUrls: [
      "https://www.tributi.com/",
      "https://www.tributi.com/blog/preguntas-frecuentes",
    ],
    featuredOrder: 5,
    reviewedAt: "2026-08-14",
    permissionStatus: "confirmed",
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
    relatedSlugs: ["purpose", "tributi"],
    sourceUrls: [
      "https://www.loopple.com/",
      "https://www.loopple.com/low-code-builder",
      "https://www.loopple.com/blog/front-end-developer-tools/",
    ],
    featuredOrder: 6,
    reviewedAt: "2026-08-14",
    permissionStatus: "confirmed",
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
        caseStudy.published && caseStudy.permissionStatus === "confirmed",
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
