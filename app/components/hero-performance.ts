export type SceneTelemetry = ReturnType<typeof createSceneTelemetry>;

// Sample actual scene frames without waking the demand loop or updating React.
export function createSceneTelemetry() {
  let enabled = false;
  let frames = 0;
  let fps = 0;
  return {
    recordFrame() {
      if (enabled) frames++;
    },
    getFPS() {
      return fps;
    },
    start() {
      enabled = true;
      let previousFrames = frames;
      let previousTime = performance.now();
      const timer = window.setInterval(() => {
        const now = performance.now();
        fps = Math.round(
          ((frames - previousFrames) * 1000) / (now - previousTime),
        );
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
