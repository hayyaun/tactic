import { runInNewContext } from "node:vm";
import { expect, test } from "@playwright/test";
import {
  createSceneTelemetry,
  lowerRenderQuality,
  type SceneTelemetry,
} from "../app/components/hero-performance";

type Sample = { fps: number; elapsed: number; continuous: boolean };

function telemetryHarness() {
  let now = 1000;
  let tick: (() => void) | undefined;
  const samples: Sample[] = [];
  // Execute the real telemetry function with isolated browser timers. No GPU
  // or wall-clock speed determines the frames supplied to these policy checks.
  const telemetry = runInNewContext(`(${createSceneTelemetry.toString()})()`, {
    performance: { now: () => now },
    window: {
      setInterval(callback: () => void) {
        tick = callback;
        return 1;
      },
      clearInterval() {
        tick = undefined;
      },
    },
  }) as SceneTelemetry;
  return {
    telemetry,
    samples,
    start: () =>
      telemetry.start((fps, elapsed, continuous) =>
        samples.push({ fps, elapsed, continuous }),
      ),
    at(time: number) {
      now = time;
    },
    frame(time: number) {
      now = time;
      telemetry.recordFrame();
    },
    sample(time: number) {
      now = time;
      tick?.();
    },
    hasTimer: () => tick !== undefined,
  };
}

test("render quality descends through each preset and stays at Preview", () => {
  expect(lowerRenderQuality("High")).toBe("Balanced");
  expect(lowerRenderQuality("Balanced")).toBe("Low");
  expect(lowerRenderQuality("Low")).toBe("Preview");
  expect(lowerRenderQuality("Preview")).toBe("Preview");
});

test("telemetry measures consecutive slow frames and resets after idle", () => {
  const probe = telemetryHarness();
  probe.start();
  for (let time = 1010; time < 2000; time += 50) probe.frame(time);
  probe.sample(2000);
  expect(probe.samples).toEqual([{ fps: 20, elapsed: 1000, continuous: true }]);
  expect(probe.telemetry.getFPS()).toBe(20);
  probe.sample(3000);
  expect(probe.samples[1]).toEqual({
    fps: 0,
    elapsed: 1000,
    continuous: false,
  });
  expect(probe.telemetry.getFPS()).toBe(0);
});

test("telemetry treats an active sweep below four FPS as continuous", () => {
  const probe = telemetryHarness();
  probe.start();
  probe.at(1100);
  probe.telemetry.setAnimating(true);
  probe.frame(1100);
  probe.frame(1700);
  probe.sample(2000);
  probe.sample(3000);
  expect(probe.samples).toEqual([
    { fps: 2, elapsed: 1000, continuous: true },
    { fps: 0, elapsed: 1000, continuous: true },
  ]);
  probe.at(3100);
  probe.telemetry.setAnimating(false);
  probe.sample(4000);
  expect(probe.samples[2]).toEqual({
    fps: 0,
    elapsed: 1000,
    continuous: false,
  });
});

test("isolated demand frames and interrupted bursts are not sustained work", () => {
  const probe = telemetryHarness();
  probe.start();
  probe.frame(1050);
  probe.sample(2000);
  probe.frame(2050);
  probe.frame(2600);
  probe.frame(2950);
  probe.sample(3000);
  expect(probe.samples).toEqual([
    { fps: 1, elapsed: 1000, continuous: false },
    { fps: 3, elapsed: 1000, continuous: false },
  ]);
});

test("stopping telemetry clears FPS and ignores frames until restarted", () => {
  const probe = telemetryHarness();
  const stop = probe.start();
  probe.frame(1050);
  probe.frame(1900);
  probe.sample(2000);
  expect(probe.telemetry.getFPS()).toBe(2);
  stop();
  expect(probe.hasTimer()).toBe(false);
  expect(probe.telemetry.getFPS()).toBe(0);
  probe.frame(2500);
  probe.sample(3000);
  expect(probe.samples).toHaveLength(1);
  probe.start();
  probe.frame(3500);
  probe.sample(4000);
  expect(probe.samples[1]).toEqual({
    fps: 1,
    elapsed: 1000,
    continuous: false,
  });
});
