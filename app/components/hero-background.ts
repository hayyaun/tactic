export const BACKGROUND_DEFAULTS = {
  backgroundNoise: 0.1,
  backgroundRadius: 0.975,
  backgroundFade: 0.6,
  backgroundIntensity: 0.32,
};
export type BackgroundSettings = typeof BACKGROUND_DEFAULTS;
export const BACKGROUND_URL = "/studio/hero-background.png";
export const BACKGROUND_WIDTH = 1440;
export const BACKGROUND_HEIGHT = 1000;

export function isDefaultBackground(settings: BackgroundSettings) {
  return (
    Object.keys(BACKGROUND_DEFAULTS) as (keyof BackgroundSettings)[]
  ).every((key) => settings[key] === BACKGROUND_DEFAULTS[key]);
}

// Compose continuous light and centered noise BEFORE rounding to eight bits.
// Adding grain after SVG opacity has been quantized preserves visible rings.
export function createBackgroundPixels(settings: BackgroundSettings) {
  const width = BACKGROUND_WIDTH;
  const height = BACKGROUND_HEIGHT;
  const pixels = new Uint8ClampedArray(width * height * 4);
  const radius = settings.backgroundRadius * width;
  const fade = settings.backgroundFade;
  const start = 1 - fade;
  const tailAlpha = 0.16 * 0.976;
  // Match the inner derivative at the join, and flatten smoothly at the end.
  const tailPower = (0.47232 * fade) / (start * tailAlpha);
  function glow(distance: number) {
    const t = distance / radius;
    if (t >= 1) return 0;
    if (t <= start) {
      const inner = (t / start) * 0.6;
      return (
        settings.backgroundIntensity * (1 - inner) ** 2 * (1 - 0.04 * inner)
      );
    }
    return (
      settings.backgroundIntensity * tailAlpha * ((1 - t) / fade) ** tailPower
    );
  }
  function random(seed: number) {
    let bits = Math.imul(seed ^ (seed >>> 16), 0x45d9f3b);
    bits = Math.imul(bits ^ (bits >>> 16), 0x45d9f3b);
    return ((bits ^ (bits >>> 16)) >>> 0) / 4294967295;
  }
  const baseColor = [16, 18, 17];
  const greenColor = [128, 230, 80];
  const redColor = [255, 44, 75];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = y * width + x;
      const green = glow(Math.hypot(x + 115, y - 800));
      const red = glow(Math.hypot(x - 1555, y - 800));
      const noise =
        (random(index + 11) + random(index ^ 0x9e3779b9) - 1) *
        settings.backgroundNoise *
        63.75;
      for (let channel = 0; channel < 3; channel++) {
        const base = baseColor[channel];

        const lit = base + (greenColor[channel] - base) * green;
        pixels[index * 4 + channel] = Math.round(
          lit + (redColor[channel] - lit) * red + noise,
        );
      }
      pixels[index * 4 + 3] = 255;
    }
  }
  return pixels;
}

export function createBackgroundURL(settings: BackgroundSettings) {
  if (isDefaultBackground(settings)) return BACKGROUND_URL;
  const canvas = document.createElement("canvas");
  canvas.width = BACKGROUND_WIDTH;
  canvas.height = BACKGROUND_HEIGHT;
  const context = canvas.getContext("2d");
  if (!context) return BACKGROUND_URL;
  context.putImageData(
    new ImageData(
      createBackgroundPixels(settings),
      canvas.width,
      canvas.height,
    ),
    0,
    0,
  );
  return canvas.toDataURL("image/png");
}
