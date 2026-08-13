import { AlertTriangle } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import { PageHero, Breadcrumbs, Container } from "@/src/components/ui/primitives";

type LegalSection = { title: string; paragraphs?: readonly string[]; items?: readonly string[] };

export function LegalPage({ title, description, updated, sections }: { title: string; description: string; updated: string; sections: readonly LegalSection[] }) {
  return <MainShell><PageHero eyebrow="Legal information" title={title} copy={description}><Breadcrumbs items={[{ label: "Home", href: "/" }, { label: title }]} /></PageHero><section className="section section--surface"><Container><div className="legal-layout"><aside><div className="legal-review"><AlertTriangle aria-hidden="true" /><strong>Professional review required</strong><p>This draft explains the intended practices but is not legal advice or a guarantee of compliance. It must be reviewed for the final entity, tools, and markets.</p></div><p>Last updated: {updated}</p></aside><article className="legal-content">{sections.map((section) => <section key={section.title}><h2>{section.title}</h2>{section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.items ? <ul>{section.items.map((item) => <li key={item}>{item}</li>)}</ul> : null}</section>)}</article></div></Container></section></MainShell>;
}
