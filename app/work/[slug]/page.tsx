import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check, Quote } from "lucide-react";
import { MainShell } from "@/src/components/layout/main-shell";
import {
  PageHero,
  Breadcrumbs,
  Container,
  ButtonLink,
} from "@/src/components/ui/primitives";
import {
  getPublishedCaseStudyBySlug,
  getPublishedCaseStudies,
} from "@/src/content/case-studies";
import { getPublishedTestimonials } from "@/src/content/testimonials";
import { FinalCta } from "@/src/components/marketing/sections";
import { RouteEngagement } from "@/src/components/analytics/route-engagement";

export function generateStaticParams() {
  return getPublishedCaseStudies().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getPublishedCaseStudyBySlug(slug);
  if (!item) {
    return {
      title: "Case study not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: item.title,
    description: item.summary,
    alternates: { canonical: `/work/${slug}` },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getPublishedCaseStudyBySlug(slug);
  if (!item) notFound();

  const testimonial = item.testimonialId
    ? getPublishedTestimonials().find(
        (entry) => entry.projectSlug === item.slug,
      )
    : undefined;
  const related = getPublishedCaseStudies().find(
    (entry) => entry.slug !== item.slug,
  );
  const rows = [
    ["Original problem", item.originalProblem],
    ["Existing workflow", item.existingWorkflow],
    ["Product decision", item.productDecision],
    ["Product and technical solution", item.solution],
    ["Founder’s role", item.founderRole],
    ["Team’s role", item.teamRole],
  ] as const;

  return (
    <MainShell>
      <RouteEngagement event="case_study_view" metaEvent="ViewContent" properties={{ case_study_slug: item.slug }} />
      <PageHero
        eyebrow={`${item.industry} · ${item.clientType}`}
        title={item.title}
        copy={item.summary}
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Work", href: "/work" },
            { label: item.title },
          ]}
        />
      </PageHero>

      {item.images.length ? (
        <section className="case-study-gallery section--paper">
          <Container>
            {item.images.map((image) => (
              <Image
                key={image.src}
                src={image.src}
                alt={image.alt}
                width={1280}
                height={800}
                sizes="(max-width: 1280px) 100vw, 1280px"
              />
            ))}
          </Container>
        </section>
      ) : null}

      <section className="section section--surface">
        <Container>
          <div className="case-study-detail">
            {rows.map(([title, copy]) => (
              <section key={title}>
                <h2>{title}</h2>
                <p>{copy}</p>
              </section>
            ))}
            {item.importantAssumptions.length ? (
              <section>
                <h2>Important assumptions</h2>
                <ul>
                  {item.importantAssumptions.map((assumption) => (
                    <li key={assumption}><Check aria-hidden="true" />{assumption}</li>
                  ))}
                </ul>
              </section>
            ) : null}
            {item.deliberateExclusions.length ? (
              <section>
                <h2>What was deliberately excluded</h2>
                <ul>
                  {item.deliberateExclusions.map((exclusion) => (
                    <li key={exclusion}><Check aria-hidden="true" />{exclusion}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </div>
        </Container>
      </section>

      {item.results.length ? (
        <section className="section section--ink">
          <Container>
            <p className="eyebrow">Verified results</p>
            <div className="case-results">
              {item.results.map((result) => (
                <article key={`${result.value}-${result.label}`}>
                  <strong>{result.value}</strong>
                  <span>{result.label}</span>
                  {result.verificationNote ? <small>{result.verificationNote}</small> : null}
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {testimonial ? (
        <section className="section section--paper">
          <Container>
            <blockquote className="case-quote">
              <Quote aria-hidden="true" />
              <p>{testimonial.quote}</p>
              <footer>{testimonial.clientName}, {testimonial.clientRole} · {testimonial.company}</footer>
            </blockquote>
          </Container>
        </section>
      ) : null}

      {related ? (
        <section className="section section--muted">
          <Container>
            <div className="related-work">
              <div><p className="eyebrow">Related project</p><h2>{related.title}</h2><p>{related.summary}</p></div>
              <ButtonLink href={`/work/${related.slug}`} variant="secondary">Read the related case study</ButtonLink>
            </div>
          </Container>
        </section>
      ) : null}

      <FinalCta />
    </MainShell>
  );
}
