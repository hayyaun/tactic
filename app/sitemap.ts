import type { MetadataRoute } from "next";
import { publishedPages } from "./content/pages";
import { absoluteUrl, isIndexable, site } from "./lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!isIndexable()) return [];
  return [
    { url: site.url },
    ...publishedPages().map((page) => ({
      url: absoluteUrl(page.path),
      ...(page.updatedAt || page.publishedAt
        ? { lastModified: page.updatedAt ?? page.publishedAt }
        : {}),
    })),
  ];
}
