import type { MetadataRoute } from "next";
import { loadPublishedPages } from "./content/load-pages";
import { sitemapEntries } from "./lib/content-sitemap";
import { isIndexable } from "./lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexable()) return [];
  return sitemapEntries(await loadPublishedPages());
}
