"use client";

import { LevaPanel, folder, monitor, useControls, useCreateStore } from "leva";
import { useEffect, useState } from "react";
import {
  RENDER_QUALITIES,
  type RenderQuality,
  type SceneTelemetry,
} from "./hero-performance";
import { createPortal } from "react-dom";
import {
  DEFAULT_SCENE_SETTINGS as defaults,
  type SceneSettings,
} from "./hero-settings";

export default function HeroDebug({
  onChange,
  telemetry,
  quality,
  onQualityChange,
}: {
  onChange: (settings: SceneSettings) => void;
  telemetry: SceneTelemetry;
  quality: RenderQuality;
  onQualityChange: (quality: RenderQuality) => void;
}) {
  const store = useCreateStore();
  const [copyStatus, setCopyStatus] = useState("");
  const [settings, set] = useControls(
    () => ({
      Camera: folder(
        {
          cameraX: {
            label: "Camera X",
            value: defaults.cameraX,
            min: -20,
            max: 30,
            step: 0.1,
          },
          cameraY: {
            label: "Camera Y",
            value: defaults.cameraY,
            min: 10,
            max: 60,
            step: 0.1,
          },
          cameraZ: {
            label: "Camera Z",
            value: defaults.cameraZ,
            min: 10,
            max: 80,
            step: 0.1,
          },
          targetY: {
            label: "Look-at Y",
            value: defaults.targetY,
            min: 0,
            max: 15,
            step: 0.05,
          },
          zoom: {
            label: "Zoom",
            value: defaults.zoom,
            min: 0.5,
            max: 2,
            step: 0.01,
          },
          tilt: {
            label: "Tilt (degrees)",
            value: defaults.tilt,
            min: -20,
            max: 30,
            step: 0.5,
          },
        },
        { collapsed: true },
      ),
      Lighting: folder(
        {
          keyLight: {
            label: "Key",
            value: defaults.keyLight,
            min: 0,
            max: 6,
            step: 0.05,
          },
          fillLight: {
            label: "Fill",
            value: defaults.fillLight,
            min: 0,
            max: 3,
            step: 0.05,
          },
          rimLight: {
            label: "Rim",
            value: defaults.rimLight,
            min: 0,
            max: 6,
            step: 0.05,
          },
          greenLight: {
            label: "Green",
            value: defaults.greenLight,
            min: 0,
            max: 6,
            step: 0.05,
          },
          redLight: {
            label: "Red",
            value: defaults.redLight,
            min: 0,
            max: 6,
            step: 0.05,
          },
          environmentIntensity: {
            label: "Environment",
            value: defaults.environmentIntensity,
            min: 0,
            max: 3,
            step: 0.05,
          },
          environmentBlur: {
            label: "Probe blur",
            value: defaults.environmentBlur,
            min: 0,
            max: 0.1,
            step: 0.001,
          },
        },
        { collapsed: true },
      ),
      Glass: folder(
        {
          roughness: {
            label: "Roughness",
            value: defaults.roughness,
            min: 0,
            max: 0.5,
            step: 0.005,
          },
          transmission: {
            label: "Transmission",
            value: defaults.transmission,
            min: 0,
            max: 1,
            step: 0.01,
          },
          thickness: {
            label: "Thickness",
            value: defaults.thickness,
            min: 0.01,
            max: 2,
            step: 0.01,
          },
          ior: {
            label: "IOR",
            value: defaults.ior,
            min: 1,
            max: 2.33,
            step: 0.01,
          },
          attenuationDistance: {
            label: "Attenuation distance",
            value: defaults.attenuationDistance,
            min: 0.1,
            max: 30,
            step: 0.1,
          },
          greenTint: { label: "Green hover tint", value: defaults.greenTint },
          redTint: { label: "Red hover tint", value: defaults.redTint },
          contours: { label: "Contours", value: defaults.contours },
        },
        { collapsed: true },
      ),
      Rim: folder(
        {
          rimShimmer: { label: "Shimmer", value: defaults.rimShimmer },
          rimShimmerInterval: {
            label: "Repeat every (s)",
            value: defaults.rimShimmerInterval,
            min: 4,
            max: 20,
            step: 0.5,
          },
          rimShimmerDuration: {
            label: "Sweep duration (s)",
            value: defaults.rimShimmerDuration,
            min: 1,
            max: 15,
            step: 0.25,
          },
          rimShimmerStrength: {
            label: "Shimmer strength",
            value: defaults.rimShimmerStrength,
            min: 0,
            max: 3,
            step: 0.05,
          },
        },
        { collapsed: true },
      ),
      Interaction: folder(
        {
          parallax: { label: "Pointer rotation", value: defaults.parallax },
          parallaxStrength: {
            label: "Rotation range",
            value: defaults.parallaxStrength,
            min: 0,
            max: 0.4,
            step: 0.005,
          },
          rotationDamping: {
            label: "Rotation damping",
            value: defaults.rotationDamping,
            min: 0.1,
            max: 8,
            step: 0.1,
          },
          hover: { label: "Hover tint", value: defaults.hover },
          hoverDamping: {
            label: "Tint damping",
            value: defaults.hoverDamping,
            min: 0.1,
            max: 8,
            step: 0.1,
          },
        },
        { collapsed: true },
      ),
      Background: folder(
        {
          backgroundNoise: {
            label: "Grain",
            value: defaults.backgroundNoise,
            min: 0,
            max: 0.25,
            step: 0.005,
          },
          backgroundSmoothing: {
            label: "Gradient blur",
            value: defaults.backgroundSmoothing,
            min: 0,
            max: 40,
            step: 0.5,
          },
          backgroundRadius: {
            label: "Glow radius",
            value: defaults.backgroundRadius,
            min: 0.5,
            max: 1.6,
            step: 0.025,
          },
          backgroundFade: {
            label: "Outer fade",
            value: defaults.backgroundFade,
            min: 0.3,
            max: 0.85,
            step: 0.025,
          },
          backgroundIntensity: {
            label: "Intensity",
            value: defaults.backgroundIntensity,
            min: 0,
            max: 0.6,
            step: 0.01,
          },
        },
        { collapsed: true },
      ),
      Quality: folder(
        {
          exposure: {
            label: "Exposure",
            value: defaults.exposure,
            min: 0.2,
            max: 2,
            step: 0.01,
          },
          dprLimit: {
            label: "DPR limit",
            value: defaults.dprLimit,
            min: 1,
            max: 2,
            step: 0.25,
          },
          transmissionResolution: {
            label: "Refraction resolution",
            value: defaults.transmissionResolution,
            min: 0.25,
            max: 1,
            step: 0.25,
          },
        },
        { collapsed: true },
      ),
    }),
    { store },
  );
  const [performanceSettings, setPerformance] = useControls(
    () => ({
      Performance: folder(
        {
          autoQuality: { label: "Auto quality", value: defaults.autoQuality },
          fpsThreshold: {
            label: "Minimum FPS",
            value: defaults.fpsThreshold,
            min: 5,
            max: 120,
            step: 1,
          },
          fpsDuration: {
            label: "Slow time (s)",
            value: defaults.fpsDuration,
            min: 1,
            max: 30,
            step: 0.5,
          },
          FPS: monitor(() => telemetry.getFPS(), {
            graph: false,
            interval: 1000,
          }),
          renderQuality: {
            label: "Preset",
            transient: false,
            value: quality,
            options: [...Object.keys(RENDER_QUALITIES), "Preview"],
            onChange: (quality: RenderQuality, _path, context) => {
              if (!context.initial) {
                if (quality !== "Preview") set(RENDER_QUALITIES[quality]);
                onQualityChange(quality);
              }
            },
          },
        },
        { collapsed: false, order: -1 },
      ),
    }),
    { store },
  );
  useEffect(() => {
    setPerformance({ renderQuality: quality });
    if (quality !== "Preview") set(RENDER_QUALITIES[quality]);
  }, [quality, set, setPerformance]);
  useEffect(() => {
    onChange({
      ...settings,
      autoQuality: performanceSettings.autoQuality,
      fpsThreshold: performanceSettings.fpsThreshold,
      fpsDuration: performanceSettings.fpsDuration,
    });
  }, [
    settings,
    performanceSettings.autoQuality,
    performanceSettings.fpsThreshold,
    performanceSettings.fpsDuration,
    onChange,
  ]);
  useEffect(
    () => () => {
      onChange(defaults);
      onQualityChange("High");
    },
    [onChange, onQualityChange],
  );
  return createPortal(
    <aside
      aria-label="Scene debug controls"
      className="fixed top-3 right-3 z-50 max-h-[calc(100dvh-1.5rem)] w-72 max-w-[calc(100vw-1.5rem)] overflow-y-auto"
    >
      <LevaPanel
        store={store}
        fill
        titleBar={{ title: "TACTIC scene", drag: false }}
      />
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(
              JSON.stringify(
                {
                  ...settings,
                  autoQuality: performanceSettings.autoQuality,
                  fpsThreshold: performanceSettings.fpsThreshold,
                  fpsDuration: performanceSettings.fpsDuration,
                },
                null,
                2,
              ),
            );
            setCopyStatus("Settings copied.");
          } catch {
            setCopyStatus(
              "Could not copy settings. Please allow clipboard access and try again.",
            );
          }
        }}
        className="mt-2 w-full rounded-lg bg-sage px-4 py-2 text-sm text-carbon hover:bg-sage/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage"
      >
        Copy settings
      </button>
      <p role="status" className="px-1 text-sm text-foreground">
        {copyStatus}
      </p>
      <button
        type="button"
        onClick={() => {
          if (
            window.confirm("Reset all scene settings to the demo defaults?")
          ) {
            setPerformance({
              renderQuality: "High",
              autoQuality: defaults.autoQuality,
              fpsThreshold: defaults.fpsThreshold,
              fpsDuration: defaults.fpsDuration,
            });
            const sceneDefaults = { ...defaults };
            const sceneValues = Object.fromEntries(
              Object.keys(settings).map((key) => [
                key,
                sceneDefaults[key as keyof SceneSettings],
              ]),
            );
            set(sceneValues);
            setCopyStatus("");
          }
        }}
        className="mt-2 w-full rounded-lg bg-foreground px-4 py-2 text-sm text-background hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        Reset to demo
      </button>
    </aside>,
    document.body,
  );
}
