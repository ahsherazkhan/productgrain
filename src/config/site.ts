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
  tagline: "Bring the problem. We’ll shape the product.",
  positioning:
    "We help industry experts and nontechnical founders turn real business problems into focused software products.",
  description:
    "NeedFoundry helps industry experts, business owners, and nontechnical founders define, design, build, and launch focused software products.",
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
  navigation: [
    { label: "Services", href: "/services" },
    { label: "Process", href: "/process" },
    { label: "Pricing", href: "/pricing" },
  ],
  footerNavigation: [
    { label: "Services", href: "/services" },
    { label: "Process", href: "/process" },
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about" },
  ],
  campaignNavigation: [
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
  ],
  primaryCta: {
    label: "Tell us about your project",
    href: "/apply",
  },
} as const satisfies SiteConfig;

export const siteMetadata = {
  title: "MVP and Custom Software Product Studio | NeedFoundry",
  description: siteConfig.description,
} as const;
