import { Check, FileText, MessageSquareText, Route, UsersRound, WalletCards } from "lucide-react";
import type { MarketKey } from "@/src/config/markets";
import { markets } from "@/src/config/markets";
import { CampaignHeader } from "@/src/components/layout/site-header";
import { SiteFooter } from "@/src/components/layout/site-footer";
import { Container, ButtonLink, SectionIntro } from "@/src/components/ui/primitives";
import { PricingSection } from "./pricing-section";
import { FounderSection } from "./sections";
import { ApplicationForm } from "@/src/components/forms/application-form";

const callItems = [
  [MessageSquareText, "Explain the problem and current workflow."],
  [UsersRound, "Identify the intended users."],
  [Route, "Discuss the most valuable first outcome."],
  [FileText, "Review likely product complexity."],
  [WalletCards, "Discuss approximate budget and timeline."],
  [Check, "Receive a high-level recommended next step."],
] as const;

export function CampaignLanding({ market }: { market: MarketKey }) {
  const marketConfig = markets[market];
  const structuredData = { "@context": "https://schema.org", "@type": "Service", name: `MVP development in the ${marketConfig.name}`, areaServed: market === "uk" ? "GB" : "US", provider: { "@type": "Organization", name: "NeedFoundry" } };
  return <><CampaignHeader market={market} /><main id="main-content" lang={marketConfig.locale}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    <section className="campaign-hero ruled-bg"><Container><div className="campaign-hero__grid"><div><p className="eyebrow"><span className="eyebrow-dot" />For industry experts, business owners, and nontechnical founders</p><h1>You know the problem. We’ll help shape and build the <em>software.</em></h1><p>Discuss your product with a founder-led, in-house team. No technical specification is required, and the initial Product Clarity Call is completely free.</p><div className="button-row"><ButtonLink href="#application">Check your product fit</ButtonLink><ButtonLink href="#pricing" variant="secondary">See starting prices</ButtonLink></div><p className="trust-line"><span>Free initial call</span><span>In-house team</span><span>Clear milestones</span><span>No hidden consultation fee</span></p></div><div className="campaign-hero__visual"><div className="workflow-window"><div className="workflow-window__top"><span /><span /><span /><small>Current workflow</small></div><div className="workflow-raw"><span>Spreadsheet</span><span>Email</span><span>Documents</span><span>Follow-ups</span></div><div className="workflow-connector"><i /><i /><strong>One focused workflow</strong></div><div className="workflow-product"><div><small>User</small><strong>One clear action</strong></div><div><small>System</small><strong>Connected data</strong></div><div><small>Outcome</small><strong>Visible progress</strong></div></div></div></div></div></Container></section>
    <section className="campaign-problem section--ink"><Container><div><p className="eyebrow">A familiar starting point</p><h2>Still handling an important workflow through spreadsheets, email, documents, and manual follow-ups?</h2></div><p>That process may be suitable for an internal tool, client portal, automation product, or SaaS application. We help determine the most useful first version before major development begins.</p></Container></section>
    <section className="section section--surface" id="how-it-works"><Container><SectionIntro eyebrow="The free Product Clarity Call" title="What happens during the free call?" copy="Bring a real problem and the way it is handled today. We structure the conversation around a practical next decision." /><div className="call-items">{callItems.map(([Icon, text], index) => <article key={text}><span>{String(index + 1).padStart(2, "0")}</span><Icon aria-hidden="true" /><p>{text}</p></article>)}</div><p className="call-exclusion"><strong>Clear boundary:</strong> The free call does not include a finished prototype or full technical specification.</p></Container></section>
    <PricingSection initialMarket={market} embedded />
    <FounderSection campaign />
    <section className="section application-section" id="application"><Container><div className="application-section__intro"><p className="eyebrow">Short product fit check</p><h2>Bring us the problem—not a technical specification.</h2><p>Share enough context for us to recommend a Product Clarity Call, manual review, or a smaller first step. Your answers stay saved during this browser session.</p><ul><li><Check aria-hidden="true" />No account or payment</li><li><Check aria-hidden="true" />Market-specific budget ranges</li><li><Check aria-hidden="true" />Booking shown only after qualification</li></ul></div><ApplicationForm market={market} embedded /></Container></section>
    <section className="final-cta"><Container><div><p className="eyebrow">A practical first step</p><h2>Bring us the problem—not a technical specification.</h2><p>The short application helps us prepare a useful recommendation before any call is scheduled.</p></div><div className="final-cta__action"><ButtonLink href="#application" variant="light">Start the free application</ButtonLink><p>No account · No payment · Progress saved in this session</p></div></Container></section>
  </main><SiteFooter /></>;
}
