import type { Metadata } from "next";
import { Check, UserRound, UsersRound } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Container, SectionIntro, Breadcrumbs } from "@/src/components/ui/primitives";
import { FinalCta } from "@/src/components/marketing/sections";

export const metadata: Metadata = { title: "Our Product Development Process", description: "A clear, milestone-based path from product problem to focused software launch and evidence-led iteration.", alternates: { canonical: "/process" } };

const stages = [
  ["Free Product Clarity Call", "We discuss the problem, users, current workflow, evidence, budget context, and intended outcome.", "Founder and client decision-makers", "A high-level direction", "Whether discovery, a prototype, a focused build, or more validation comes next", "A clear, non-confidential explanation of the problem"],
  ["Blueprint and prototype", "We map the core workflow, test assumptions, prioritize the first release, and visualize key screens.", "Founder, product designer, domain experts", "User flow, priorities, exclusions, and clickable prototype", "What the first complete workflow should include", "Workflow access and timely review"],
  ["Scope and milestone agreement", "We translate the agreed direction into delivery stages, responsibilities, dependencies, and a commercial plan.", "Founder, technical lead, client decision-makers", "Defined scope, milestones, timeline, and price", "Whether to proceed and how risk is phased", "Budget transparency and a clear approver"],
  ["Product design", "We refine interface states, responsive behavior, content, accessibility, and the reusable design system.", "Product designer, technical lead, client stakeholders", "Build-ready product designs", "How the core workflow should behave", "Focused feedback from the right people"],
  ["Development", "We build the product in measurable slices, connecting front end, backend, data, integrations, and operational tools.", "In-house engineering and product team", "Working milestone releases", "Technical trade-offs and scope decisions", "Access to systems and weekly milestone review"],
  ["Quality assurance", "We test the core journey, permissions, devices, edge cases, accessibility, and release readiness.", "QA, engineering, product, client reviewers", "A verified release candidate", "Whether the release meets the agreed acceptance criteria", "Realistic test scenarios and final review"],
  ["Launch", "We configure production, analytics, monitoring, data, and a controlled route to first users.", "Engineering, product, client operations", "A production release and handover", "How the product enters real use safely", "Domain, policy, account, and operational readiness"],
  ["Early-user learning", "We observe adoption, onboarding friction, support questions, and product behavior without guessing.", "Product team, client team, early users", "Evidence and prioritized launch fixes", "Which problems deserve attention first", "Access to users and honest feedback"],
  ["Iteration and ongoing support", "We convert evidence into a practical roadmap and deliver the next highest-value improvements.", "Product and engineering team with client owners", "An evidence-led roadmap and releases", "What to improve, extend, or stop", "Clear priorities and ongoing decision availability"],
] as const;

export default function ProcessPage() {
  const needs = ["Access to domain knowledge.", "Timely feedback.", "Access to potential users or stakeholders.", "Clear decision-makers.", "Transparency about budget and constraints.", "Availability during milestone reviews."];
  return <MainShell>
    <PageHero eyebrow="Process" title="A clear path from problem to product" copy="Every stage has a purpose, an output, and a decision. You see what is happening, what we need, and why the next commitment makes sense."><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Process" }]} /></PageHero>
    <section className="section section--surface"><Container><SectionIntro eyebrow="Nine visible stages" title="Decisions first. Deliverables second. Development with context." copy="The exact depth changes by engagement, but the path stays clear." /><ol className="process-detail-list">{stages.map((stage, index) => <li key={stage[0]}><div className="stage-marker"><span>{String(index + 1).padStart(2, "0")}</span><i /></div><div className="stage-main"><h2>{stage[0]}</h2><p>{stage[1]}</p><dl><div><dt>Who participates</dt><dd>{stage[2]}</dd></div><div><dt>You receive</dt><dd>{stage[3]}</dd></div><div><dt>Decision made</dt><dd>{stage[4]}</dd></div><div><dt>Needed from you</dt><dd>{stage[5]}</dd></div></dl></div></li>)}</ol></Container></section>
    <section className="section section--ink"><Container><div className="client-needs"><div><p className="eyebrow">Shared responsibility</p><h2>What we need from you</h2><p>Domain knowledge stays with you. We provide the product and engineering structure to turn it into a useful release.</p><div className="client-needs__people"><span><UserRound aria-hidden="true" />Clear decision-maker</span><span><UsersRound aria-hidden="true" />Reachable users or stakeholders</span></div></div><ul>{needs.map((item) => <li key={item}><Check aria-hidden="true" />{item}</li>)}</ul></div></Container></section>
    <FinalCta />
  </MainShell>;
}

