import type { ContentBlock, ContentTextBlock } from "./types";

export function textBlock(
  key: string,
  text: string,
  formatting: Pick<ContentTextBlock, "style" | "listItem" | "level"> = {},
): ContentBlock & { type: "portableText" } {
  return {
    key,
    type: "portableText",
    value: {
      _type: "block",
      _key: key,
      style: "normal",
      children: [{ _type: "span", _key: "text", text, marks: [] }],
      markDefs: [],
      ...formatting,
    },
  };
}
