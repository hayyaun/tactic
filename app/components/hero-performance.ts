export type SceneTelemetry = ReturnType<typeof createSceneTelemetry>;

// Sample actual scene frames without waking the demand loop or updating React.
export function createSceneTelemetry() {
  let enabled = false;
  let frames = 0;
  let fps = 0;
  let firstFrame = 0;
  let lastFrame = 0;
  let interrupted = false;
  let animationStarted = 0;
  return {
    recordFrame() {
      if (!enabled) return;
      const now = performance.now();
      if (!firstFrame) firstFrame = now;
      if (lastFrame && now - lastFrame > 250) interrupted = true;
      lastFrame = now;
      frames++;
    },
    setAnimating(active: boolean) {
      if (active && !animationStarted) animationStarted = performance.now();
      if (!active) animationStarted = 0;
    },
    getFPS() {
      return fps;
    },
    start(
      onSample: (fps: number, elapsed: number, continuous: boolean) => void,
    ) {
      enabled = true;
      firstFrame = 0;
      lastFrame = 0;
      interrupted = false;
      let previousFrames = frames;
      let previousTime = performance.now();
      const timer = window.setInterval(() => {
        const now = performance.now();
        fps = Math.round(
          ((frames - previousFrames) * 1000) / (now - previousTime),
        );
        // An explicitly active sweep also detects severe stalls below 4 FPS.
        // Otherwise require consecutive frames so demand-loop gaps stay idle.
        const continuous =
          (animationStarted > 0 && now - animationStarted >= 500) ||
          (!interrupted &&
            firstFrame > 0 &&
            lastFrame - firstFrame >= 500 &&
            now - lastFrame < 250);
        onSample(fps, now - previousTime, continuous);
        firstFrame = 0;
        interrupted = false;
        previousFrames = frames;
        previousTime = now;
      }, 1000);
      return () => {
        window.clearInterval(timer);
        enabled = false;
        fps = 0;
      };
    },
  };
}

export const RENDER_QUALITIES = {
  Low: { dprLimit: 1, transmissionResolution: 0.25 },
  Balanced: { dprLimit: 1.5, transmissionResolution: 0.5 },
  High: { dprLimit: 2, transmissionResolution: 1 },
};

export type RenderQuality = keyof typeof RENDER_QUALITIES | "Preview";
export function lowerRenderQuality(quality: RenderQuality): RenderQuality {
  return quality === "High"
    ? "Balanced"
    : quality === "Balanced"
      ? "Low"
      : "Preview";
}
