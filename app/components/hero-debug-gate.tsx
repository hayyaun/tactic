"use client";

import type { SceneTelemetry } from "./hero-performance";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { SceneSettings } from "./hero-settings";

const HeroDebug = dynamic(() => import("./hero-debug"), { ssr: false });

export function HeroDebugGate({
  onChange,
  telemetry,
}: {
  onChange: (settings: SceneSettings) => void;
  telemetry: SceneTelemetry;
}) {
  const params = useSearchParams();
  return params.has("debug") ? (
    <HeroDebug onChange={onChange} telemetry={telemetry} />
  ) : null;
}
