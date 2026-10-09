import { expect, test, type Page } from "@playwright/test";

async function observeScene(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  // Count real GPU draws without relying on React internals or exposing any
  // scene state in the application itself.
  await page.addInitScript(() => {
    const probe = { draws: 0 };
    Object.assign(window, { rimProbe: probe });
    for (const method of ["drawArrays", "drawElements"] as const) {
      const original = WebGL2RenderingContext.prototype[method];
      WebGL2RenderingContext.prototype[method] = function (
        ...args: Parameters<typeof original>
      ) {
        probe.draws++;
        return Reflect.apply(original, this, args);
      };
    }
  });
  return errors;
}

function drawCount(page: Page) {
  return page.evaluate(
    () => (window as unknown as { rimProbe: { draws: number } }).rimProbe.draws,
  );
}

test("idle rim shines, pauses offscreen, and resumes on return", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const errors = await observeScene(page);
  await page.goto("/");
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "true");
  // Sample the independent glint during its ten-second pass.
  await page.waitForTimeout(1800);
  const before = await stage.screenshot();
  const initialDraws = await drawCount(page);
  await page.waitForTimeout(2500);
  const after = await stage.screenshot();
  expect(after.equals(before)).toBe(false);
  expect(await drawCount(page)).toBeGreaterThan(initialDraws);
  // The ten-second pass ends before the next fifteen-second cycle starts.
  await page.waitForTimeout(6200);
  const resting = await stage.screenshot();
  const gapDraws = await drawCount(page);
  await page.waitForTimeout(800);
  expect((await stage.screenshot()).equals(resting)).toBe(true);
  expect(await drawCount(page)).toBe(gapDraws);
  await expect.poll(() => drawCount(page)).toBeGreaterThan(gapDraws);

  await page.evaluate(() =>
    window.scrollTo({
      top:
        document.querySelector("#studio")!.getBoundingClientRect().top +
        window.scrollY,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      stage.evaluate((element) => element.getBoundingClientRect().bottom),
    )
    .toBeLessThanOrEqual(0);
  // IntersectionObserver and pending demand frames must finish before measuring.
  await page.waitForTimeout(500);
  const pausedDraws = await drawCount(page);
  await page.waitForTimeout(750);
  expect(await drawCount(page)).toBe(pausedDraws);

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await expect.poll(() => drawCount(page)).toBeGreaterThan(pausedDraws);
  expect(errors).toEqual([]);
});

test("reduced motion keeps the rim static and the renderer idle", async ({
  page,
}) => {
  const errors = await observeScene(page);
  await page.goto("/");
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "true");
  await page.waitForTimeout(1000);
  const before = await stage.screenshot();
  const initialDraws = await drawCount(page);
  await page.waitForTimeout(1200);
  const after = await stage.screenshot();
  expect(after.equals(before)).toBe(true);
  expect(await drawCount(page)).toBe(initialDraws);
  expect(errors).toEqual([]);
});

test("both rims fade to zero through the handoff", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.addInitScript(() => {
    const probe = {
      started: 0,
      samples: [] as { time: number; alpha: number }[],
    };
    Object.assign(window, { shimmerAlphaProbe: probe });
    const original = WebGL2RenderingContext.prototype.bufferSubData;
    WebGL2RenderingContext.prototype.bufferSubData = function (
      target: number,
      offset: number,
      data: AllowSharedBufferSource,
      srcOffset?: number,
      length?: number,
    ) {
      const args =
        srcOffset === undefined
          ? [target, offset, data]
          : [target, offset, data, srcOffset, length];

      // The glint's dynamic attribute is RGBA with white RGB at every vertex.
      if (
        data instanceof Float32Array &&
        data.length > 100 &&
        data.length % 4 === 0
      ) {
        let isGlint = true;
        let alpha = 0;
        for (let i = 0; i < data.length; i += 4) {
          if (data[i] !== 1 || data[i + 1] !== 1 || data[i + 2] !== 1) {
            isGlint = false;
            break;
          }
          alpha = Math.max(alpha, data[i + 3]);
        }
        if (isGlint) {
          const now = performance.now();
          probe.started ||= now;
          probe.samples.push({ time: (now - probe.started) / 1000, alpha });
        }
      }
      return Reflect.apply(original, this, args);
    };
  });
  await page.goto("/");
  await expect(page.locator("[data-hero-art]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await page.waitForTimeout(10500);
  const samples = await page.evaluate(
    () =>
      (
        window as unknown as {
          shimmerAlphaProbe: { samples: { time: number; alpha: number }[] };
        }
      ).shimmerAlphaProbe.samples,
  );
  const handoff = samples.filter(({ time }) => time > 4.3 && time < 5.7);
  expect(handoff.length).toBeGreaterThan(10);
  expect(handoff.every(({ alpha }) => alpha === 0)).toBe(true);
  expect(samples.some(({ time, alpha }) => time < 4 && alpha > 0.5)).toBe(true);
  expect(samples.some(({ time, alpha }) => time > 6 && alpha > 0.5)).toBe(true);
  expect(samples.every(({ alpha }) => alpha >= 0 && alpha <= 1)).toBe(true);
});
