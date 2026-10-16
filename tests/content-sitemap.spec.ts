import { expect, test } from "@playwright/test";
import { defaultPrivacyContent } from "../app/content/privacy";
import type { ContentPage } from "../app/content/types";
import { sitemapEntries } from "../app/lib/content-sitemap";
import { absoluteUrl, site } from "../app/lib/site";

test("sitemap keeps the default privacy URL before a CMS page is published", () => {
  expect(sitemapEntries([])).toEqual([
    { url: site.url },
    { url: absoluteUrl("/privacy") },
    { url: absoluteUrl("/blog") },
  ]);
});

test("published CMS pages update default sitemap entries without duplicating URLs", () => {
  const updatedAt = "2026-10-16T12:00:00Z";
  const pages: ContentPage[] = [
    { ...defaultPrivacyContent, updatedAt },
    {
      ...defaultPrivacyContent,
      path: "/blog",
      kind: "listing",
      updatedAt,
    },
    {
      ...defaultPrivacyContent,
      path: "/services/identity",
      kind: "service",
      publishedAt: updatedAt,
    },
  ];
  const entries = sitemapEntries(pages);
  expect(entries).toHaveLength(4);
  expect(new Set(entries.map((entry) => entry.url)).size).toBe(4);
  for (const page of pages) {
    expect(entries).toContainEqual({
      url: absoluteUrl(page.path),
      lastModified: updatedAt,
    });
  }
});
