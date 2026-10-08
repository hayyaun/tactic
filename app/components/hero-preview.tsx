import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import preview from "../../public/studio/hero-preview.json";
import { SCENE_FRAMING } from "./hero-settings";

const image = {
  alt: "",
  width: preview.width,
  height: preview.height,
  unoptimized: true,
  loading: "eager" as const,
  fetchPriority: "high" as const,
};
const { props: wide } = getImageProps({
  ...image,
  src: "/studio/hero-preview-wide.webp",
});
const { props: portrait } = getImageProps({
  ...image,
  src: "/studio/hero-preview-portrait.webp",
});
const { props: compact } = getImageProps({
  ...image,
  src: "/studio/hero-preview-compact.webp",
});

export function HeroPreview() {
  return (
    <div
      data-scene-preview
      className="absolute top-1/2 left-1/2 aspect-(--preview-aspect) w-(--preview-width) -translate-1/2"
      style={
        {
          "--preview-aspect": `${preview.worldWidth} / ${preview.worldHeight}`,
          "--preview-width": `min(100cqw, ${(SCENE_FRAMING.minWidth / SCENE_FRAMING.minHeight) * 100}cqh)`,
        } as CSSProperties
      }
    >
      <picture>
        <source
          media="(max-height: 740px) and (max-width: 700px)"
          srcSet={compact.src}
        />
        <source media="(min-width: 960px)" srcSet={wide.src} />
        <img
          {...portrait}
          alt=""
          className="absolute max-w-none"
          style={{
            left: `${(preview.left / preview.captureWidth) * 100}%`,
            top: `${(preview.top / preview.captureHeight) * 100}%`,
            width: `${(preview.width / preview.captureWidth) * 100}%`,
            height: `${(preview.height / preview.captureHeight) * 100}%`,
          }}
        />
      </picture>
    </div>
  );
}
