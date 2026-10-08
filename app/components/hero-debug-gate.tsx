"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import type { SceneSettings } from "./hero-settings";

const HeroDebug = dynamic(() => import("./hero-debug"), { ssr: false });

export function HeroDebugGate({
  onChange,
}: {
  onChange: (settings: SceneSettings) => void;
}) {
  const params = useSearchParams();
  return params.has("debug") ? <HeroDebug onChange={onChange} /> : null;
}
