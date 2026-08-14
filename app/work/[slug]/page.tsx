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
    title: `${item.clientName} product profile`,
    description: item.summary,
    alternates: { canonical: `/work/${slug}` },
    openGraph: cover
      ? {
          title: `${item.clientName} product profile`,
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
    creator: {
      "@type": "Organization",
      name: siteConfig.brandName,
    },
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
        eyebrow={`${item.clientName} · ${item.industry}`}
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
                  <dt>Client product</dt>
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
              <p className="project-record__disclosure">
                This profile uses current public product information reviewed in August 2026. The NeedFoundry-authored narrative does not disclose confidential delivery details, private analytics, or unsupported outcomes. Claims visible inside the captured website belong to its publisher and are not independently verified here.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {related.length ? (
        <section className="section section--muted related-projects">
          <Container>
            <div className="related-projects__heading">
              <div>
                <p className="eyebrow">Continue exploring</p>
                <h2>Related product work</h2>
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
