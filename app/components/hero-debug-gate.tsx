"use client";

import type { SceneTelemetry, RenderQuality } from "./hero-performance";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { SceneSettings } from "./hero-settings";

const HeroDebug = dynamic(() => import("./hero-debug"), { ssr: false });

export function HeroDebugGate({
  onChange,
  telemetry,
  quality,
  onQualityChange,
}: {
  onChange: (settings: SceneSettings) => void;
  telemetry: SceneTelemetry;
  quality: RenderQuality;
  onQualityChange: (quality: RenderQuality) => void;
}) {
  const params = useSearchParams();
  const enabled =
    process.env.NODE_ENV !== "production" ||
    process.env.NEXT_PUBLIC_ENABLE_SCENE_DEBUG === "true";
  return enabled && params.has("debug") ? (
    <HeroDebug
      onChange={onChange}
      telemetry={telemetry}
      quality={quality}
      onQualityChange={onQualityChange}
    />
  ) : null;
}
