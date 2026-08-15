import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import { CookieConsent } from "@/src/components/layout/cookie-consent";
import { ConsentAnalytics } from "@/src/components/analytics/consent-analytics";
import { AttributionCapture } from "@/src/components/analytics/attribution-capture";
import { siteConfig, siteMetadata } from "@/src/config/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ variable: "--font-editorial", subsets: ["latin"], display: "swap", style: ["normal", "italic"] });
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F6F5F0", colorScheme: "light" };

export const metadata: Metadata = {
  metadataBase: configuredSiteUrl ? new URL(configuredSiteUrl) : null,
  title: { default: siteMetadata.title, template: `%s | ${siteConfig.brandName}` },
  description: siteMetadata.description,
  applicationName: siteConfig.brandName,
  keywords: ["AI-native studio", "product strategy", "AI-native SaaS", "custom software", "software studio", "nontechnical founders", "product discovery"],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  openGraph: {
    type: "website",
    siteName: siteConfig.brandName,
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [{ url: siteMetadata.socialImage, width: 1200, height: 630, alt: siteMetadata.openGraphAlt }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMetadata.title,
    description: siteMetadata.description,
    images: [{ url: siteMetadata.socialImage, alt: siteMetadata.openGraphAlt }],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${newsreader.variable}`}>
      <head>
        <link rel="icon" href={siteMetadata.favicon} type="image/svg+xml" />
        <link rel="shortcut icon" href={siteMetadata.shortcutIcon} />
      </head>
      <body>
        <a className="skip-link" href="#main-content">Skip to main content</a>
        {children}
        <AttributionCapture />
        <ConsentAnalytics />
        <CookieConsent />
      </body>
    </html>
  );
}
