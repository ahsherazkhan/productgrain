import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { RouteEngagement } from "@/src/components/analytics/route-engagement";
import { MainShell } from "@/src/components/layout/main-shell";
import { FinalCta } from "@/src/components/marketing/sections";
import { WorkCard } from "@/src/components/marketing/work-card";
import {
  Breadcrumbs,
  ButtonLink,
  Container,
  PageHero,
} from "@/src/components/ui/primitives";
import {
  getPublishedCaseStudyBySlug,
  getPublishedCaseStudies,
  getRelatedCaseStudies,
} from "@/src/content/case-studies";
import { siteConfig } from "@/src/config/site";

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
      title: "Project profile not found",
      robots: { index: false, follow: false },
    };
  }

  const cover = item.images[0];
  return {
    title: `${item.clientName} case study`,
    description: item.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: cover
      ? {
          title: `${item.clientName} case study`,
          description: item.summary,
          images: [
            {
              url: cover.src,
              width: cover.width,
              height: cover.height,
              alt: cover.alt,
            },
          ],
        }
      : undefined,
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

  const cover = item.images[0];
  const related = getRelatedCaseStudies(item);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: item.title,
    description: item.summary,
    about: {
      "@type": "SoftwareApplication",
      name: item.clientName,
      applicationCategory: item.clientType,
      url: item.productUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.brandName,
    },
    creator: {
      "@type": "Organization",
      name:
        item.provenance.kind === "verified-client-work"
          ? siteConfig.brandName
          : item.provenance.sourceName,
    },
    citation: item.provenance.sourceUrl,
    ...(siteConfig.siteUrl
      ? { url: `${siteConfig.siteUrl}/work/${item.slug}` }
      : {}),
  };

  return (
    <MainShell>
      <RouteEngagement
        event="case_study_view"
        metaEvent="ViewContent"
        properties={{ case_study_slug: item.slug }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <PageHero
        eyebrow={`${item.provenance.label} · ${item.industry}`}
        title={item.title}
        copy={item.summary}
      >
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Work", href: "/work" },
            { label: item.clientName },
          ]}
        />
        {item.logo ? (
          <div className="case-study-hero__logo">
            <Image
              src={item.logo.src}
              alt={item.logo.alt}
              width={item.logo.width}
              height={item.logo.height}
              unoptimized
              priority
            />
          </div>
        ) : null}
        <div className="button-row case-study-hero__actions">
          <ButtonLink href={item.productUrl} variant="secondary">
            Visit {item.clientName}
          </ButtonLink>
          <ButtonLink href="/apply">Discuss a similar product</ButtonLink>
        </div>
      </PageHero>

      {cover ? (
        <section className="case-study-showcase section--surface">
          <Container>
            <figure>
              <div className="case-study-showcase__bar" aria-hidden="true">
                <span />
                <span />
                <span />
                <i>{item.clientName}</i>
              </div>
              <Image
                src={cover.src}
                alt={cover.alt}
                width={cover.width}
                height={cover.height}
                unoptimized
                sizes="(max-width: 1280px) 100vw, 1248px"
                priority
              />
              {cover.caption ? <figcaption>{cover.caption}</figcaption> : null}
            </figure>
          </Container>
        </section>
      ) : null}

      <section className="section section--paper project-record">
        <Container>
          <div className="project-record__layout">
            <aside className="project-record__facts" aria-label="Project facts">
              <p className="eyebrow">Project record</p>
              <dl>
                <div>
                  <dt>Client</dt>
                  <dd>{item.clientName}</dd>
                </div>
                <div>
                  <dt>Category</dt>
                  <dd>{item.clientType}</dd>
                </div>
                <div>
                  <dt>Market</dt>
                  <dd>{item.industry}</dd>
                </div>
                <div>
                  <dt>Engagement</dt>
                  <dd>{item.provenance.label}</dd>
                </div>
                {item.publicLeadership.length ? (
                  <div>
                    <dt>Public leadership</dt>
                    <dd>
                      {item.publicLeadership.map((leader) => (
                        <span key={leader.name}>
                          <strong>{leader.name}</strong>
                          {leader.role}
                        </span>
                      ))}
                    </dd>
                  </div>
                ) : null}
              </dl>
              <ButtonLink href={item.productUrl} variant="quiet">
                Open the live product
              </ButtonLink>
              {item.provenance.sourceUrl !== item.productUrl ? (
                <ButtonLink href={item.provenance.sourceUrl} variant="quiet">
                  View supporting source
                </ButtonLink>
              ) : null}
            </aside>

            <div className="project-record__story">
              <section>
                <p className="eyebrow">01 / Product context</p>
                <h2>The operating problem</h2>
                <p>{item.originalProblem}</p>
              </section>
              <section>
                <p className="eyebrow">02 / Public positioning</p>
                <h2>How the product is positioned</h2>
                <p>{item.publicProductDirection}</p>
              </section>
              <section>
                <p className="eyebrow">03 / Product experience</p>
                <h2>What the product enables</h2>
                <p>{item.solution}</p>
                <ul className="project-record__capabilities">
                  {item.capabilities.map((capability) => (
                    <li key={capability}>
                      <Check aria-hidden="true" />
                      {capability}
                    </li>
                  ))}
                </ul>
              </section>
              {item.workflow?.length ? (
                <section>
                  <p className="eyebrow">04 / Business logic</p>
                  <h2>How the workflow fits together</h2>
                  <ol className="project-record__workflow">
                    {item.workflow.map((step, index) => (
                      <li key={step.title}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <div>
                          <h3>{step.title}</h3>
                          <p>{step.description}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              ) : null}
            </div>
          </div>
        </Container>
      </section>

      {item.results.length ? (
        <section className="section section--paper case-study-outcomes">
          <Container>
            <div className="case-study-outcomes__heading">
              <p className="eyebrow">Published outcomes</p>
              <h2>What changed after launch.</h2>
              <p>
                These figures are reported by {item.provenance.sourceName} and shown with their source context.
              </p>
            </div>
            <div className="case-results">
              {item.results.map((result) => (
                <article key={`${result.value}-${result.label}`}>
                  <strong>{result.value}</strong>
                  <span>{result.label}</span>
                  <small>{result.verificationNote}</small>
                </article>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {item.images.length > 1 ? (
        <section className="section section--surface case-study-media">
          <Container>
            <div className="case-study-media__heading">
              <p className="eyebrow">Product media</p>
              <h2>Product screens and brand details.</h2>
              <p>
                Only locally verified project imagery is shown, with descriptive captions and original-source credit.
              </p>
            </div>
            <div className="case-study-media__grid">
              {item.images.slice(1).map((image) => (
                <figure key={image.src}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={image.width}
                    height={image.height}
                    unoptimized
                    sizes="(max-width: 760px) 100vw, 620px"
                  />
                  {image.caption ? <figcaption>{image.caption}</figcaption> : null}
                </figure>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {related.length ? (
        <section className="section section--muted related-projects">
          <Container>
            <div className="related-projects__heading">
              <div>
                <p className="eyebrow">Continue exploring</p>
                <h2>Related portfolio projects</h2>
              </div>
              <ButtonLink href="/work" variant="secondary">
                View all work
              </ButtonLink>
            </div>
            <div className="related-projects__grid">
              {related.map((relatedItem) => (
                <WorkCard item={relatedItem} key={relatedItem.slug} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <FinalCta />
    </MainShell>
  );
}
