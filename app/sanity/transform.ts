import { createImageUrlBuilder } from "@sanity/image-url";
import type { PUBLISHED_CONTENT_QUERY_RESULT } from "../../sanity.types";
import type { ContentBlock, ContentImage, ContentPage } from "../content/types";
import { dataset, projectId } from "./env";

type SanityPage = PUBLISHED_CONTENT_QUERY_RESULT[number];
type SanityImage = NonNullable<SanityPage["hero"]>;
const imageBuilder = createImageUrlBuilder({ projectId, dataset });

function toImage(image: SanityImage | null): ContentImage | undefined {
  const dimensions = image?.asset?.metadata?.dimensions;
  if (
    !image?.asset?._id ||
    !image.alt ||
    !dimensions?.width ||
    !dimensions.height
  )
    return undefined;

  const width = Math.max(
    1,
    Math.round(
      dimensions.width *
        (1 - (image.crop?.left ?? 0) - (image.crop?.right ?? 0)),
    ),
  );
  const height = Math.max(
    1,
    Math.round(
      dimensions.height *
        (1 - (image.crop?.top ?? 0) - (image.crop?.bottom ?? 0)),
    ),
  );
  const outputWidth = Math.min(width, 1920);
  const outputHeight = Math.max(1, Math.round((outputWidth * height) / width));
  return {
    src: imageBuilder
      .image(image)
      .width(outputWidth)
      .height(outputHeight)
      .fit("crop")
      .auto("format")
      .url(),
    alt: image.alt,
    width: outputWidth,
    height: outputHeight,
  };
}

function matchesRoute(path: string, kind: ContentPage["kind"]) {
  switch (kind) {
    case "listing":
      return ["/services", "/portfolio", "/blog"].includes(path);
    case "about":
    case "contact":
      return path === `/${kind}`;
    case "service":
      return /^\/services\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
    case "project":
      return /^\/portfolio\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
    case "article":
      return /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
  }
}

export function toContentPage(page: SanityPage): ContentPage | undefined {
  if (
    page.status !== "published" ||
    !page.path ||
    !page.kind ||
    !matchesRoute(page.path, page.kind) ||
    !page.title ||
    !page.description ||
    (page.kind === "article" && !page.publishedAt)
  )
    return undefined;

  const blocks: ContentBlock[] = [];
  for (const block of page.blocks ?? []) {
    const key = block._key;
    switch (block._type) {
      case "block":
        if (block.children)
          blocks.push({
            key,
            type: "portableText",
            value: {
              _type: "block",
              _key: key,
              style: block.style ?? "normal",
              ...(block.listItem ? { listItem: block.listItem } : {}),
              ...(block.level !== null ? { level: block.level } : {}),
              children: block.children
                .filter((span) => typeof span.text === "string")
                .map((span) => ({
                  _type: "span",
                  _key: span._key,
                  text: span.text!,
                  marks: span.marks ?? [],
                })),
              markDefs: (block.markDefs ?? []).map((definition) => ({
                _type: "link",
                _key: definition._key,
                href: definition.href ?? "",
                openInNewTab: definition.openInNewTab ?? false,
              })),
            },
          });
        break;
      case "imageBlock": {
        const image = toImage(block.image);
        if (image)
          blocks.push({
            key,
            type: "image",
            image,
            caption: block.caption ?? undefined,
          });
        break;
      }
      default:
        throw new Error(
          `Unsupported content block on ${page.path}. Run the Studio content migration before deploying this website.`,
        );
    }
  }

  return {
    path: page.path,
    kind: page.kind,
    status: "published",
    title: page.title,
    description: page.description,
    eyebrow: page.eyebrow ?? undefined,
    hero: toImage(page.hero),
    socialImage: toImage(page.socialImage),
    blocks,
    publishedAt: page.publishedAt ?? undefined,
    updatedAt: page.updatedAt ?? undefined,
    author: page.author ?? undefined,
  };
}
