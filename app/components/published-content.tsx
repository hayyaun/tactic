import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { loadPublishedPages } from "../content/load-pages";
import { contentImageUrl } from "../lib/content-image";
import { absoluteUrl } from "../lib/site";
import { ContentListing, ContentPage } from "./content-page";

export async function getPublishedContent(path: string) {
  const page = (await loadPublishedPages()).find(
    (entry) => entry.path === path,
  );
  if (!page) notFound();
  return page;
}

export async function contentMetadata(path: string): Promise<Metadata> {
  const page = await getPublishedContent(path);
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: absoluteUrl(page.path),
      types: { "application/rss+xml": "/rss.xml" },
    },
    ...(page.socialImage
      ? {
          openGraph: {
            title: page.title,
            description: page.description,
            url: absoluteUrl(page.path),
            images: [
              {
                url: contentImageUrl(page.socialImage.src),
                alt: page.socialImage.alt,
                width: page.socialImage.width,
                height: page.socialImage.height,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title: page.title,
            description: page.description,
            images: [contentImageUrl(page.socialImage.src)],
          },
        }
      : {}),
  };
}

export async function PublishedContent({ path }: { path: string }) {
  const page = await getPublishedContent(path);
  if (page.kind === "listing")
    return (
      <ContentListing
        content={page}
        entries={(await loadPublishedPages()).filter((entry) =>
          entry.path.startsWith(`${page.path}/`),
        )}
      />
    );
  return <ContentPage content={page} />;
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
