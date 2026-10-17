import Image from "next/image";
import {
  PortableText,
  type PortableTextComponents,
  type PortableTextMarkComponentProps,
} from "@portabletext/react";
import type { ReactNode } from "react";
import type {
  ContentBlock,
  ContentLink,
  ContentTextBlock,
} from "../content/types";
import { safeContentLink } from "../lib/content-link";
import { contentHeadings } from "../lib/content-headings";
import { ContactButton } from "./dialog-buttons";

function RichTextLink({
  children,
  value,
}: PortableTextMarkComponentProps<ContentLink>) {
  const href = safeContentLink(value?.href);
  if (!href) return <>{children}</>;
  if (href === "/#contact" || href === "#contact")
    return <ContactButton preset="text">{children}</ContactButton>;
  return (
    <a
      href={href}
      target={value?.openInNewTab ? "_blank" : undefined}
      rel={value?.openInNewTab ? "noopener noreferrer" : undefined}
      className="text-foreground underline decoration-green/60 underline-offset-4 hover:text-green"
    >
      {children}
    </a>
  );
}

const richTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-[15px] leading-[1.9] wrap-anywhere text-muted min-[600px]:text-[16px]">
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2 className="pt-5 text-[26px] leading-[1.3] font-[400] wrap-anywhere min-[600px]:text-[32px]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="pt-3 text-[22px] leading-[1.4] font-[400] wrap-anywhere min-[600px]:text-[26px]">
        {children}
      </h3>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-green pl-5 text-[18px] leading-[1.8] wrap-anywhere text-foreground min-[600px]:text-[20px]">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em>{children}</em>,
    underline: ({ children }) => <span className="underline">{children}</span>,
    "strike-through": ({ children }) => <del>{children}</del>,
    code: ({ children }) => (
      <code className="rounded bg-foreground/8 px-1.5 py-0.5 font-mono text-[0.9em] text-foreground">
        {children}
      </code>
    ),
    link: RichTextLink,
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-3 pl-5 text-[15px] leading-[1.9] wrap-anywhere text-muted marker:text-green min-[600px]:text-[16px]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-3 pl-5 text-[15px] leading-[1.9] wrap-anywhere text-muted marker:text-green min-[600px]:text-[16px]">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => <li className="pl-1">{children}</li>,
    number: ({ children }) => <li className="pl-1">{children}</li>,
  },
} satisfies PortableTextComponents<ContentTextBlock>;

export function ContentBlocks({ blocks }: { blocks: readonly ContentBlock[] }) {
  const ids = new Map(contentHeadings(blocks).map(({ key, id }) => [key, id]));
  const components: PortableTextComponents<ContentTextBlock> = {
    ...richTextComponents,
    block: {
      ...richTextComponents.block,
      h2: ({ children, value }) => (
        <h2
          id={ids.get(value._key ?? "")}
          tabIndex={-1}
          className="scroll-mt-6 pt-5 text-[26px] leading-[1.3] font-[400] wrap-anywhere min-[600px]:text-[32px]"
        >
          {children}
        </h2>
      ),
      h3: ({ children, value }) => (
        <h3
          id={ids.get(value._key ?? "")}
          tabIndex={-1}
          className="scroll-mt-6 pt-3 text-[22px] leading-[1.4] font-[400] wrap-anywhere min-[600px]:text-[26px]"
        >
          {children}
        </h3>
      ),
    },
  };
  const elements: ReactNode[] = [];
  for (let index = 0; index < blocks.length; index++) {
    const block = blocks[index];
    if (block.type === "portableText") {
      const value = [
        {
          ...block.value,
          _key: block.value._key ?? block.key ?? `block-${index}`,
        },
      ];
      // Adjacent text blocks must render together so list nesting is preserved.
      while (blocks[index + 1]?.type === "portableText") {
        const next = blocks[++index];
        if (next.type === "portableText")
          value.push({
            ...next.value,
            _key: next.value._key ?? next.key ?? `block-${index}`,
          });
      }
      elements.push(
        <div key={block.key ?? block.value._key ?? index} className="space-y-7">
          <PortableText value={value} components={components} />
        </div>,
      );
      continue;
    }
    elements.push(<ContentImageBlock key={block.key ?? index} block={block} />);
  }
  return elements;
}

function ContentImageBlock({
  block,
}: {
  block: Exclude<ContentBlock, { type: "portableText" }>;
}) {
  return (
    <figure className="min-w-0">
      <Image
        {...block.image}
        alt={block.image.alt}
        className="h-auto w-full rounded-lg"
        sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 848px) calc(100vw - 80px), 768px"
      />
      {block.caption && (
        <figcaption className="mt-4 font-mono text-[11px] leading-[1.8] wrap-anywhere text-muted">
          {block.caption}
        </figcaption>
      )}
    </figure>
  );
}
