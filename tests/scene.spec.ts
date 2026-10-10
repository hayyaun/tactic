import { expect, test } from "@playwright/test";
import { adaptBoxProjectedShader } from "../app/components/box-projected-shader";

test("shader adapter reports changed dependency anchors", () => {
  expect(() =>
    adaptBoxProjectedShader({
      vertexShader: "changed shader",
      fragmentShader: "",
    }),
  ).toThrow(/Box-projected shader is incompatible: missing/);
});

test("loading preview stays visible until the model is available", async ({
  page,
}) => {
  let release!: () => void;
  const held = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/tactic-mark.glb", async (route) => {
    await held;
    await route.continue();
  });
  await page.goto("/", { waitUntil: "domcontentloaded" });
  const stage = page.locator("[data-hero-art]");
  await expect(stage.locator("canvas")).toHaveCount(1);
  await expect(stage).toHaveAttribute("data-ready", "false");
  release();
  await expect(stage).toHaveAttribute("data-ready", "true");
});

for (const offscreen of [false, true]) {
  test(`WebGL restores its scene ${offscreen ? "after being offscreen" : "while idle"}`, async ({
    page,
  }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    // Observe real driver compilation and draw calls, including programs rebuilt
    // after context restoration, without adding a production debugging API.
    await page.addInitScript(() => {
      const probe = { draws: 0, failures: [] as string[] };
      Object.assign(window, { sceneProbe: probe });
      for (const method of ["drawArrays", "drawElements"] as const) {
        const original = WebGL2RenderingContext.prototype[method];
        WebGL2RenderingContext.prototype[method] = function (
          ...args: Parameters<typeof original>
        ) {
          probe.draws++;
          return Reflect.apply(original, this, args);
        };
      }
      const original = WebGL2RenderingContext.prototype.linkProgram;
      WebGL2RenderingContext.prototype.linkProgram = function (program) {
        original.call(this, program);
        if (!this.getProgramParameter(program, this.LINK_STATUS))
          probe.failures.push(
            this.getProgramInfoLog(program) ?? "Shader link failed",
          );
      };
    });
    await page.goto("/");
    const stage = page.locator("[data-hero-art]");
    await expect(stage).toHaveAttribute("data-ready", "true");
    const before = await stage.screenshot();
    if (offscreen) {
      await page.locator("#studio").scrollIntoViewIfNeeded();
      await page.waitForTimeout(300);
    }
    await stage.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
      const extension = canvas
        .getContext("webgl2")!
        .getExtension("WEBGL_lose_context")!;
      Object.assign(window, { restoreScene: () => extension.restoreContext() });
      extension.loseContext();
    });
    await expect(stage).toHaveAttribute("data-ready", "false");
    const draws = await page.evaluate(
      () =>
        (window as unknown as { sceneProbe: { draws: number } }).sceneProbe
          .draws,
    );
    await page.evaluate(() =>
      (window as unknown as { restoreScene: () => void }).restoreScene(),
    );
    if (offscreen) {
      await page.waitForTimeout(300);
      await expect(stage).toHaveAttribute("data-ready", "false");
      await page.evaluate(() => scrollTo(0, 0));
    }
    await expect(stage).toHaveAttribute("data-ready", "true");
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { sceneProbe: { draws: number } }).sceneProbe
            .draws,
      ),
    ).toBeGreaterThan(draws);
    const after = await stage.screenshot();
    // Stable reduced-motion frames must retain the exact projected appearance.
    expect(after.equals(before)).toBe(true);
    expect(
      await page.evaluate(
        () =>
          (window as unknown as { sceneProbe: { failures: string[] } })
            .sceneProbe.failures,
      ),
    ).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("unsupported WebGL keeps the preview", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        ...args: Parameters<typeof original>
      ) {
        if (String(args[0]).startsWith("webgl")) return null;
        return Reflect.apply(original, this, args);
      },
    });
  });
  await page.goto("/");
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "false");
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(stage.locator("img").first()).toBeVisible();
});

