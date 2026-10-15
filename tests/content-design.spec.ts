import { expect, test } from "@playwright/test";
import { textBlock } from "../app/content/text-block";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import {
  ContentListing,
  ContentPage as DetailPage,
} from "../app/components/content-page";
import { BlogListing } from "../app/components/blog-listing";
import { AboutPage } from "../app/components/about-page";
import { defaultBlogContent } from "../app/content/blog";
import type { ContentPage } from "../app/content/types";
import { articleSchema, breadcrumbSchema } from "../app/lib/structured-data";
import PrivacyPage from "../app/privacy/page";
import NotFound from "../app/not-found";

const content = (overrides: Partial<ContentPage> = {}): ContentPage => ({
  path: "/about",
  kind: "about",
  status: "published",
  title: "Independent minds. Collective ambition.",
  description: "A considered creative practice, working together.",
  blocks: [
    textBlock("text-1", "A clear direction", { style: "h2" }),
    textBlock("text-2", "We turn careful thinking into work that matters."),
    textBlock("text-3", "Discovery", { listItem: "bullet", level: 1 }),
    textBlock("text-4", "Delivery", { listItem: "bullet", level: 1 }),
    {
      key: "image",
      type: "image",
      image: {
        src: "/studio/architecture.webp",
        alt: "TACTIC architectural brand study",
        width: 900,
        height: 900,
      },
      caption: "A study in considered structure.",
    },
  ],
  ...overrides,
});

const article = content({
  path: "/blog/a-clear-direction",
  kind: "article",
  title: "A clear direction",
  author: "TACTIC",
  publishedAt: "2026-10-10T12:00:00Z",
  updatedAt: "2026-10-11T12:00:00Z",
});

function expectSharedChrome(markup: string) {
  expect(markup).toContain("<header");
  expect(markup).toContain("<footer");
  expect(markup).toContain('aria-label="Main navigation"');
  expect(markup).toContain('aria-label="TACTIC home"');
  for (const href of ["/", "/#studio", "/#capabilities", "/blog", "/rss.xml"])
    expect(markup).toContain(`href="${href}"`);
  expect(markup).toContain('aria-controls="contact-dialog"');
  expect(markup).toContain('id="page-content"');
  expect(markup).toContain("Skip to content");
  expect(markup).not.toContain("<canvas");
  expect(markup).not.toContain("reveal-item");
}

test("editorial detail templates use the same static navigation and footer", () => {
  for (const [kind, path] of [
    ["about", "/about"],
    ["contact", "/contact"],
    ["service", "/services/identity"],
    ["project", "/portfolio/considered-work"],
    ["article", "/blog/a-clear-direction"],
  ] as const) {
    const entry = content({
      kind,
      path,
      ...(kind === "article" ? { publishedAt: article.publishedAt } : {}),
    });
    const markup = renderToStaticMarkup(
      createElement(DetailPage, { content: entry }),
    );
    expectSharedChrome(markup);
    expect(markup).toContain(entry.title);
    expect(markup).toContain(entry.description);
    expect(markup).toContain(
      "We turn careful thinking into work that matters.",
    );
    expect(markup).toContain("Discovery");
    expect(markup).toContain("A study in considered structure.");
    expect(markup).toContain('alt="TACTIC architectural brand study"');
  }
});

test("About portraits distinguish illustrated stand-ins from real team details", () => {
  for (const team of [undefined, []]) {
    const markup = renderToStaticMarkup(
      createElement(AboutPage, { content: content({ team }) }),
    );
    expectSharedChrome(markup);
    expect(markup).toContain("New introductions are on their way.");
    expect(markup).not.toContain("<article");
    expect(markup).not.toContain("<h3");
  }

  const member = {
    key: "portrait-test-member",
    name: "Example Team Member",
    role: "Creative strategist (test fixture)",
    bio: "A supplied biography for the portrait layout test.",
    portrait: {
      src: "/studio/architecture.webp",
      alt: "Portrait of the example team member",
      width: 900,
      height: 900,
    },
  };
  const markup = renderToStaticMarkup(
    createElement(AboutPage, {
      content: content({
        team: [member],
        teamIntro: "A supplied introduction to the team.",
      }),
    }),
  );
  expectSharedChrome(markup);
  expect(markup).toMatch(/<h3[^>]*>Example Team Member<\/h3>/);
  expect(markup).toContain(member.role);
  expect(markup).toContain(member.bio);
  expect(markup).toContain('alt="Portrait of the example team member"');
  expect(markup).toContain("A supplied introduction to the team.");
  expect(markup).not.toContain("Portrait study");
  expect(markup).not.toContain("STUDIO STUDIES / PORTRAITS TO FOLLOW");
  expect(markup).not.toContain("ILLUSTRATED STAND-INS");
  const preview = renderToStaticMarkup(
    createElement(AboutPage, {
      content: content({ team: [{ ...member, isPlaceholder: true }] }),
    }),
  );
  expect(preview).toContain("CASTING NOTES / ILLUSTRATED STAND-INS");
  expect(preview).toContain(
    "Cards marked “Character study” are fictional portrait studies.",
  );
  expect(preview).toContain("CHARACTER STUDY");
});

