import type { MetadataRoute } from "next";
import type { ContentPage } from "../content/types";
import { absoluteUrl, site } from "./site";

export function sitemapEntries(
  pages: readonly ContentPage[],
): MetadataRoute.Sitemap {
  const entries = new Map<string, MetadataRoute.Sitemap[number]>([
    [site.url, { url: site.url }],
    [absoluteUrl("/privacy"), { url: absoluteUrl("/privacy") }],
    [absoluteUrl("/blog"), { url: absoluteUrl("/blog") }],
  ]);
  for (const page of pages) {
    const url = absoluteUrl(page.path);
    entries.set(url, {
      url,
      ...(page.updatedAt || page.publishedAt
        ? { lastModified: page.updatedAt ?? page.publishedAt }
        : {}),
    });
  }
  return [...entries.values()];
}
