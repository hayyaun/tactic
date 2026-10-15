import { expect, test, type Page } from "@playwright/test";
import { textBlock } from "../app/content/text-block";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { BlogListing } from "../app/components/blog-listing";
import {
  articleReadingMinutes,
  defaultBlogContent,
  getBlogArticles,
  getBlogListingContent,
} from "../app/content/blog";
import type { ContentPage } from "../app/content/types";

const article = (overrides: Partial<ContentPage> = {}): ContentPage => ({
  path: "/blog/considered-design",
  kind: "article",
  status: "published",
  title: "The value of considered design",
  description: "How a clear point of view makes the work more useful.",
  author: "TACTIC",
  publishedAt: "2026-10-10T12:00:00Z",
  blocks: [textBlock("text-1", "A considered place to begin.")],
  ...overrides,
});

const fixtureArticles: readonly ContentPage[] = [
  article({
    title: "A clear point of view changes everything.",
    hero: {
      src: "/studio/architecture.webp",
      alt: "Architectural study in light and shadow",
      width: 1600,
      height: 1200,
    },
  }),
  article({
    path: "/blog/strategy-before-style",
    title: "Strategy before style.",
    description: "The questions worth asking before making the first mark.",
    publishedAt: "2026-10-09T12:00:00Z",
    hero: {
      src: "/studio/strategy.webp",
      alt: "A focused strategy study",
      width: 1600,
      height: 1200,
    },
  }),
  article({
    path: "/blog/finding-the-right-path",
    title: "Finding the right path.",
    description: "On making room for a more deliberate direction.",
    publishedAt: "2026-10-08T12:00:00Z",
    hero: {
      src: "/studio/pathways.webp",
      alt: "Intersecting architectural pathways",
      width: 1600,
      height: 1200,
    },
  }),
  article({
    path: "/blog/a-quiet-kind-of-confidence",
    title: "A quiet kind of confidence.",
    description: "Why the most effective identities leave room to breathe.",
    publishedAt: "2026-10-07T12:00:00Z",
  }),
];

test("blog chooses approved listing content or a usable default", () => {
  expect(defaultBlogContent).toMatchObject({
    path: "/blog",
    kind: "listing",
    status: "published",
    title: "Journal",
  });
  const listing = {
    ...defaultBlogContent,
    title: "Studio notes",
    description: "A point of view from the studio.",
  };
  const draft = { ...listing, status: "draft" as const };
  expect(getBlogListingContent([draft])).toEqual(defaultBlogContent);
  expect(
    getBlogListingContent([
      { ...listing, path: "/services" },
      { ...listing, kind: "article" },
    ]),
  ).toEqual(defaultBlogContent);
  expect(getBlogListingContent([draft, listing])).toEqual(listing);
});

test("blog articles are valid published single-slug posts sorted newest first", () => {
  const older = article({
    path: "/blog/older",
    publishedAt: "2026-10-01T12:00:00Z",
  });
  const newer = article({
    path: "/blog/newer",
    publishedAt: "2026-10-11T12:00:00Z",
  });
  const input: readonly ContentPage[] = Object.freeze([
    older,
    article({ path: "/blog/draft", status: "draft" }),
    article({ path: "/services/design", kind: "service" }),
    article({ path: "/blog/nested/post" }),
    article({ path: "/blog/undated", publishedAt: undefined }),
    article({ path: "/blog/invalid-date", publishedAt: "not-a-date" }),
    article({ path: "/blog/UPPERCASE" }),
    newer,
  ]);
  expect(getBlogArticles(input)).toEqual([newer, older]);
  expect(input[0]).toBe(older);
  expect(input[input.length - 1]).toBe(newer);
});

test("article reading time counts editorial words without counting image URLs", () => {
  expect(articleReadingMinutes(article({ blocks: [] }))).toBe(1);
  expect(
    articleReadingMinutes(
      article({
        blocks: [
          textBlock("text-2", "word ".repeat(20), { style: "h2" }),
          textBlock("text-3", "word ".repeat(200)),
          textBlock("text-5", "word ".repeat(220), {
            listItem: "bullet",
            level: 1,
          }),
          {
            type: "image",
            image: {
              src: "/studio/architecture.webp",
              alt: "An architectural image",
              width: 1600,
              height: 1200,
            },
          },
        ],
      }),
    ),
  ).toBe(2);
  expect(
    articleReadingMinutes(
      article({ blocks: [textBlock("text-4", "word ".repeat(441))] }),
    ),
  ).toBe(3);
});

