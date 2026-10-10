import { expect, test } from "@playwright/test";
import { filterErrorEvent } from "../app/lib/sentry-privacy";

test("error reports remove personal data, request bodies, and URL queries", () => {
  const event = filterErrorEvent({
    type: undefined,
    user: { email: "private@example.com", ip_address: "127.0.0.1" },
    request: {
      url: "https://tacticforyou.com/blog?email=private@example.com",
      data: "private message",
      headers: { Authorization: "secret" },
      cookies: { session: "secret" },
    },
    extra: { form: "private message" },
    contexts: { enquiry: { email: "private@example.com" } },
    breadcrumbs: [{ message: "private message" }],
    exception: {
      values: [
        {
          type: "Error",
          value: "private message",
          stacktrace: {
            frames: [
              {
                filename: "app.ts?secret=value",
                vars: { email: "private@example.com" },
              },
            ],
          },
        },
      ],
    },
  });
  const serialized = JSON.stringify(event);
  expect(serialized).not.toContain("private");
  expect(serialized).not.toContain("secret");
  expect(event?.request?.url).toBe("https://tacticforyou.com/blog");
  expect(event?.exception?.values?.[0]?.stacktrace?.frames?.[0]?.filename).toBe(
    "app.ts",
  );
  expect(
    filterErrorEvent({
      type: undefined,
      request: { url: "https://tacticforyou.com/api/enquiry" },
    }),
  ).toBeNull();
});

test("Clarity waits for consent and stops after withdrawal; GA4 is absent", async ({
  page,
}) => {
  const requests: string[] = [];
  await page.route(/googletagmanager\.com|clarity\.ms/, (route) => {
    requests.push(route.request().url());
    return route.fulfill({
      status: 200,
      contentType: "application/javascript",
      body: "",
    });
  });
  await page.goto("/?privateQuery=never-track-this");
  await expect(
    page.getByRole("heading", { name: "Your privacy choices" }),
  ).toBeVisible();
  expect(requests).toEqual([]);
  await page
    .getByRole("button", { name: "Reject recordings", exact: true })
    .click();
  await expect(page.locator("#privacy-settings")).toHaveCount(0);
  expect(requests).toEqual([]);
  await page
    .getByRole("button", { name: "Privacy settings", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Allow recordings", exact: true })
    .click();
  await expect
    .poll(() => requests.some((url) => url.includes("clarity.ms")))
    .toBe(true);
  expect(requests.some((url) => url.includes("googletagmanager.com"))).toBe(
    false,
  );
  await page.getByRole("button", { name: "Let’s talk" }).first().click();
  await expect(page.locator("#contact-dialog")).toHaveAttribute(
    "data-clarity-mask",
    "true",
  );
  await page.keyboard.press("Escape");
  const beforeWithdrawal = requests.length;
  await page
    .getByRole("button", { name: "Privacy settings", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Reject recordings", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Privacy settings", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#tactic-clarity")).toHaveCount(0);
  expect(requests.length).toBe(beforeWithdrawal);
});

test("privacy notice is reachable and wizard test endpoints are closed in production", async ({
  request,
}) => {
  const privacy = await request.get("/privacy");
  expect(privacy.ok()).toBe(true);
  expect(await privacy.text()).toContain("based in Iran");
  expect((await request.get("/api/sentry-example-api")).status()).toBe(404);
});
