import type { Metadata } from "next";
import type { ContentPage } from "../content/types";
import { contentImageUrl } from "./content-image";
import { absoluteUrl } from "./site";

export function metadataForContent(page: ContentPage): Metadata {
  const title = page.seoTitle || page.title;
  const socialImage = page.socialImage ?? page.hero;
  return {
    title,
    description: page.description,
    alternates: {
      canonical: absoluteUrl(page.path),
      types: { "application/rss+xml": "/rss.xml" },
    },
    ...(socialImage
      ? {
          openGraph: {
            title,
            description: page.description,
            url: absoluteUrl(page.path),
            images: [
              {
                url: contentImageUrl(socialImage.src),
                alt: socialImage.alt,
                width: socialImage.width,
                height: socialImage.height,
              },
            ],
          },
          twitter: {
            card: "summary_large_image",
            title,
            description: page.description,
            images: [contentImageUrl(socialImage.src)],
          },
        }
      : {}),
  };
}
