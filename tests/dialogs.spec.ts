import { expect, test } from "@playwright/test";

test("a mobile contact enquiry closes its menu and restores focus to the navigation toggle", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const toggle = page.locator("#navigation-toggle");
  await toggle.click();
  await page
    .locator("#mobile-menu")
    .getByRole("button", { name: "Let’s talk" })
    .click();
  await expect(page.locator("#mobile-menu")).toBeHidden();
  await expect(page.locator("#contact-dialog")).toBeVisible();
  await expect(page.locator("body")).toHaveClass(/modal-open/);
  await page.getByRole("button", { name: "Close project enquiry" }).click();
  await expect(page.locator("#contact-dialog")).toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/modal-open/);
  await expect(toggle).toBeFocused();
});

test("preparing a brief prevents repeat submissions and clipboard failure selects the preview", async ({
  page,
}) => {
  const submissions: Record<string, unknown>[] = [];
  let releasePreparation: () => void = () => {};
  const preparation = new Promise<void>((resolve) => {
    releasePreparation = resolve;
  });
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: () => Promise.reject(new Error("Clipboard blocked")),
      },
    });
  });
  await page.route("**/api/enquiry", async (route) => {
    submissions.push(route.request().postDataJSON());
    await preparation;
    await route.fulfill({
      status: 200,
      json: { status: "prepared", brief: "A private prepared brief" },
    });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s talk" }).first().click();
  await page.getByLabel("Your name", { exact: true }).fill("  QA test  ");
  await page.getByLabel("Email address").fill("qa@example.com");
  await page
    .getByLabel("What are you thinking about?")
    .selectOption("Web & apps");
  await page.getByLabel("A little about your project").fill("  A QA brief  ");
  await page.getByRole("button", { name: "Prepare project brief" }).click();
  await expect(
    page.getByRole("button", { name: "Preparing your brief…" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Your name", { exact: true })).toBeDisabled();
  await page.locator("#contact-form").dispatchEvent("submit");
  await expect.poll(() => submissions.length).toBe(1);
  expect(submissions[0]).toEqual({
    name: "QA test",
    email: "qa@example.com",
    service: "Web & apps",
    message: "A QA brief",
    website: "",
  });
  releasePreparation();
  await expect(
    page.getByRole("button", { name: "Copy project brief" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Copy project brief" }).click();
  await expect(page.locator("#copy-status")).toContainText("Brief selected.");
  expect(await page.evaluate(() => window.getSelection()?.toString())).toBe(
    "A private prepared brief",
  );
  expect(submissions).toHaveLength(1);
});
