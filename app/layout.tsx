import type { Metadata, Viewport } from "next";
import { Geist, Newsreader } from "next/font/google";
import { CookieConsent } from "@/src/components/layout/cookie-consent";
import { ConsentAnalytics } from "@/src/components/analytics/consent-analytics";
import { AttributionCapture } from "@/src/components/analytics/attribution-capture";
import { siteConfig } from "@/src/config/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({ variable: "--font-editorial", subsets: ["latin"], display: "swap", style: ["normal", "italic"] });
const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL;

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#F6F5F0", colorScheme: "light" };

export const metadata: Metadata = {
  metadataBase: configuredSiteUrl ? new URL(configuredSiteUrl) : null,
  title: { default: "MVP and Custom Software Product Studio | NeedFoundry", template: "%s | NeedFoundry" },
  description: siteConfig.description,
  applicationName: siteConfig.brandName,
  keywords: ["MVP development", "custom software", "product strategy", "nontechnical founders", "software product studio"],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: { type: "website", siteName: siteConfig.brandName, title: siteConfig.tagline, description: siteConfig.description, images: [{ url: "/og.png", width: 1200, height: 630, alt: "NeedFoundry — Bring the problem. We’ll shape the product." }] },
  twitter: { card: "summary_large_image", title: siteConfig.tagline, description: siteConfig.description, images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${newsreader.variable}`}>
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
