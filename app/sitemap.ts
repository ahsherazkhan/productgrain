import type { MetadataRoute } from "next";
import { getPublishedCaseStudies } from "@/src/content/case-studies";
const baseRoutes = ["", "/services", "/process", "/pricing", "/about", "/apply", "/mvp-development", "/mvp-development/uk", "/mvp-development/us", "/privacy", "/terms", "/cookies"];
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL;
  if (!base) return [];
  const now = new Date();
  const work = getPublishedCaseStudies();
  const routes = work.length > 0 ? [...baseRoutes, "/work"] : baseRoutes;
  return [
    ...routes.map((route) => ({
      url: `${base}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "weekly" as const : "monthly" as const,
      priority: route === "" ? 1 : route.startsWith("/mvp-development/") ? 0.9 : 0.7,
    })),
    ...work.map((study) => ({
      url: `${base}/work/${study.slug}`,
      lastModified: new Date(study.reviewedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
