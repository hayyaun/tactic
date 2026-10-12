import type { ContentPage } from "./types";

export const defaultBlogContent: ContentPage = {
  path: "/blog",
  kind: "listing",
  status: "published",
  title: "Journal",
  description:
    "Notes on strategy, identity, and the digital world. A closer look at the thinking behind the work.",
  blocks: [],
};

export function getBlogListingContent(pages: readonly ContentPage[]) {
  return (
    pages.find(
      (page) =>
        page.path === "/blog" &&
        page.kind === "listing" &&
        page.status === "published",
    ) ?? defaultBlogContent
  );
}

export function getBlogArticles(pages: readonly ContentPage[]) {
  return pages
    .filter(
      (page) =>
        page.kind === "article" &&
        page.status === "published" &&
        /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(page.path) &&
        page.publishedAt &&
        Number.isFinite(Date.parse(page.publishedAt)),
    )
    .sort((a, b) => Date.parse(b.publishedAt!) - Date.parse(a.publishedAt!));
}

export function articleReadingMinutes(article: ContentPage) {
  const text = article.blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
        case "paragraph":
          return block.text;
        case "list":
          return block.items.join(" ");
        case "image":
          return block.caption ?? "";
      }
    })
    .join(" ")
    .trim();
  const words = text ? text.split(/\s+/).length : 0;
  return Math.max(1, Math.ceil(words / 220));
}
