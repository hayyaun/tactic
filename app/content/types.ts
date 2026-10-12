import type { PortableTextBlock } from "next-sanity";

export type ContentLink = {
  _type: "link";
  _key: string;
  href: string;
  openInNewTab?: boolean;
};

export type ContentTextSpan = {
  _type: "span";
  _key?: string;
  text: string;
  marks?: string[];
};

export type ContentTextBlock = PortableTextBlock<ContentLink, ContentTextSpan>;

export type ContentImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ContentBlock = { key?: string } & (
  | { type: "image"; image: ContentImage; caption?: string }
  | { type: "portableText"; value: ContentTextBlock }
);

export type ContentPage = {
  path: string;
  kind: "service" | "project" | "article" | "about" | "contact" | "listing";
  status: "draft" | "published";
  title: string;
  description: string;
  eyebrow?: string;
  hero?: ContentImage;
  socialImage?: ContentImage;
  blocks: readonly ContentBlock[];
  publishedAt?: string;
  updatedAt?: string;
  author?: string;
};
