import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { publishedPages } from "../content/pages";
import { absoluteUrl } from "../lib/site";
import { ContentListing, ContentPage } from "./content-page";

export function getPublishedContent(path: string) {
  const page = publishedPages().find((entry) => entry.path === path);
  if (!page) notFound();
  return page;
}

export function contentMetadata(path: string): Metadata {
  const page = getPublishedContent(path);
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
                url: absoluteUrl(page.socialImage.src),
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
            images: [absoluteUrl(page.socialImage.src)],
          },
        }
      : {}),
  };
}

export function PublishedContent({ path }: { path: string }) {
  const page = getPublishedContent(path);
  if (page.kind === "listing")
    return (
      <ContentListing
        content={page}
        entries={publishedPages().filter((entry) =>
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
