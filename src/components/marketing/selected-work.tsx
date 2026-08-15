import { NativeLink as Link } from "@/src/components/ui/native-link";
import {
  getFeaturedCaseStudies,
  getPublishedCaseStudies,
} from "@/src/content/case-studies";
import {
  ButtonLink,
  Container,
  SectionIntro,
} from "@/src/components/ui/primitives";
import { WorkCard } from "./work-card";

export function SelectedWorkSection() {
  const work = getPublishedCaseStudies();
  const featured = getFeaturedCaseStudies(3);
  const [lead, ...supporting] = featured;

  if (!lead) return null;

  return (
    <section className="section section--paper selected-work" id="selected-work">
      <Container>
        <div className="selected-work__heading">
          <SectionIntro
            eyebrow="Product references"
            title="Real products, studied through real operating problems."
            copy="Attributed third-party case studies and independent public product profiles chosen for their relevance to founders planning AI, SaaS, healthcare, fintech, and workflow products."
          />
          <ButtonLink href="/work" variant="secondary">
            View all references
          </ButtonLink>
        </div>

        <nav className="selected-work__index" aria-label="Selected product profiles">
          {work.map((item, index) => (
            <Link key={item.slug} href={`/work/${item.slug}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {item.clientName}
            </Link>
          ))}
        </nav>

        <div className="selected-work__layout">
          <WorkCard item={lead} variant="featured" />
          <div className="selected-work__supporting">
            {supporting.map((item) => (
              <WorkCard item={item} key={item.slug} />
            ))}
          </div>
        </div>

        <p className="selected-work__note">
          These are attributed references and public product profiles, not claims of NeedFoundry delivery. All trademarks and media remain the property of their respective owners; published outcomes are not independently verified by NeedFoundry.
        </p>
      </Container>
    </section>
  );
}
