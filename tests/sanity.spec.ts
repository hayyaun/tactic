import { expect, test } from "@playwright/test";
import type { PUBLISHED_CONTENT_QUERY_RESULT } from "../sanity.types";
import { contentImageUrl } from "../app/lib/content-image";
import { articleSchema } from "../app/lib/structured-data";
import { dataset, projectId } from "../app/sanity/env";
import { toContentPage } from "../app/sanity/transform";

type SanityPage = PUBLISHED_CONTENT_QUERY_RESULT[number];
type SanityImage = NonNullable<SanityPage["hero"]>;
type SanityBlock = NonNullable<SanityPage["blocks"]>[number];

const image: SanityImage = {
  _type: "siteImage",
  alt: "A printed identity on a white desk",
  crop: {
    _type: "sanity.imageCrop",
    left: 0.1,
    right: 0.2,
    top: 0.2,
    bottom: 0.1,
  },
  hotspot: {
    _type: "sanity.imageHotspot",
    x: 0.5,
    y: 0.5,
    width: 0.2,
    height: 0.2,
  },
  asset: {
    _id: "image-0123456789abcdef0123456789abcdef01234567-4000x3000-jpg",
    metadata: { dimensions: { width: 4000, height: 3000 } },
  },
};

function page(overrides: Partial<SanityPage> = {}): SanityPage {
  return {
    _id: "considered-design",
    path: "/blog/considered-design",
    kind: "article",
    status: "published",
    title: "Considered design",
    description: "A clear direction for an independent studio.",
    eyebrow: null,
    hero: null,
    socialImage: null,
    blocks: [],
    publishedAt: "2026-10-10T12:00:00Z",
    updatedAt: "2026-10-12T09:00:00Z",
    author: "TACTIC",
    ...overrides,
  };
}

test("Sanity content requires approval and complete publication metadata", () => {
  expect(toContentPage(page())?.status).toBe("published");
  for (const status of ["draft", null] as const) {
    expect(toContentPage(page({ status }))).toBeUndefined();
  }
  for (const overrides of [
    { path: null },
    { kind: null },
    { title: null },
    { description: "" },
    { publishedAt: null },
  ] satisfies Partial<SanityPage>[]) {
    expect(toContentPage(page(overrides))).toBeUndefined();
  }
  expect(
    toContentPage(
      page({ path: "/services/identity", kind: "service", publishedAt: null }),
    ),
  ).toMatchObject({ path: "/services/identity", kind: "service" });
});

test("Sanity content only maps to supported routes with the matching kind", () => {
  const invalidRoutes = [
    { path: "/", kind: "listing" },
    { path: "/privacy", kind: "about" },
    { path: "/contact", kind: "about" },
    { path: "/blog/considered-design", kind: "project" },
    { path: "/services/identity", kind: "listing" },
    { path: "/services/Identity", kind: "service" },
    { path: "/services/identity/extra", kind: "service" },
    { path: "/blog/considered-design/", kind: "article" },
  ] satisfies Pick<SanityPage, "path" | "kind">[];
  for (const route of invalidRoutes) {
    expect(toContentPage(page(route)), JSON.stringify(route)).toBeUndefined();
  }
  const supportedRoutes = [
    { path: "/services", kind: "listing" },
    { path: "/portfolio", kind: "listing" },
    { path: "/blog", kind: "listing" },
    { path: "/about", kind: "about" },
    { path: "/contact", kind: "contact" },
    { path: "/services/identity", kind: "service" },
    { path: "/portfolio/identity", kind: "project" },
    { path: "/blog/considered-design", kind: "article" },
  ] satisfies Pick<SanityPage, "path" | "kind">[];
  for (const route of supportedRoutes) {
    expect(toContentPage(page(route))).toMatchObject(route);
  }
});

