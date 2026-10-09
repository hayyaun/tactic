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
