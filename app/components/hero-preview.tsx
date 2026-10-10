import { getImageProps } from "next/image";
import type { CSSProperties } from "react";
import preview from "../../public/studio/hero-preview.json";
import {
  DEFAULT_SCENE_SETTINGS as defaults,
  SCENE_FRAMING,
} from "./hero-settings";

const image = {
  alt: "",
  width: preview.width,
  height: preview.height,
  // Match the desktop art's width/height constraints, including the hero's
  // 880px minimum height and 320px scene offset. Round up to avoid undersizing.
  sizes:
    "(min-width: 960px) min(93vw, calc(max(100svh, 880px) * 1.21 - 387px)), 100vw",
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
          "--preview-width": `min(${defaults.zoom * 100}cqw, ${(SCENE_FRAMING.minWidth / SCENE_FRAMING.minHeight) * defaults.zoom * 100}cqh)`,
        } as CSSProperties
      }
    >
      <picture>
        <source
          media="(max-height: 740px) and (max-width: 700px)"
          srcSet={compact.srcSet}
          sizes={compact.sizes}
        />
        <source
          media="(min-width: 960px)"
          srcSet={wide.srcSet}
          sizes={wide.sizes}
        />
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
