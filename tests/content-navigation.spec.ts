import { expect, test } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { ContentPage as DetailPage } from "../app/components/content-page";
import type { ContentPage } from "../app/content/types";
import { contentBreadcrumbs } from "../app/lib/content-breadcrumbs";
import { breadcrumbSchema, serializeJsonLd } from "../app/lib/structured-data";

const page = (overrides: Partial<ContentPage> = {}): ContentPage => ({
  path: "/services/branding-design",
  kind: "service",
  status: "published",
  title: "Branding & Brand Identity Design",
  eyebrow: "Branding / Design",
  description: "A clear direction for your brand.",
  blocks: [],
  ...overrides,
});

test("breadcrumbs use published parent pages instead of splitting editorial labels", () => {
  for (const [path, kind, parentPath, parentTitle, label] of [
    [
      "/services/branding-design",
      "service",
      "/services",
      "A clear idea. Many ways to move.",
      "Services",
    ],
    [
      "/portfolio/new-identity",
      "project",
      "/portfolio",
      "Selected work",
      "Portfolio",
    ],
    ["/blog/clear-thinking", "article", "/blog", "Studio notes", "Journal"],
  ] as const) {
    const detail = page({ path, kind });
    const listing = page({
      path: parentPath,
      kind: "listing",
      title: parentTitle,
    });
    expect(contentBreadcrumbs(detail, [listing])).toEqual([
      { name: "TACTIC", path: "/" },
      { name: label, path: parentPath },
      { name: detail.title, path },
    ]);
  }
});

test("unpublished parents are omitted and Journal keeps its built-in destination", () => {
  const service = page();
  const draft = page({ path: "/services", kind: "listing", status: "draft" });
  expect(contentBreadcrumbs(service, [draft])).toEqual([
    { name: "TACTIC", path: "/" },
    { name: service.title, path: service.path },
  ]);
  expect(
    contentBreadcrumbs(page({ path: "/blog/a-note", kind: "article" }))[1],
  ).toEqual({ name: "Journal", path: "/blog" });
});

test("root pages have one linked ancestor and a plain current page", () => {
  for (const path of [
    "/about",
    "/contact",
    "/privacy",
    "/services",
    "/portfolio",
    "/blog",
  ]) {
    expect(contentBreadcrumbs(page({ path }))).toEqual([
      { name: "TACTIC", path: "/" },
      { name: page().title, path },
    ]);
  }
});

test("visible breadcrumb links and structured data share the same hierarchy", () => {
  const content = page();
  const listing = page({
    path: "/services",
    kind: "listing",
    title: "Services",
  });
  const breadcrumbs = contentBreadcrumbs(content, [listing]);
  const markup = renderToStaticMarkup(
    createElement(DetailPage, { content, breadcrumbs }),
  );
  const nav = markup.match(/<nav aria-label="Breadcrumb"[\s\S]*?<\/nav>/)?.[0];
  expect(nav).toBeDefined();
  expect(nav).toContain('href="/"');
  expect(nav).toContain('href="/services"');
  expect(nav).not.toContain(`href="${content.path}"`);
  expect(nav).toContain('aria-current="page"');
  expect(nav).toContain("Branding &amp; Brand Identity Design");
  expect(nav).not.toContain("Branding / Design");
  expect(markup).toContain(serializeJsonLd(breadcrumbSchema(breadcrumbs)));
});
