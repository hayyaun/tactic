import type { MetadataRoute } from "next";
import { loadPublishedPages } from "./content/load-pages";
import { absoluteUrl, isIndexable, site } from "./lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable()) return [];
  return [
    { url: site.url },
    { url: absoluteUrl("/privacy") },
    ...(await loadPublishedPages()).map((page) => ({
      url: absoluteUrl(page.path),
      ...(page.updatedAt || page.publishedAt
        ? { lastModified: page.updatedAt ?? page.publishedAt }
        : {}),
    })),
  ];
}
