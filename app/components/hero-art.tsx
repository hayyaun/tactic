"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
const HeroCanvas = dynamic(() => import("./hero-canvas"), { ssr: false });
function subscribeMotion(callback: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}
function subscribeVisibility(callback: () => void) {
  document.addEventListener("visibilitychange", callback);
  return () => document.removeEventListener("visibilitychange", callback);
}
let webGLAvailable: boolean | undefined;
function subscribeWebGL(callback: () => void) {
  if (webGLAvailable === undefined) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("webgl2");
    webGLAvailable = !!context;
    context?.getExtension("WEBGL_lose_context")?.loseContext();
  }
  callback();
  return () => {};
}
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
  const webGL = useSyncExternalStore(
    subscribeWebGL,
    () => webGLAvailable ?? false,
    () => false,
  );
  const stage = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );
  const pageVisible = useSyncExternalStore(
    subscribeVisibility,
    () => !document.hidden,
    () => true,
  );
  const onReady = useCallback(() => setReady(true), []);
  const onFailure = useCallback(() => setReady(false), []);
  useEffect(() => {
    const element = stage.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) =>
      setVisible(entry.isIntersecting),
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={stage}
      data-hero-art
      data-ready={ready}
      className="group/scene pointer-events-none absolute inset-x-0 top-113.75 bottom-0 min-[960px]:top-80 [@media(max-height:740px)_and_(max-width:700px)]:top-72.5 [@media(max-height:740px)_and_(max-width:700px)]:bottom-2"
      aria-hidden="true"
    >
      <Image
        src="/studio/mark.svg"
        alt=""
        width={40}
        height={55}
        className="absolute inset-0 size-full object-contain px-0 pt-12.5 pb-20 opacity-80 group-data-[ready=true]/scene:invisible"
      />
      <div className="pointer-events-auto absolute inset-0 opacity-0 transition-opacity duration-600 group-data-[ready=true]/scene:opacity-100 motion-reduce:transition-none">
        {webGL && (
          <SceneBoundary onFailure={onFailure}>
            <HeroCanvas
              active={visible && pageVisible}
              reducedMotion={reducedMotion}
              onReady={onReady}
            />
          </SceneBoundary>
        )}
      </div>
    </div>
  );
}
