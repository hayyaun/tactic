import type { ContentPage } from "../content/types";

export type Breadcrumb = { name: string; path: string };

const sectionNames: Record<string, string> = {
  "/services": "Services",
  "/portfolio": "Portfolio",
  "/blog": "Journal",
};

export function contentBreadcrumbs(
  content: ContentPage,
  pages: readonly ContentPage[] = [],
): Breadcrumb[] {
  const items = [{ name: "TACTIC", path: "/" }];
  const parentPath = content.path.slice(0, content.path.lastIndexOf("/"));
  const parent = pages.find(
    (page) =>
      page.path === parentPath &&
      page.kind === "listing" &&
      page.status === "published",
  );
  const parentName = sectionNames[parentPath];
  // Journal always has a built-in listing; other parents must be published.
  if (parentName && (parent || parentPath === "/blog"))
    items.push({
      name: parentName,
      path: parentPath,
    });
  items.push({ name: content.title, path: content.path });
  return items;
}
