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
  readonly footerDescriptor: string;
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
  cobalt: "#3F51D9",
  cobaltDark: "#303FAE",
  apricot: "#F3A56F",
  text: "#121A2A",
  textMuted: "#606B7E",
  border: "#D9DEE8",
  success: "#1F8A5B",
  warning: "#B87514",
  error: "#C24141",
} as const;

export const siteConfig = {
  brandName: "ProductGrain",
  tagline: "The product-first studio for AI-native software.",
  positioning:
    "ProductGrain is a product-first studio for AI-native software. We help industry experts and nontechnical founders research real problems, validate product opportunities, and build software their market actually needs.",
  description:
    "ProductGrain helps industry experts and nontechnical founders validate product opportunities and build focused AI-native software around real market needs.",
  footerDescriptor: "Founder-led product strategy, design, and engineering.",
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
    label: "Discuss your product idea, free",
    href: "/apply",
  },
} as const satisfies SiteConfig;

export const siteMetadata = {
  title: "Product-First AI Software Studio | ProductGrain",
  description: siteConfig.description,
  openGraphAlt:
    "ProductGrain, the product-first studio for AI-native software.",
  socialImage: "/og.png?v=productgrain-20260816",
  favicon: "/favicon.svg?v=productgrain-20260816",
  shortcutIcon: "/favicon.ico?v=productgrain-20260816",
} as const;
