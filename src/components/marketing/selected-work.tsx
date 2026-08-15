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
            eyebrow="Industry references"
            title="Digital products shaped around real operating problems."
            copy="Publicly documented products selected for the useful product patterns they illustrate. Every profile links to its original source."
          />
          <ButtonLink href="/work" variant="secondary">
            View all work
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
          Each profile identifies its original publisher and retains source credit.
        </p>
      </Container>
    </section>
  );
}
