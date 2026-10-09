import { expect, test } from "@playwright/test";
import { studies } from "../app/studies";

test("study triggers preserve their identity and opener without moving focus", async ({
  page,
}) => {
  await page.goto("/");
  for (const [id, study] of Object.entries(studies)) {
    const trigger = page.locator(`button[data-study="${id}"]`);
    await trigger.evaluate((button) =>
      button.addEventListener("mousedown", (event) => event.preventDefault()),
    );
    await trigger.click();
    await expect(page.locator("#study-dialog")).toBeVisible();
    await expect(page.locator("#study-dialog-title")).toHaveText(study.title);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
    await trigger.press("Enter");
    await expect(page.locator("#study-dialog-title")).toHaveText(study.title);
    await page.keyboard.press("Escape");
    await expect(trigger).toBeFocused();
  }
});

test("Escape returns mobile navigation focus to its toggle", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("#navigation-toggle");
  await toggle.click();
  await page.locator("#mobile-menu a").first().focus();
  await page.keyboard.press("Escape");
  await expect(toggle).toHaveAttribute("aria-expanded", "false");
  await expect(toggle).toBeFocused();
  await expect(page.locator("#mobile-menu")).toBeHidden();
});

test("debug controls are opt-in and layouts fit mobile and desktop", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
    { width: 320, height: 640 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    await expect(
      page.getByRole("complementary", { name: "Scene debug controls" }),
    ).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.goto("/?debug");
    await expect(
      page.getByRole("complementary", { name: "Scene debug controls" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Reset to demo" }).click();
  }
});

test("debug settings copy current values and reset requires confirmation", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?debug");
  await page.getByText("Quality", { exact: true }).click();
  const exposure = page.locator('input[id="Quality.exposure"]');
  await exposure.fill("1.25");
  await exposure.press("Enter");
  await page.getByRole("button", { name: "Copy settings" }).click();
  await expect(page.getByRole("status")).toHaveText("Settings copied.");
  const copied = JSON.parse(
    await page.evaluate(() => navigator.clipboard.readText()),
  );
  expect(copied.exposure).toBe(1.25);
  expect(copied.rimShimmerDuration).toBe(10);
  expect(copied.greenTint).toBe("#07351b");
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    await dialog.dismiss();
  });
  await page.getByRole("button", { name: "Reset to demo" }).click();
  await expect(exposure).toHaveValue("1.25");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset to demo" }).click();
  await expect(exposure).toHaveValue("0.90");
});

test("production loads debug modules only with the debug query", async ({
  page,
}) => {
  const scripts: Promise<string>[] = [];
  page.on("response", (response) => {
    if (
      response.url().includes("/_next/static/") &&
      response.url().endsWith(".js")
    ) {
      scripts.push(response.text());
    }
  });
  await page.goto("/");
  await expect(page.locator("[data-hero-art]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const ordinary = (await Promise.all(scripts)).join("\n");
  expect(ordinary).not.toContain("Settings copied.");
  expect(ordinary).not.toContain("leva__");
  scripts.length = 0;
  await page.goto("/?debug");
  await expect(
    page.getByRole("button", { name: "Copy settings" }),
  ).toBeVisible();
  const debug = (await Promise.all(scripts)).join("\n");
  expect(debug).toContain("Settings copied.");
  expect(debug).toContain("leva__");
});

test("background controls update, copy, and restore the shared backdrop", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const asset = await page.request.get("/studio/hero-background.svg");
  expect(asset.ok()).toBe(true);
  const svg = await asset.text();
  expect(Buffer.byteLength(svg)).toBeLessThan(20_000);
  expect(svg).toContain("<radialGradient");
  expect(svg).toContain("<feTurbulence");
  expect(svg).not.toContain("stop-opacity");
  expect(svg).toMatch(/mix-blend-mode:\s*screen/);
  expect(svg).toContain('stdDeviation="12"');
  expect(svg.match(/<stop\s/g)).toHaveLength(18);
  expect(svg).not.toMatch(
    /<image|feDisplacementMap|data:image\/(png|webp|jpeg)/,
  );
  expect((await page.request.get("/studio/hero-background.png")).status()).toBe(
    404,
  );
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/?debug");
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "true");
  const backdropScreenshot = () =>
    page.screenshot({
      clip: { x: 16, y: 650, width: 48, height: 48 },
    });
  const originalBackdrop = await backdropScreenshot();
  await page.getByText("Background", { exact: true }).click();
  const noise = page.locator('input[id="Background.backgroundNoise"]');
  await noise.fill("0.05");
  await noise.press("Enter");
  const smoothing = page.locator('input[id="Background.backgroundSmoothing"]');
  await smoothing.fill("0.8");
  await smoothing.press("Enter");
  const radius = page.locator('input[id="Background.backgroundRadius"]');
  await radius.fill("1.2");
  await radius.press("Enter");
  const fade = page.locator('input[id="Background.backgroundFade"]');
  await fade.fill("0.75");
  await fade.press("Enter");
  const background = () =>
    page
      .locator("section.hero-atmosphere")
      .evaluate((element) => (element as HTMLElement).style.backgroundImage);
  await expect.poll(background).toContain("data:image/svg+xml");
  await expect(stage).toHaveAttribute("data-ready", "true");
  await page.getByRole("button", { name: "Copy settings" }).click();
  await expect(page.getByRole("status")).toHaveText("Settings copied.");
  const copied = JSON.parse(
    await page.evaluate(() => navigator.clipboard.readText()),
  );
  expect(copied.backgroundNoise).toBe(0.05);
  expect(copied.backgroundSmoothing).toBe(0.8);
  expect(copied.backgroundRadius).toBe(1.2);
  expect(copied.backgroundFade).toBe(0.75);
  expect(copied.backgroundIntensity).toBe(0.32);
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset to demo" }).click();
  await expect.poll(background).toContain("/studio/hero-background.svg");
  await expect(stage).toHaveAttribute("data-ready", "true");
  await expect
    .poll(async () => (await backdropScreenshot()).equals(originalBackdrop))
    .toBe(true);
  expect(errors).toEqual([]);
});