test("blog server markup contains editorial content, navigation, and an honest empty state", () => {
  const empty = renderToStaticMarkup(
    createElement(BlogListing, { content: defaultBlogContent, entries: [] }),
  );
  expect(empty).toContain("No articles yet.");
  for (const href of ["/", "/#studio", "/rss.xml"])
    expect(empty).toContain(`href="${href}"`);
  expect(empty).toContain('aria-controls="contact-dialog"');
  expect(empty).not.toContain("<canvas");
  const populated = renderToStaticMarkup(
    createElement(BlogListing, {
      content: defaultBlogContent,
      entries: fixtureArticles,
    }),
  );
  for (const entry of fixtureArticles) {
    expect(populated).toContain(entry.title);
    expect(populated).toContain(`href="${entry.path}"`);
  }
  expect(populated).not.toContain("<canvas");
  expect(populated).not.toContain("reveal-item");
});

test.describe("blog without JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "no-preference" });

  test("the real blog route is visible on first load", async ({
    page,
  }, testInfo) => {
    const response = await page.goto("/blog", { waitUntil: "load" });
    expect(response?.ok()).toBe(true);
    await expect(page.locator("main h1")).toBeVisible();
    await expect(page.locator("main h1")).not.toBeEmpty();
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(
      await page.locator("main").evaluate((main) => main.scrollWidth),
    ).toBeLessThanOrEqual(
      await page.locator("main").evaluate((main) => main.clientWidth),
    );
    for (const viewport of [
      { name: "desktop", width: 1440, height: 1000 },
      { name: "mobile", width: 390, height: 844 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(page.locator("main h1")).toBeVisible();
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
        path: testInfo.outputPath(`blog-live-${viewport.name}.png`),
        fullPage: true,
      });
    }
  });

  for (const viewport of [
    { name: "desktop", width: 1440, height: 1000 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    test(`populated blog is readable and image-complete on ${viewport.name}`, async ({
      page,
      baseURL,
    }, testInfo) => {
      await page.setViewportSize(viewport);
      await renderFixture(page, baseURL!);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("heading", {
          name: fixtureArticles[0].title,
          exact: true,
        }),
      ).toBeVisible();
      const images = page.locator("main img");
      await expect(images).toHaveCount(3);
      expect(await images.first().getAttribute("loading")).not.toBe("lazy");
      expect(await images.first().getAttribute("fetchpriority")).toBe("high");
      for (let index = 1; index < 3; index++)
        expect(await images.nth(index).getAttribute("loading")).toBe("lazy");
      for (const image of await images.all()) {
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
      const layout = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        animations: Array.from(
          document.querySelectorAll("main, main *"),
        ).filter((element) => {
          const style = getComputedStyle(element);
          return style.animationName !== "none" || style.opacity === "0";
        }).length,
      }));
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width);
      expect(layout.animations).toBe(0);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: testInfo.outputPath(`blog-${viewport.name}.png`),
        fullPage: true,
      });
      if (viewport.name === "desktop") {
        for (const edge of [
          { name: "compact", width: 320, height: 740 },
          { name: "tablet", width: 600, height: 960 },
          { name: "small-desktop", width: 960, height: 1000 },
        ]) {
          await page.setViewportSize(edge);
          const widths = await page.evaluate(() => ({
            width: document.documentElement.clientWidth,
            scrollWidth: document.documentElement.scrollWidth,
          }));
          expect(widths.scrollWidth).toBeLessThanOrEqual(widths.width);
          for (const image of await images.all()) {
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
            path: testInfo.outputPath(`blog-${edge.name}.png`),
            fullPage: true,
          });
        }
        await page.setViewportSize(viewport);
      }
      await renderFixture(page, baseURL!, []);
      await expect(
        page.getByRole("heading", { name: "No articles yet.", exact: true }),
      ).toBeVisible();
      await expect
        .poll(() =>
          page
            .locator("main img")
            .evaluate(
              (element: HTMLImageElement) =>
                element.complete && element.naturalWidth > 0,
            ),
        )
        .toBe(true);
      await page.screenshot({
        path: testInfo.outputPath(`blog-empty-${viewport.name}.png`),
        fullPage: true,
      });
    });
  }
});

async function renderFixture(
  page: Page,
  baseURL: string,
  entries: readonly ContentPage[] = fixtureArticles,
) {
  await page.goto("/blog", { waitUntil: "load" });
  const styles = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((links) =>
      links.map((link) => (link as HTMLLinkElement).href),
    );
  const fontClasses = await page.locator("html").getAttribute("class");
  const markup = renderToStaticMarkup(
    createElement(BlogListing, {
      content: defaultBlogContent,
      entries,
    }),
  );
  await page.setContent(
    `<!doctype html><html lang="en" class="${fontClasses ?? ""}"><head><base href="${baseURL}/">${styles.map((href) => `<link rel="stylesheet" href="${href}">`).join("")}</head><body id="top">${markup}</body></html>`,
    { waitUntil: "load" },
  );
}
