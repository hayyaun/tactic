import { expect, test } from "@playwright/test";
import type { ContentPage, ContentImage } from "../app/content/types";
import { metadataForContent } from "../app/lib/content-metadata";
import { contentImageUrl } from "../app/lib/content-image";

const hero: ContentImage = {
  src: "/studio/architecture.webp",
  alt: "Hero artwork",
  width: 1600,
  height: 900,
};
const social: ContentImage = {
  src: "/studio/strategy.webp",
  alt: "Social artwork",
  width: 1200,
  height: 630,
};
const page = (overrides: Partial<ContentPage> = {}): ContentPage => ({
  path: "/services/identity",
  kind: "service",
  status: "published",
  title: "Brand identity",
  description: "A clear direction for your brand.",
  blocks: [],
  ...overrides,
});

for (const [name, input, expected] of [
  ["hero fallback", { hero }, hero],
  ["explicit social override", { hero, socialImage: social }, social],
  ["social image without a hero", { socialImage: social }, social],
] as const) {
  test(`social metadata uses ${name} for Open Graph and Twitter`, () => {
    const metadata = metadataForContent(page(input));
    expect(metadata.openGraph).toMatchObject({
      images: [
        {
          url: contentImageUrl(expected.src),
          alt: expected.alt,
          width: expected.width,
          height: expected.height,
        },
      ],
    });
    expect(metadata.twitter).toMatchObject({
      card: "summary_large_image",
      images: [contentImageUrl(expected.src)],
    });
  });
}

test("pages without either image retain titles and canonical metadata", () => {
  const metadata = metadataForContent(page({ seoTitle: "Identity design" }));
  expect(metadata.title).toBe("Identity design");
  expect(metadata.description).toBe(page().description);
  expect(metadata.alternates?.canonical).toBe(
    "https://tacticforyou.com/services/identity",
  );
  expect(metadata.openGraph).toBeUndefined();
  expect(metadata.twitter).toBeUndefined();
});
