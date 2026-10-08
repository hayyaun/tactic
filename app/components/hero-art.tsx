"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { Component, useRef, type ReactNode } from "react";

const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });

class SceneBoundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error) {
    this.props.onFailure();
    console.warn("TACTIC 3D scene unavailable; showing the brand mark.", error);
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function HeroArt() {
  const stage = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={stage}
      className="hero-art"
      data-state="loading"
      aria-hidden="true"
    >
      <Image
        className="hero-model-fallback"
        src="/studio/mark.svg"
        alt=""
        width={40}
        height={55}
        priority
      />
      <SceneBoundary
        onFailure={() => {
          if (stage.current) stage.current.dataset.state = "fallback";
        }}
      >
        <HeroCanvas stage={stage} />
      </SceneBoundary>
    </div>
  );
}
