"use client";
import dynamic from "next/dynamic";
import {
  Component,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { BACKGROUND_URL, createBackgroundURL } from "./hero-background";
import { createSceneTelemetry } from "./hero-performance";
import { HeroDebugGate } from "./hero-debug-gate";
import { DEFAULT_SCENE_SETTINGS, type SceneSettings } from "./hero-settings";
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
    console.warn(
      "TACTIC 3D scene unavailable; showing the scene preview.",
      error,
    );
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
export function HeroArt({ children }: { children: ReactNode }) {
  const webGL = useSyncExternalStore(
    subscribeWebGL,
    () => webGLAvailable ?? false,
    () => false,
  );
  const stage = useRef<HTMLDivElement>(null);
  const [telemetry] = useState(createSceneTelemetry);
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(true);
  const [settings, setSettings] = useState<SceneSettings>(
    DEFAULT_SCENE_SETTINGS,
  );
  const [backgroundURL, setBackgroundURL] = useState(BACKGROUND_URL);
  const {
    backgroundNoise,
    backgroundSmoothing,
    backgroundRadius,
    backgroundFade,
    backgroundIntensity,
  } = settings;
  useEffect(() => {
    // Debug edits are discrete work, never part of the animation loop. Debounce
    // texture uploads while dragging; production uses the small vector SVG.
    const timer = window.setTimeout(() => {
      setBackgroundURL(
        createBackgroundURL({
          backgroundNoise,
          backgroundSmoothing,
          backgroundRadius,
          backgroundFade,
          backgroundIntensity,
        }),
      );
    }, 150);
    return () => window.clearTimeout(timer);
  }, [
    backgroundNoise,
    backgroundSmoothing,
    backgroundRadius,
    backgroundFade,
    backgroundIntensity,
  ]);
  useEffect(() => {
    const section = stage.current?.closest("section");
    if (!section) return;
    const previous = section.style.backgroundImage;
    section.style.backgroundImage = `url("${backgroundURL}")`;
    return () => {
      section.style.backgroundImage = previous;
    };
  }, [backgroundURL]);
  const onSettingsChange = useCallback(
    (settings: SceneSettings) => setSettings(settings),
    [],
  );
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
    <>
      <div
        ref={stage}
        data-hero-art
        data-ready={ready}
        className="group/scene @container-size pointer-events-none absolute inset-x-0 top-(--scene-top) bottom-(--scene-bottom) [--scene-bottom:0px] [--scene-top:455px] min-[960px]:[--scene-top:320px] [@media(max-height:740px)_and_(max-width:700px)]:[--scene-bottom:8px] [@media(max-height:740px)_and_(max-width:700px)]:[--scene-top:290px]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 overflow-hidden">{children}</div>
        <div className="pointer-events-auto absolute inset-x-0 -top-(--scene-top) -bottom-(--scene-bottom) opacity-0 transition-opacity duration-0 group-data-[ready=true]/scene:opacity-100 group-data-[ready=true]/scene:duration-600 motion-reduce:transition-none">
          {webGL && (
            <SceneBoundary onFailure={onFailure}>
              <HeroCanvas
                active={visible && pageVisible}
                reducedMotion={reducedMotion}
                onReady={onReady}
                onContextLost={onFailure}
                settings={settings}
                telemetry={telemetry}
                backgroundURL={backgroundURL}
              />
            </SceneBoundary>
          )}
        </div>
      </div>
      <Suspense fallback={null}>
        <HeroDebugGate onChange={onSettingsChange} telemetry={telemetry} />
      </Suspense>
    </>
  );
}