test("performance presets apply rendering settings and reset restores High", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?debug");
  const preset = page.locator('select[id="Performance.renderQuality"]');
  await expect(preset).toBeVisible();
  expect(
    await page.locator('input[id="Quality.exposure"]').evaluate((element) => {
      for (
        let parent = element.parentElement;
        parent;
        parent = parent.parentElement
      ) {
        if (
          getComputedStyle(parent).overflow === "hidden" &&
          parent.getBoundingClientRect().height === 0
        )
          return true;
      }
      return false;
    }),
  ).toBe(true);
  await expect(preset.locator("option")).toHaveText([
    "Low",
    "Balanced",
    "High",
    "Preview",
  ]);
  for (const [quality, dprLimit, transmissionResolution] of [
    ["Low", 1, 0.25],
    ["Balanced", 1.5, 0.5],
    ["High", 2, 1],
  ] as const) {
    await preset.selectOption(quality);
    await page.getByRole("button", { name: "Copy settings" }).click();
    const settings = JSON.parse(
      await page.evaluate(() => navigator.clipboard.readText()),
    );
    expect(settings.dprLimit).toBe(dprLimit);
    expect(settings.transmissionResolution).toBe(transmissionResolution);
    expect(settings).not.toHaveProperty("FPS");
    expect(settings).not.toHaveProperty("renderQuality");
  }
  await expect(page.locator("[data-hero-art]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  await expect(page.getByText("FPS", { exact: true })).toBeVisible();
  await preset.selectOption("Low");
  page.once("dialog", (dialog) => dialog.accept());
  await page.getByRole("button", { name: "Reset to demo" }).click();
  await expect(preset.locator("option:checked")).toHaveText("High");
});

test("debug FPS reflects rendering and returns to zero offscreen", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/?debug");
  await expect(page.locator("[data-hero-art]")).toHaveAttribute(
    "data-ready",
    "true",
  );
  const fpsRow = page
    .getByText("FPS", { exact: true })
    .locator("..")
    .locator("..");
  const fps = async () =>
    Number((await fpsRow.textContent())?.replace("FPS", ""));
  await expect.poll(fps).toBeGreaterThan(0);
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect.poll(fps).toBe(0);
});

test("Preview releases the canvas and a render preset restores it", async ({
  page,
}) => {
  await page.goto("/?debug");
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "true");
  const preset = page.getByLabel("Preset", { exact: true });
  await preset.selectOption({ label: "Preview" });
  await expect(stage).toHaveAttribute("data-render-quality", "Preview");
  await expect(stage).toHaveAttribute("data-ready", "false");
  await expect(stage.locator("canvas")).toHaveCount(0);
  await preset.selectOption({ label: "Balanced" });
  await expect(stage).toHaveAttribute("data-ready", "true");
  await expect(stage.locator("canvas")).toHaveCount(1);
});

test("sustained slow frames lower quality and idle does not", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/?debug");
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "true");
  const threshold = page.getByLabel("Minimum FPS", { exact: true });
  await threshold.fill("120");
  await threshold.press("Enter");
  const duration = page.getByLabel("Slow time (s)", { exact: true });
  await duration.fill("1");
  await duration.press("Enter");
  await page.waitForTimeout(2200);
  await expect(stage).toHaveAttribute("data-render-quality", "High");
  await page.getByRole("button", { name: "Copy settings" }).click();
  const settings = JSON.parse(
    await page.evaluate(() => navigator.clipboard.readText()),
  );
  expect(settings.autoQuality).toBe(true);
  expect(settings.fpsThreshold).toBe(120);
  expect(settings.fpsDuration).toBe(1);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(stage).toHaveAttribute("data-render-quality", "Balanced");
  await page.getByLabel("Auto quality", { exact: true }).uncheck();
  await page.waitForTimeout(2200);
  await expect(stage).toHaveAttribute("data-render-quality", "Balanced");
  await page.getByLabel("Auto quality", { exact: true }).check();
  await expect(stage).toHaveAttribute("data-render-quality", "Preview");
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(
    page.getByLabel("Preset", { exact: true }).locator("option:checked"),
  ).toHaveText("Preview");
});
