export const BACKGROUND_DEFAULTS = {
  backgroundNoise: 0.08,
  backgroundRadius: 0.725,
  backgroundFade: 0.6,
  backgroundIntensity: 0.6,
};
export type BackgroundSettings = typeof BACKGROUND_DEFAULTS;
export const BACKGROUND_URL = "/studio/hero-background.svg";
const WIDTH = 1440;
const HEIGHT = 1000;

function isDefaultBackground(settings: BackgroundSettings) {
  return (
    Object.keys(BACKGROUND_DEFAULTS) as (keyof BackgroundSettings)[]
  ).every((key) => settings[key] === BACKGROUND_DEFAULTS[key]);
}

// Keep the background as vector gradients with plain SVG grain. No pixel buffer,
// displacement filter, or raster image encoding is needed for debug edits.
export function createBackgroundSVG(settings: BackgroundSettings) {
  const start = 1 - settings.backgroundFade;
  const tailAlpha = 0.16 * 0.976;
  const tailPower = (0.47232 * settings.backgroundFade) / (start * tailAlpha);
  const base = [16, 18, 17];
  const stops = (color: number[], blend: "base" | "screen") =>
    [
      0,
      start / 4,
      start / 2,
      (start * 3) / 4,
      start,
      start + settings.backgroundFade / 4,
      start + settings.backgroundFade / 2,
      start + (settings.backgroundFade * 3) / 4,
      1,
    ]
      .map((t) => {
        const inner = (t / start) * 0.6;
        const alpha =
          settings.backgroundIntensity *
          (t <= start
            ? (1 - inner) ** 2 * (1 - 0.04 * inner)
            : tailAlpha * ((1 - t) / settings.backgroundFade) ** tailPower);
        // Opaque RGB interpolation avoids quantizing a low-opacity gradient first.
        // Screen contributions fade to black and preserve the base at the edges.
        const rgb = color.map((channel, i) =>
          blend === "base"
            ? base[i] + alpha * (channel - base[i])
            : (255 * alpha * (channel - base[i])) / (255 - base[i]),
        );
        return `<stop offset="${t}" stop-color="rgb(${rgb.map((channel) => channel.toFixed(5)).join(" ")})"/>`;
      })
      .join("");
  const noise = settings.backgroundNoise;
  // Extend paint coverage beyond the grain filter edges.
  const padding = 120;
  const backgroundPath = `M${-padding} ${-padding}h${WIDTH + padding * 2}v${HEIGHT + padding * 2}H${-padding}z`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" preserveAspectRatio="none">
  <defs>
    <radialGradient id="green" gradientUnits="userSpaceOnUse" cx="-115" cy="800" r="${settings.backgroundRadius * WIDTH}" >${stops([128, 230, 80], "base")}</radialGradient>
    <radialGradient id="red" gradientUnits="userSpaceOnUse" cx="1555" cy="800" r="${settings.backgroundRadius * WIDTH}" >${stops([255, 44, 75], "screen")}</radialGradient>
    <filter id="grain" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="1" seed="11" result="noise"/>
      <feColorMatrix in="noise" type="matrix" values="0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0.2126 0.7152 0.0722 0 0 0 0 0 0 1" result="grayNoise"/>
      <feComposite in="SourceGraphic" in2="grayNoise" operator="arithmetic" k2="1" k3="${noise}" k4="${-noise / 2}" result="grainComposite"/>
      <feGaussianBlur in="grainComposite" stdDeviation="0.5" edgeMode="duplicate"/>
    </filter>
  </defs>
  <g filter="url(#grain)" style="isolation:isolate">
    <path fill="#101211" d="${backgroundPath}"/>
    <path fill="url(#green)" d="${backgroundPath}"/>
    <path style="mix-blend-mode:screen" fill="url(#red)" d="${backgroundPath}"/>
  </g>
</svg>`;
}

export function createBackgroundURL(settings: BackgroundSettings) {
  if (isDefaultBackground(settings)) return BACKGROUND_URL;
  return `data:image/svg+xml,${encodeURIComponent(createBackgroundSVG(settings))}`;
}
