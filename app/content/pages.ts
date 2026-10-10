import type { ContentPage } from "./types";

// Add approved content here. Empty collections do not create public pages.
export const pages: readonly ContentPage[] = [];

export function publishedPages(entries: readonly ContentPage[] = pages) {
  return entries.filter((page) => page.status === "published");
}

export function publishedArticles(entries: readonly ContentPage[] = pages) {
  return publishedPages(entries)
    .filter((page) => page.kind === "article" && page.publishedAt)
    .sort((a, b) => b.publishedAt!.localeCompare(a.publishedAt!));
}
