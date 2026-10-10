export type ContentImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string }
  | { type: "list"; items: readonly string[] }
  | { type: "image"; image: ContentImage; caption?: string };

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
