import { expect, test } from "@playwright/test";
import { buildRss } from "../app/lib/rss";
import { publishedPages } from "../app/content/pages";
import { serializeJsonLd } from "../app/lib/structured-data";
import type { ContentPage } from "../app/content/types";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ContentPage as DetailPage,
  ContentListing,
} from "../app/components/content-page";

test("content templates render editorial blocks and listing links", () => {
  const entry: ContentPage = {
    path: "/services/identity",
    kind: "service",
    status: "draft",
    title: "Identity design",
    description: "A clear identity.",
    blocks: [
      { type: "heading", text: "Process" },
      { type: "paragraph", text: "Research & design" },
      { type: "list", items: ["Discovery", "Delivery"] },
    ],
  };
  const detail = renderToStaticMarkup(
    createElement(DetailPage, { content: entry }),
  );
  expect(detail).toContain("<h1");
  expect(detail).toContain("Research &amp; design");
  expect(detail).toContain("<li>Discovery</li>");
  const listing = renderToStaticMarkup(
    createElement(ContentListing, {
      content: {
        ...entry,
        path: "/services",
        kind: "listing",
        title: "Services",
      },
      entries: [entry],
    }),
  );
  expect(listing).toContain('href="/services/identity"');
});

const valid = {
  name: "Alex Morgan",
  email: "alex@example.com",
  service: "Web & apps",
  message: "A launch website for our studio.",
  website: "",
};

test("drafts stay out of published content and RSS escapes editorial text", () => {
  const draft: ContentPage = {
    path: "/blog/draft",
    status: "draft",
    kind: "article",
    title: "Private",
    description: "Private",
    blocks: [],
    publishedAt: "2026-10-10T12:00:00Z",
  };
  const published: ContentPage = {
    ...draft,
    path: "/blog/launch",
    status: "published",
    title: "Brand & <design>",
    description: 'A "clear" direction',
  };
  expect(publishedPages([draft, published])).toEqual([published]);
  const feed = buildRss([draft, published]);
  expect(feed).not.toContain("/blog/draft");
  expect(feed).toContain("Brand &amp; &lt;design&gt;");
  expect(feed).toContain("https://tacticforyou.com/blog/launch");
  expect(
    serializeJsonLd({ name: "</script><script>alert(1)</script>" }),
  ).not.toContain("<");
});

test("public SEO endpoints and security headers are ready", async ({
  request,
}) => {
  const home = await request.get("/");
  expect(home.headers()["x-content-type-options"]).toBe("nosniff");
  expect(home.headers()["x-frame-options"]).toBe("DENY");
  expect(home.headers()["x-powered-by"]).toBeUndefined();
  const html = await home.text();
  expect(html).toContain('href="https://tacticforyou.com"');
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBe(true);
  const indexable =
    process.env.SITE_INDEXABLE === "true" ||
    process.env.VERCEL_ENV === "production";
  expect(await robots.text()).toContain(indexable ? "Allow: /" : "Disallow: /");
  if (!indexable)
    expect(home.headers()["x-robots-tag"]).toBe("noindex, nofollow");
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  expect(await sitemap.text()).not.toContain("/services");
  const rss = await request.get("/rss.xml");
  expect(rss.headers()["content-type"]).toContain("application/rss+xml");
  expect(await rss.text()).toContain("<channel>");
  expect(await rss.text()).not.toContain("<item>");
});

test("unpublished routes show a useful recovery link", async ({ page }) => {
  await page.goto("/services/not-published");
  await expect(
    page.getByRole("heading", { name: "This page isn’t here." }),
  ).toBeVisible();
  await page.getByRole("link", { name: "Back to home", exact: true }).click();
  await expect(page.locator("#hero-title")).toBeVisible();
});

test("production debug requires an explicit build opt-in", async ({ page }) => {
  await page.goto("/?debug");
  const controls = page.getByRole("complementary", {
    name: "Scene debug controls",
  });
  if (process.env.NEXT_PUBLIC_ENABLE_SCENE_DEBUG === "true")
    await expect(controls).toBeVisible();
  else {
    await expect(page.locator("[data-hero-art]")).toHaveAttribute(
      "data-ready",
      "true",
    );
    await expect(controls).toHaveCount(0);
  }
});

test("enquiry endpoint rejects invalid input, cross-site requests, bots, and large bodies", async ({
  request,
  baseURL,
}) => {
  const headers = { Origin: baseURL! };
  expect(
    (
      await request.post("/api/enquiry", {
        data: valid,
        headers: { Origin: "https://other.example" },
      })
    ).status(),
  ).toBe(403);
  expect(
    (
      await request.post("/api/enquiry", {
        data: { ...valid, name: " ", email: "bad", service: "unknown" },
        headers,
      })
    ).status(),
  ).toBe(422);
  expect(
    (
      await request.post("/api/enquiry", {
        data: { ...valid, website: "bot.example" },
        headers,
      })
    ).status(),
  ).toBe(400);
  expect(
    (
      await request.post("/api/enquiry", {
        data: { ...valid, message: "a".repeat(17000) },
        headers,
      })
    ).status(),
  ).toBe(413);
  const ready = await request.post("/api/enquiry", { data: valid, headers });
  expect(ready.ok()).toBe(true);
  expect(ready.headers()["cache-control"]).toBe("no-store");
  expect(await ready.json()).toEqual({
    status: "prepared",
    brief: expect.stringContaining("Name: Alex Morgan"),
  });
});

test("enquiry form preserves input on failure and can retry without claiming delivery", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Let’s talk" }).first().click();
  await page.getByLabel("Your name", { exact: true }).fill(valid.name);
  await page.getByLabel("Email address").fill(valid.email);
  await page
    .getByLabel("What are you thinking about?")
    .selectOption(valid.service);
  await page.getByLabel("A little about your project").fill(valid.message);
  await page.route("**/api/enquiry", (route) => route.abort(), { times: 1 });
  await page
    .getByRole("button", { name: "Prepare project brief", exact: true })
    .click();
  await expect(
    page.locator("#contact-dialog").getByRole("alert"),
  ).toContainText("Your details have not been sent");
  await expect(page.getByLabel("Your name", { exact: true })).toHaveValue(
    valid.name,
  );
  await page.getByRole("button", { name: "Try preparing again" }).click();
  await expect(page.locator("#brief-preview")).toContainText(valid.message);
  await expect(
    page.getByRole("button", { name: "Copy project brief" }),
  ).toBeFocused();
  await page.getByRole("button", { name: "Edit your brief" }).click();
  await expect(page.getByLabel("Your name", { exact: true })).toBeFocused();
});

test("keyboard skip link, contact focus, and reduced motion work", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "TACTIC home", exact: true }).focus();
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  const opener = page.getByRole("button", { name: "Let’s talk" }).first();
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#contact-dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
});

test("enquiry limiter bounds repeated attempts", async ({
  request,
  baseURL,
}) => {
  let limited = false;
  for (let attempt = 0; attempt < 31; attempt++) {
    const response = await request.post("/api/enquiry", {
      data: valid,
      headers: { Origin: baseURL! },
    });
    if (response.status() === 429) {
      expect(response.headers()["retry-after"]).toBe("60");
      limited = true;
      break;
    }
    expect(response.status()).toBe(200);
  }
  expect(limited).toBe(true);
});
