import { test as base, expect } from "@playwright/test";

// Rendering tests exercise real WebGL on CPU-only runners. This changes only
// the test browser's admission probe, never the deployed performance policy.
export const test = base.extend<
  { allowSoftwareRenderer: boolean },
  { sceneBrowserGroup: string }
>({
  // Different worker options force a fresh browser between rendering suites.
  sceneBrowserGroup: ["scene", { scope: "worker", option: true }],
  allowSoftwareRenderer: [true, { option: true }],
  page: async ({ page, allowSoftwareRenderer }, runFixture) => {
    // Scene checks are independent of the analytics provider's network service.
    await page.route("https://www.clarity.ms/tag/**", (route) =>
      route.fulfill({ contentType: "application/javascript", body: "" }),
    );
    if (allowSoftwareRenderer) {
      await page.addInitScript(() => {
        const getContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = function (
          this: HTMLCanvasElement,
          ...args: Parameters<typeof getContext>
        ) {
          const attributes = args[1] as WebGLContextAttributes | undefined;
          if (
            args[0] === "webgl2" &&
            attributes?.failIfMajorPerformanceCaveat
          ) {
            return Reflect.apply(getContext, this, [
              args[0],
              {
                ...attributes,
                failIfMajorPerformanceCaveat: false,
              },
            ]);
          }
          return Reflect.apply(getContext, this, args);
        } as typeof getContext;
        const getParameter = WebGL2RenderingContext.prototype.getParameter;
        WebGL2RenderingContext.prototype.getParameter = function (
          name: number,
        ) {
          const value = getParameter.call(this, name);
          if (
            name === 0x9246 &&
            /swiftshader|llvmpipe|softpipe|software rasterizer|lavapipe/i.test(
              String(value),
            )
          ) {
            return "TACTIC rendering test adapter";
          }
          return value;
        };
      });
    }
    await runFixture(page);
  },
});

export { expect };
