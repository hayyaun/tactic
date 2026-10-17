import type { ContentBlock } from "../content/types";

export type ContentHeading = {
  key: string;
  id: string;
  title: string;
  level: 2 | 3;
};

export function contentHeadings(
  blocks: readonly ContentBlock[],
): ContentHeading[] {
  const headings: ContentHeading[] = [];
  const usedIds = new Set<string>();
  for (const [index, block] of blocks.entries()) {
    if (block.type !== "portableText") continue;
    const { value } = block;
    if ((value.style !== "h2" && value.style !== "h3") || value.listItem)
      continue;
    const title = value.children
      .map((span) => span.text)
      .join("")
      .trim();
    if (!title) continue;
    const slug = title
      .normalize("NFKD")
      .replace(/\p{M}/gu, "")
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-|-$/g, "");
    const base = `section-${slug || headings.length + 1}`;
    let id = base;
    let suffix = 2;
    while (usedIds.has(id)) id = `${base}-${suffix++}`;
    usedIds.add(id);
    headings.push({
      key: value._key ?? block.key ?? `block-${index}`,
      id,
      title,
      level: value.style === "h2" ? 2 : 3,
    });
  }
  return headings;
}