test("software WebGL keeps the preview without downloading the 3D scene", async ({
  page,
}) => {
  const errors: string[] = [];
  const sceneAssets: string[] = [];
  const sceneBundles: string[] = [];
  const inspectedBundles: Promise<void>[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("request", (request) => {
    if (/tactic-mark\.glb|studio-environment-r186\.bin\.gz/.test(request.url()))
      sceneAssets.push(request.url());
  });
  page.on("response", (response) => {
    if (!/\/_next\/static\/chunks\/.*\.js(?:\?|$)/.test(response.url())) return;
    inspectedBundles.push(
      response.text().then((source) => {
        // Use an existing scene shader marker rather than a build-specific hash.
        if (source.includes("transmission-r186-safe-rays"))
          sceneBundles.push(response.url());
      }),
    );
  });
  await page.addInitScript(() => {
    const getExtension = WebGL2RenderingContext.prototype.getExtension;
    Object.defineProperty(WebGL2RenderingContext.prototype, "getExtension", {
      value: function (this: WebGL2RenderingContext, name: string) {
        if (name === "WEBGL_debug_renderer_info")
          return {
            UNMASKED_VENDOR_WEBGL: 0x9245,
            UNMASKED_RENDERER_WEBGL: 0x9246,
          };
        return Reflect.apply(getExtension, this, [name]);
      },
    });
    const getParameter = WebGL2RenderingContext.prototype.getParameter;
    WebGL2RenderingContext.prototype.getParameter = function (name: number) {
      if (name === 0x9246)
        return "ANGLE (Google, SwiftShader Device (Subzero), SwiftShader driver)";
      return getParameter.call(this, name);
    };
  });
  await page.goto("/", { waitUntil: "networkidle" });
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "false");
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(stage.locator("img").first()).toBeVisible();
  await Promise.all(inspectedBundles);
  expect(sceneAssets).toEqual([]);
  expect(sceneBundles).toEqual([]);
  expect(errors).toEqual([]);
});

test("a major WebGL performance caveat keeps the preview", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.addInitScript(() => {
    const probe = { refused: 0 };
    Object.assign(window, { caveatProbe: probe });
    const original = HTMLCanvasElement.prototype.getContext;
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      value: function (
        this: HTMLCanvasElement,
        ...args: Parameters<typeof original>
      ) {
        const options = args[1] as WebGLContextAttributes | undefined;
        if (args[0] === "webgl2" && options?.failIfMajorPerformanceCaveat) {
          probe.refused++;
          return null;
        }
        return Reflect.apply(original, this, args);
      },
    });
  });
  await page.goto("/", { waitUntil: "networkidle" });
  const stage = page.locator("[data-hero-art]");
  await expect(stage).toHaveAttribute("data-ready", "false");
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(stage.locator("img").first()).toBeVisible();
  expect(
    await page.evaluate(
      () =>
        (window as unknown as { caveatProbe: { refused: number } }).caveatProbe
          .refused,
    ),
  ).toBeGreaterThan(0);
  expect(errors).toEqual([]);
});

test("an unavailable studio environment keeps the preview", async ({
  page,
}) => {
  const fallback = page.waitForEvent("console", {
    predicate: (message) =>
      message.text().includes("TACTIC 3D scene unavailable"),
  });
  await page.route("**/studio-environment-r186.bin.gz", (route) =>
    route.fulfill({ status: 503, body: "Environment temporarily unavailable" }),
  );
  await page.goto("/");
  await fallback;
  const stage = page.locator("[data-hero-art]");
  await expect(stage.locator("canvas")).toHaveCount(0);
  await expect(stage).toHaveAttribute("data-ready", "false");
  await expect(stage.locator("img").first()).toBeVisible();
});

test("one loaded backdrop covers the entire hero on mobile and desktop", async ({
  page,
}) => {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 390, height: 844 },
    { width: 390, height: 667 },
  ]) {
    await page.setViewportSize(viewport);
    await page.goto("/");
    const stage = page.locator("[data-hero-art]");
    await expect(stage).toHaveAttribute("data-ready", "true");
    const hero = await page.locator("section.hero-atmosphere").boundingBox();
    const canvas = await stage.locator("canvas").boundingBox();
    expect(hero).not.toBeNull();
    expect(canvas).not.toBeNull();
    for (const key of ["x", "y", "width", "height"] as const)
      expect(Math.abs(canvas![key] - hero![key])).toBeLessThan(1);
  }
});
