export type SiteNavigationItem = {
  readonly label: string;
  readonly href: string;
};

export type SocialLinks = {
  readonly linkedin: string | null;
  readonly instagram: string | null;
  readonly facebook: string | null;
};

export type SiteConfig = {
  readonly brandName: string;
  readonly tagline: string;
  readonly positioning: string;
  readonly description: string;
  readonly siteUrl: string | null;
  readonly founderName: string | null;
  readonly founderTitle: string;
  readonly founderLinkedIn: string | null;
  readonly email: string | null;
  readonly phone: string | null;
  readonly bookingUrl: string | null;
  readonly socialLinks: SocialLinks;
  readonly navigation: readonly SiteNavigationItem[];
  readonly footerNavigation: readonly SiteNavigationItem[];
  readonly campaignNavigation: readonly SiteNavigationItem[];
  readonly primaryCta: SiteNavigationItem;
};

export const brandColors = {
  ink: "#0B1324",
  inkSoft: "#182238",
  paper: "#F6F5F0",
  surface: "#FFFFFF",
  surfaceMuted: "#EEF1F6",
  cobalt: "#415CF6",
  cobaltDark: "#2F45C7",
  signal: "#BFF078",
  text: "#121A2A",
  textMuted: "#606B7E",
  border: "#D9DEE8",
  success: "#1F8A5B",
  warning: "#B87514",
  error: "#C24141",
} as const;

export const siteConfig = {
  brandName: "NeedFoundry",
  tagline: "The AI-native software studio for focused product outcomes.",
  positioning:
    "NeedFoundry is an AI-native software studio for industry experts, business owners, and nontechnical founders who want to turn real workflow problems into focused AI-enabled software.",
  description:
    "NeedFoundry helps industry experts, business owners, and nontechnical founders turn real industry problems into focused software products—from product strategy to product design to engineering and launch.",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || null,
  founderName: null,
  founderTitle: "Founder & Product Engineer",
  founderLinkedIn: process.env.NEXT_PUBLIC_FOUNDER_LINKEDIN || null,
  email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || null,
  phone: null,
  bookingUrl: null,
  socialLinks: {
    linkedin: process.env.NEXT_PUBLIC_COMPANY_LINKEDIN || null,
    instagram: null,
    facebook: null,
  },
  footerNavigation: [
    { label: "Approach", href: "/process" },
    { label: "Pricing", href: "/pricing" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
  ],
  navigation: [
    { label: "Approach", href: "/process" },
    { label: "Work", href: "/work" },
    { label: "Pricing", href: "/pricing" },
  ],
  campaignNavigation: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  primaryCta: {
    label: "Discuss your product idea — free",
    href: "/apply",
  },
} as const satisfies SiteConfig;

export const siteMetadata = {
  title: "Product-First AI SaaS and Software Studio | NeedFoundry",
  description: siteConfig.description,
} as const;
