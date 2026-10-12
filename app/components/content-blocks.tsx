import Image from "next/image";
import type { ContentBlock } from "../content/types";

export function ContentBlocks({ blocks }: { blocks: readonly ContentBlock[] }) {
  return blocks.map((block, index) => {
    switch (block.type) {
      case "heading":
        return (
          <h2
            key={block.key ?? index}
            className="pt-5 text-[26px] leading-[1.3] font-[400] wrap-anywhere min-[600px]:text-[32px]"
          >
            {block.text}
          </h2>
        );
      case "paragraph":
        return (
          <p
            key={block.key ?? index}
            className="text-[15px] leading-[1.9] wrap-anywhere text-muted min-[600px]:text-[16px]"
          >
            {block.text}
          </p>
        );
      case "list":
        return (
          <ul
            key={block.key ?? index}
            className="list-disc space-y-3 pl-5 text-[15px] leading-[1.9] wrap-anywhere text-muted marker:text-green min-[600px]:text-[16px]"
          >
            {block.items.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        );
      case "image":
        return (
          <figure key={block.key ?? index} className="min-w-0">
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
  });
}
