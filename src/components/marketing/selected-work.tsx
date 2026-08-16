import Image from "next/image";
import { NativeLink as Link } from "@/src/components/ui/native-link";
import {
  getFeaturedCaseStudies,
  type CaseStudy,
} from "@/src/content/case-studies";
import {
  ButtonLink,
  Container,
  SectionIntro,
} from "@/src/components/ui/primitives";

function SelectedWorkCard({ item }: { item: CaseStudy }) {
  const cover = item.images[0];
  const logo = item.logo;

  return (
    <article className="selected-work-card">
      <Link
        className={`selected-work-card__link${cover ? "" : " selected-work-card__link--no-media"}`}
        href={`/work/${item.slug}`}
        aria-label={`Read the ${item.clientName} case study: ${item.title}`}
      >
        {cover ? (
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            unoptimized
            sizes="(max-width: 1020px) 72vw, 33vw"
          />
        ) : null}

        <span className="selected-work-card__provenance">
          <i aria-hidden="true" />
          {item.provenance.label}
        </span>

        {logo ? (
          <span className="selected-work-card__logo" aria-hidden="true">
            <Image
              src={logo.src}
              alt=""
              width={logo.width}
              height={logo.height}
              unoptimized
            />
          </span>
        ) : null}

        <div className="selected-work-card__overlay">
          <p className="selected-work-card__meta">
            <span>{item.clientName}</span>
            <span>{item.industry}</span>
          </p>
          <h3>{item.title}</h3>
          <span className="selected-work-card__cta">
            Read case study <span aria-hidden="true">&#8599;</span>
          </span>
        </div>
      </Link>
    </article>
  );
}

export function SelectedWorkSection() {
  const featured = getFeaturedCaseStudies(3);

  if (featured.length === 0) return null;

  return (
    <section className="section section--paper selected-work" id="selected-work">
      <Container>
        <div className="selected-work__heading">
          <SectionIntro
            eyebrow="Selected work"
            title="Focused products built around real workflows."
            copy="Selected products delivered by NeedFoundry across AI, SaaS, healthcare, finance, and operations."
          />
          <ButtonLink href="/work" variant="secondary">
            View all work
          </ButtonLink>
        </div>

        <ul
          className="selected-work__projects"
          aria-label="Featured product case studies"
        >
          {featured.map((item) => (
            <li key={item.slug}>
              <SelectedWorkCard item={item} />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