test("Sanity editorial blocks retain their order and stable keys", () => {
  const blocks: SanityBlock[] = [
    {
      _key: "heading",
      _type: "headingBlock",
      text: "A clear direction",
      items: null,
      caption: null,
      image: null,
    },
    {
      _key: "paragraph",
      _type: "paragraphBlock",
      text: "Research & design",
      items: null,
      caption: null,
      image: null,
    },
    {
      _key: "empty-paragraph",
      _type: "paragraphBlock",
      text: null,
      items: null,
      caption: null,
      image: null,
    },
    {
      _key: "list",
      _type: "listBlock",
      text: null,
      items: ["Discovery", "Delivery"],
      caption: null,
      image: null,
    },
    {
      _key: "image",
      _type: "imageBlock",
      text: null,
      items: null,
      caption: "Printed materials",
      image,
    },
    {
      _key: "incomplete-image",
      _type: "imageBlock",
      text: null,
      items: null,
      caption: null,
      image: { ...image, alt: null },
    },
  ];
  const content = toContentPage(page({ blocks, hero: image }));
  expect(content?.blocks).toEqual([
    { key: "heading", type: "heading", text: "A clear direction" },
    { key: "paragraph", type: "paragraph", text: "Research & design" },
    { key: "list", type: "list", items: ["Discovery", "Delivery"] },
    {
      key: "image",
      type: "image",
      image: content?.hero,
      caption: "Printed materials",
    },
  ]);
});

test("Sanity images preserve alt text and crop while limiting output size", () => {
  const hero = toContentPage(page({ hero: image }))?.hero;
  expect(hero).toMatchObject({ alt: image.alt, width: 1920, height: 1440 });
  const url = new URL(hero!.src);
  expect(url.origin).toBe("https://cdn.sanity.io");
  expect(url.pathname).toBe(
    `/images/${projectId}/${dataset}/0123456789abcdef0123456789abcdef01234567-4000x3000.jpg`,
  );
  expect(url.searchParams.get("rect")).toBe("400,600,2800,2100");
  expect(url.searchParams.get("w")).toBe("1920");
  expect(url.searchParams.get("h")).toBe("1440");
  expect(url.searchParams.get("auto")).toBe("format");

  const smallImage: SanityImage = {
    ...image,
    crop: null,
    hotspot: null,
    asset: {
      _id: "image-0123456789abcdef0123456789abcdef01234567-320x200-jpg",
      metadata: { dimensions: { width: 320, height: 200 } },
    },
  };
  expect(toContentPage(page({ hero: smallImage }))?.hero).toMatchObject({
    width: 320,
    height: 200,
  });
  for (const incomplete of [
    { ...image, alt: "" },
    { ...image, asset: null },
    { ...image, asset: { ...image.asset!, metadata: null } },
  ] satisfies SanityImage[]) {
    expect(toContentPage(page({ hero: incomplete }))?.hero).toBeUndefined();
  }
});

test("article structured data accepts only local and configured Sanity images", () => {
  const content = toContentPage(page({ hero: image }));
  expect(content).toBeDefined();
  expect(articleSchema(content!)).toMatchObject({
    "@type": "BlogPosting",
    image: content!.hero!.src,
    datePublished: "2026-10-10T12:00:00Z",
    dateModified: "2026-10-12T09:00:00Z",
    author: { "@type": "Person", name: "TACTIC" },
  });
  expect(contentImageUrl("/studio/identity.jpg")).toBe(
    "https://tacticforyou.com/studio/identity.jpg",
  );
  expect(contentImageUrl(content!.hero!.src)).toBe(content!.hero!.src);
  for (const unsafe of [
    `https://other.example/images/${projectId}/${dataset}/image.jpg`,
    `https://cdn.sanity.io/images/otherproject/${dataset}/image.jpg`,
    `https://cdn.sanity.io/images/${projectId}/otherdataset/image.jpg`,
    `http://cdn.sanity.io/images/${projectId}/${dataset}/image.jpg`,
    `https://cdn.sanity.io.evil.example/images/${projectId}/${dataset}/image.jpg`,
    `https://user:pass@cdn.sanity.io/images/${projectId}/${dataset}/image.jpg`,
    "//other.example/image.jpg",
    "studio/identity.jpg",
  ]) {
    expect(() => contentImageUrl(unsafe), unsafe).toThrow();
  }
});
