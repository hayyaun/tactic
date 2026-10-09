import { BACKGROUND_DEFAULTS } from "./hero-background";

export const SCENE_FRAMING = { minHeight: 3.6, minWidth: 4.7 };

export const DEFAULT_SCENE_SETTINGS = {
  ...BACKGROUND_DEFAULTS,
  cameraX: 4,
  cameraY: 36,
  cameraZ: 55,
  targetY: 6.45,
  zoom: 1,
  tilt: 12,
  keyLight: 2,
  fillLight: 0.45,
  rimLight: 2,
  greenLight: 2.2,
  redLight: 2,
  environmentIntensity: 1,
  environmentBlur: 0.025,
  roughness: 0.045,
  transmission: 1,
  thickness: 0.45,
  ior: 1.28,
  attenuationDistance: 8,
  greenTint: "#07351b",
  redTint: "#400e18",
  contours: true,
  rimShimmer: true,
  rimShimmerInterval: 15,
  rimShimmerDuration: 10,
  rimShimmerStrength: 1.2,
  parallax: true,
  parallaxStrength: 0.08,
  rotationDamping: 2,
  hover: true,
  hoverDamping: 1.1,
  exposure: 0.9,
  dprLimit: 2,
  transmissionResolution: 1,
};

export type SceneSettings = typeof DEFAULT_SCENE_SETTINGS;
