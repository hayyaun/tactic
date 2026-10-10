import { expect, test } from "@playwright/test";

test("sending retries preserve the idempotency key and only confirm provider acceptance", async ({
  page,
}) => {
  test.skip(
    process.env.CONTACT_DELIVERY_ENABLED !== "true",
    "Run against an explicitly enabled delivery QA build with intercepted requests.",
  );
  const submissions: { submissionId: string; message: string }[] = [];
  await page.route("**/api/enquiry", (route) => {
    const data = route.request().postDataJSON();
    if (data.intent !== "send")
      return route.fulfill({
        status: 200,
        json: { status: "prepared", brief: "A private QA brief" },
      });
    submissions.push(data);
    return submissions.length === 1
      ? route.fulfill({
          status: 503,
          json: {
            status: "error",
            message: "Could not confirm sending. Retry this brief.",
          },
        })
      : route.fulfill({ status: 200, json: { status: "sent" } });
  });
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s talk" }).first().click();
  await page.getByLabel("Your name", { exact: true }).fill("QA test");
  await page.getByLabel("Email address").fill("qa@example.com");
  await page
    .getByLabel("What are you thinking about?")
    .selectOption("Web & apps");
  await page
    .getByLabel("A little about your project")
    .fill("A private QA brief");
  await page
    .getByRole("button", { name: "Prepare project brief", exact: true })
    .click();
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(
    page.locator("#contact-dialog").getByRole("alert"),
  ).toContainText("Could not confirm");
  await expect(page.locator("#brief-preview")).toContainText(
    "private QA brief",
  );
  await page.getByRole("button", { name: "Send enquiry", exact: true }).click();
  await expect(page.locator("#copy-status")).toContainText("Enquiry submitted");
  await expect(
    page.getByRole("button", { name: "Send enquiry", exact: true }),
  ).toHaveCount(0);
  expect(submissions).toHaveLength(2);
  expect(submissions[0].submissionId).toBe(submissions[1].submissionId);
  expect(submissions[0].submissionId).toMatch(/^[0-9a-f-]{36}$/);
});
