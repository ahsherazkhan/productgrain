import type { Metadata } from "next";
import { LegalPage } from "@/src/components/legal/legal-page";
import { siteConfig } from "@/src/config/site";
export const metadata: Metadata = { title: "Website Terms", description: `Placeholder terms for using the ${siteConfig.brandName} website and product enquiry service.`, alternates: { canonical: "/terms" } };
const sections = [
  { title: "Website information", paragraphs: ["This website provides general information about product strategy, design, MVP development, and custom software services. It does not create a client relationship, quote, guarantee, or obligation to accept an engagement."] },
  { title: "The free Product Clarity Call", paragraphs: ["The initial call is free and carries no obligation. It does not include a complete product specification, detailed architecture, full competitor report, finished prototype, or several days of unpaid consulting."] },
  { title: "Starting prices", paragraphs: ["Displayed prices are market-specific starting points for a focused first release, not fixed promises. Final scope, milestones, timeline, price, payment terms, ownership, and support are agreed in a separate written project agreement."] },
  { title: "No outcome guarantee", paragraphs: [`The ${siteConfig.brandName} website and enquiry process do not guarantee product-market fit, adoption, revenue, funding, or commercial success. The process is designed to reduce uncertainty and create useful evidence, not remove all business risk.`] },
  { title: "Your submissions", paragraphs: ["Provide information you are entitled to share. You may begin with a non-confidential description and request an NDA when appropriate. Do not submit unlawful content, credentials, payment data, or sensitive regulated records through the public enquiry form."] },
  { title: "Intellectual property", paragraphs: ["Website content remains protected by applicable rights. Client ownership and licences for paid deliverables are stated in the signed project agreement; unless otherwise agreed, ownership transfers after the relevant payments are completed."] },
  { title: "Availability and liability", paragraphs: ["The website and optional integrations may occasionally be unavailable. The final terms must include entity-specific limitations, governing law, dispute terms, and mandatory consumer or business protections for the launch markets."] },
] as const;
export default function TermsPage() { return <LegalPage title="Website terms" description="The intended boundaries for website use, free product discussions, and starting-price information." updated="16 August 2026" sections={sections} />; }
