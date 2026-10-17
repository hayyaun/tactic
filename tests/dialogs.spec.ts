import { expect, test } from "@playwright/test";

for (const route of [
  "/services",
  "/about",
  "/contact",
  "/portfolio",
  "/blog",
  "/services/branding-design",
]) {
  test(`the shared contact dialog opens on ${route} without navigation and restores focus`, async ({
    page,
  }) => {
    await page.goto(route);
    await expect(page.locator("#contact-dialog")).toHaveCount(1);
    const opener = page
      .locator("header")
      .getByRole("button", { name: "Let’s talk", exact: true });
    await expect(opener).toHaveAttribute("aria-haspopup", "dialog");
    await opener.click();
    await expect(page).toHaveURL(new RegExp(`${route}$`));
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(
      dialog.getByRole("button", { name: "Close project enquiry" }),
    ).toBeFocused();
    await expect(page.locator("body")).toHaveClass(/modal-open/);
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await expect(page.locator("body")).not.toHaveClass(/modal-open/);
    await expect(opener).toBeFocused();
  });
}

test("a CMS enquiry action opens the shared dialog in place and remains keyboard accessible", async ({
  page,
}) => {
  await page.goto("/services/branding-design");
  const opener = page
    .locator('main button[aria-controls="contact-dialog"]')
    .first();
  await expect(opener).toBeVisible();
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/services\/branding-design$/);
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(opener).toBeFocused();
});

test("contact details survive client navigation with one persistent dialog host", async ({
  page,
}) => {
  await page.goto("/services");
  await page
    .locator("header")
    .getByRole("button", { name: "Let’s talk", exact: true })
    .click();
  await page.getByLabel("Your name", { exact: true }).fill("A saved enquiry");
  await page.keyboard.press("Escape");
  await page
    .getByRole("navigation", { name: "Main navigation", exact: true })
    .getByRole("link", { name: "Selected work", exact: true })
    .click();
  await expect(page).toHaveURL(/\/portfolio$/);
  await expect(page.locator("#contact-dialog")).toHaveCount(1);
  await page
    .locator("header")
    .getByRole("button", { name: "Let’s talk", exact: true })
    .click();
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    "A saved enquiry",
  );
});

test("history navigation preserves scroll locking while the global contact dialog remains open", async ({
  page,
}) => {
  await page.goto("/services");
  await page.getByRole("link", { name: "TACTIC home" }).first().click();
  await page.getByRole("button", { name: "Let’s talk" }).first().click();
  await expect(page.locator("#contact-dialog")).toBeVisible();
  await page.goBack();
  await expect(page).toHaveURL(/\/services$/);
  await expect(page.locator("#contact-dialog")).toBeVisible();
  await expect(page.locator("body")).toHaveClass(/modal-open/);
  await expect(page.locator("body")).toHaveCSS("overflow", "hidden");
  await page.keyboard.press("Escape");
  await expect(page.locator("#contact-dialog")).toBeHidden();
  await expect(page.locator("body")).not.toHaveClass(/modal-open/);
});

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
