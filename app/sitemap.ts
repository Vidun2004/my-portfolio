import type { MetadataRoute } from "next";
import { PROJECTS } from "@/lib/projects";
import { getPublicProjectSlugs } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const dbSlugs = await getPublicProjectSlugs();
  const slugs = new Set([...PROJECTS.map((p) => p.slug), ...dbSlugs]);
  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...[...slugs].map((slug) => ({
      url: `${SITE_URL}/projects/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
