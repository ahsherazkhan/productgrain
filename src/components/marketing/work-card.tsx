import Image from "next/image";
import type { CaseStudy } from "@/src/content/case-studies";
import { ButtonLink } from "@/src/components/ui/primitives";
import { NativeLink as Link } from "@/src/components/ui/native-link";

export function WorkCard({
  item,
  variant = "card",
  priority = false,
}: {
  item: CaseStudy;
  variant?: "card" | "featured";
  priority?: boolean;
}) {
  const cover = item.images[0];

  return (
    <article className={`work-card work-card--${variant}`}>
      {cover ? (
        <Link
          className="work-card__media"
          href={`/work/${item.slug}`}
          aria-label={`View the ${item.clientName} project profile`}
        >
          <Image
            src={cover.src}
            alt={cover.alt}
            width={cover.width}
            height={cover.height}
            unoptimized
            sizes={
              variant === "featured"
                ? "(max-width: 900px) 100vw, 760px"
                : "(max-width: 720px) 100vw, 600px"
            }
            priority={priority}
          />
          <span className="work-card__image-label">
            <i aria-hidden="true" />
            Public product website
          </span>
        </Link>
      ) : null}

      <div className="work-card__content">
        <div className="work-card__meta">
          <span>{item.clientName}</span>
          <span>{item.industry}</span>
        </div>
        <h3>
          <Link href={`/work/${item.slug}`}>{item.title}</Link>
        </h3>
        <p>{item.summary}</p>
        <ul aria-label={`${item.clientName} product characteristics`}>
          {item.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        <ButtonLink href={`/work/${item.slug}`} variant="quiet">
          Explore the product profile
        </ButtonLink>
      </div>
    </article>
  );
}
