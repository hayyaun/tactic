import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { notFound } from "next/navigation";
import { loadPublishedPages } from "../content/load-pages";
import { metadataForContent } from "../lib/content-metadata";
import { contentBreadcrumbs } from "../lib/content-breadcrumbs";
import { ContentListing, ContentPage } from "./content-page";
import { AboutPage } from "./about-page";

export { metadataForContent } from "../lib/content-metadata";

export async function getPublishedContent(path: string) {
  const page = (await loadPublishedPages()).find(
    (entry) => entry.path === path,
  );
  if (!page) notFound();
  return page;
}

export async function contentMetadata(path: string): Promise<Metadata> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  const page = await getPublishedContent(path);
  return metadataForContent(page);
}

export async function PublishedContent({ path }: { path: string }) {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  const pages = await loadPublishedPages();
  const page = pages.find((entry) => entry.path === path);
  if (!page) notFound();
  if (page.kind === "about") return <AboutPage content={page} />;
  if (page.kind === "listing")
    return (
      <ContentListing
        content={page}
        entries={pages.filter((entry) =>
          entry.path.startsWith(`${page.path}/`),
        )}
      />
    );
  return (
    <ContentPage content={page} breadcrumbs={contentBreadcrumbs(page, pages)} />
  );
}

export async function ContentDetail({
  params,
  section,
}: {
  params: Promise<{ slug: string }>;
  section: "services" | "portfolio" | "blog";
}) {
  const { slug } = await params;
  return <PublishedContent path={`/${section}/${slug}`} />;
}
