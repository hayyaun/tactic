import type { ContentPage } from "../content/types";
import { absoluteUrl, site } from "./site";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: absoluteUrl("/studio/mark.svg"),
  };
}

export function articleSchema(page: ContentPage) {
  if (page.kind !== "article" || !page.publishedAt) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: page.title,
    description: page.description,
    mainEntityOfPage: absoluteUrl(page.path),
    datePublished: page.publishedAt,
    ...(page.updatedAt ? { dateModified: page.updatedAt } : {}),
    ...(page.author
      ? { author: { "@type": "Person", name: page.author } }
      : {}),
    ...(page.hero ? { image: absoluteUrl(page.hero.src) } : {}),
    publisher: { "@id": `${site.url}/#organization` },
  };
}

export function breadcrumbSchema(
  items: readonly { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}
