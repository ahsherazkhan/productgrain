import type { Metadata } from "next";
import { LegalPage } from "@/src/components/legal/legal-page";
export const metadata: Metadata = { title: "Cookie Notice", description: "How necessary, analytics, and marketing technologies are controlled on NeedFoundry.", alternates: { canonical: "/cookies" } };
const sections = [
  { title: "How choices work", paragraphs: ["Necessary storage remains active to operate and protect project enquiries and remember consent settings. Analytics and marketing categories remain off until selected."] },
  { title: "Necessary", items: ["Consent choice storage.", "Private qualification results during the browser session.", "Security, anti-spam, rate-limiting, and load-balancing technologies where configured.", "First-party attribution only where the final legal review confirms an appropriate basis."] },
  { title: "Analytics", paragraphs: ["When selected and configured, analytics records limited page and conversion events. It must not receive the free-text problem, workaround, intended-user description, or other sensitive form content."] },
  { title: "Marketing", paragraphs: ["When selected and configured, Meta Pixel and server events may measure PageView, form start, lead, qualified lead, and booking actions using deduplicated event IDs. Supported customer identifiers are hashed server-side; free-text product details are excluded."] },
  { title: "Change your settings", paragraphs: ["Use the “Cookie settings” control in the footer to reopen choices. Disabling a category prevents future optional loading; a final implementation should also document how provider cookies already set can be removed in the browser."] },
  { title: "Provider inventory", paragraphs: ["Before launch, replace this draft section with an audited cookie and storage inventory including name, provider, purpose, category, duration, and market-specific legal basis."] },
] as const;
export default function CookiesPage() { return <LegalPage title="Cookie notice" description="Necessary storage stays active. Optional analytics and marketing follow the choices you make." updated="15 August 2026" sections={sections} />; }