test("content listings and privacy use the shared editorial chrome", () => {
  for (const [path, kind] of [
    ["/services", "service"],
    ["/portfolio", "project"],
  ] as const) {
    const entry = content({ path: `${path}/considered-work`, kind });
    const markup = renderToStaticMarkup(
      createElement(ContentListing, {
        content: content({ path, kind: "listing", blocks: [] }),
        entries: [entry],
      }),
    );
    expectSharedChrome(markup);
    expect(markup).toContain(`href="${entry.path}"`);
  }
  expectSharedChrome(
    renderToStaticMarkup(
      createElement(BlogListing, {
        content: defaultBlogContent,
        entries: [article],
      }),
    ),
  );
  const privacy = renderToStaticMarkup(createElement(PrivacyPage));
  expectSharedChrome(privacy);
  expect(privacy).toContain("Privacy notice");
  expect(privacy).toContain("Project enquiries");
  expect(privacy).toContain("Optional recordings and heatmaps");
  expect(privacy).toContain("Advertising storage is always denied.");
});

test("article and breadcrumb metadata survive editorial restyling", () => {
  const markup = renderToStaticMarkup(
    createElement(DetailPage, { content: article }),
  );
  expect(markup).toContain('type="application/ld+json"');
  expect(markup).toContain(JSON.stringify(articleSchema(article)));
  expect(markup).toContain(
    JSON.stringify(
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: article.title, path: article.path },
      ]),
    ),
  );
  expect(markup).toContain(`dateTime="${article.publishedAt}"`);
  expect(markup).toContain(article.author!);
});

test("unpublished-page recovery keeps shared navigation and its home link", () => {
  const markup = renderToStaticMarkup(createElement(NotFound));
  expectSharedChrome(markup);
  expect(markup).toContain("This page isn\u2019t here.");
  expect(markup).toContain("hasn\u2019t been published yet.");
  expect(markup).toContain("Back to home");
});

test.describe("shared editorial pages without JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "no-preference" });

  for (const route of ["/about", "/blog", "/privacy"]) {
    test(`${route} is readable on desktop and mobile on initial load`, async ({
      page,
    }, testInfo) => {
      const response = await page.goto(route, { waitUntil: "load" });
      expect(response?.ok()).toBe(true);
      await expect(page.locator("main h1")).toBeVisible();
      await expect(page.locator("main h1")).not.toBeEmpty();
      await expect(page.locator("canvas")).toHaveCount(0);
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
        "href",
        `https://tacticforyou.com${route}`,
      );
      await expect(
        page.getByRole("navigation", { name: "Main navigation", exact: true }),
      ).toBeVisible();
      for (const viewport of [
        { name: "desktop", width: 1440, height: 1000 },
        { name: "mobile", width: 390, height: 844 },
        { name: "compact", width: 320, height: 740 },
        { name: "tablet", width: 600, height: 960 },
        { name: "small-desktop", width: 960, height: 1000 },
      ]) {
        await page.setViewportSize(viewport);
        await expect(page.locator("main h1")).toBeVisible();
        const layout = await page.evaluate(() => ({
          width: document.documentElement.clientWidth,
          scrollWidth: document.documentElement.scrollWidth,
          animatedOrHidden: Array.from(
            document.querySelectorAll("main, main *"),
          ).filter((element) => {
            const style = getComputedStyle(element);
            return style.animationName !== "none" || style.opacity === "0";
          }).length,
        }));
        expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width);
        expect(layout.animatedOrHidden).toBe(0);
        for (const heading of await page.locator("main h1, main h2").all())
          expect(
            await heading.evaluate((element) => element.scrollWidth),
          ).toBeLessThanOrEqual(
            await heading.evaluate((element) => element.clientWidth),
          );
        for (const image of await page.locator("main img").all()) {
          await image.scrollIntoViewIfNeeded();
          await expect
            .poll(() =>
              image.evaluate(
                (element: HTMLImageElement) =>
                  element.complete && element.naturalWidth > 0,
              ),
            )
            .toBe(true);
        }
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({
          path: testInfo.outputPath(
            `${route.slice(1)}-live-${viewport.name}.png`,
          ),
          fullPage: true,
        });
      }
    });
  }
});
