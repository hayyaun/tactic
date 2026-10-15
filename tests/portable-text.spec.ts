import { expect, test, type Page } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { PUBLISHED_CONTENT_QUERY_RESULT } from "../sanity.types";
import { ContentBlocks } from "../app/components/content-blocks";
import { ContentPage as DetailPage } from "../app/components/content-page";
import { articleReadingMinutes } from "../app/content/blog";
import type {
  ContentBlock,
  ContentPage,
  ContentTextBlock,
} from "../app/content/types";
import { safeContentLink } from "../app/lib/content-link";
import { PUBLISHED_CONTENT_QUERY } from "../app/sanity/queries";
import { toContentPage } from "../app/sanity/transform";

type SanityPage = PUBLISHED_CONTENT_QUERY_RESULT[number];
type RawTextBlock = Extract<
  NonNullable<SanityPage["blocks"]>[number],
  { _type: "block" }
>;

function rich(
  key: string,
  text: string,
  overrides: Partial<ContentTextBlock> = {},
): ContentBlock & { type: "portableText" } {
  return {
    type: "portableText",
    key,
    value: {
      _type: "block",
      _key: key,
      style: "normal",
      children: [{ _type: "span", _key: `${key}-span`, text, marks: [] }],
      markDefs: [],
      ...overrides,
    },
  };
}

function rawBlock(overrides: Partial<RawTextBlock> = {}): RawTextBlock {
  return {
    _key: "rich-paragraph",
    _type: "block",
    caption: null,
    image: null,
    style: "normal",
    listItem: null,
    level: null,
    children: [
      { _key: "rich-span", _type: "span", text: "Rich text", marks: [] },
    ],
    markDefs: [],
    ...overrides,
  };
}

const rawPage = (blocks: SanityPage["blocks"]): SanityPage => ({
  _id: "portable-text-fixture",
  path: "/blog/portable-text-fixture",
  kind: "article",
  status: "published",
  title: "Considered writing",
  seoTitle: null,
  description: "A clear structure for a studio journal.",
  eyebrow: null,
  hero: null,
  socialImage: null,
  teamIntro: null,
  team: null,
  blocks,
  publishedAt: "2026-10-12T09:00:00Z",
  updatedAt: "2026-10-12T09:00:00Z",
  author: "TACTIC",
});

const listBlocks = [
  rich("first-item", "First direction", { listItem: "number", level: 1 }),
  rich("nested-item", "A nested consideration", {
    listItem: "number",
    level: 2,
  }),
  rich("second-item", "Second direction", { listItem: "number", level: 1 }),
];

const fixtureBlocks: ContentBlock[] = [
  rich("rich-heading", "A clear direction", { style: "h2" }),
  rich("rich-paragraph", "", {
    children: [
      {
        _type: "span",
        _key: "plain",
        text: "Careful thinking becomes ",
        marks: [],
      },
      { _type: "span", _key: "strong", text: "strong work", marks: ["strong"] },
      { _type: "span", _key: "em", text: " with emphasis", marks: ["em"] },
      {
        _type: "span",
        _key: "code",
        text: " and inline code",
        marks: ["code"],
      },
      {
        _type: "span",
        _key: "underline",
        text: ", underlined",
        marks: ["underline"],
      },
      {
        _type: "span",
        _key: "strike",
        text: ", revised",
        marks: ["strike-through"],
      },
      {
        _type: "span",
        _key: "link",
        text: ", connected.",
        marks: ["studio-link"],
      },
    ],
    markDefs: [
      {
        _type: "link",
        _key: "studio-link",
        href: "/about",
        openInNewTab: true,
      },
    ],
  }),
  rich("subheading", "From the first question", { style: "h3" }),
  ...listBlocks,
  rich("paragraph", "Existing writing stays exactly where it belongs."),
  {
    type: "image",
    key: "image",
    image: {
      src: "/studio/architecture.webp",
      alt: "TACTIC architectural study",
      width: 900,
      height: 900,
    },
    caption: "A retained image caption.",
  },
  rich("quote", "Structure leaves room for a point of view.", {
    style: "blockquote",
  }),
  rich("bullet", "One final consideration", { listItem: "bullet", level: 1 }),
];

const fixture: ContentPage = {
  path: "/blog/portable-text-fixture",
  kind: "article",
  status: "published",
  title: "Considered writing",
  description: "A clear structure for a studio journal.",
  author: "TACTIC",
  publishedAt: "2026-10-12T09:00:00Z",
  blocks: fixtureBlocks,
};

const renderBlocks = (blocks: readonly ContentBlock[]) =>
  renderToStaticMarkup(createElement(ContentBlocks, { blocks }));

test("Portable Text query projects keys, spans, marks, annotations, and list metadata", () => {
  for (const field of [
    "style",
    "listItem",
    "level",
    "children",
    "markDefs",
    "marks",
    "href",
    "openInNewTab",
  ])
    expect(PUBLISHED_CONTENT_QUERY).toContain(field);
  expect(PUBLISHED_CONTENT_QUERY).toContain('_type == "block"');
  expect(PUBLISHED_CONTENT_QUERY).toContain("_key");
});

test("Portable Text conversion retains spans and annotation keys", () => {
  const text = rawBlock({
    style: "h3",
    listItem: "number",
    level: 2,
    children: [
      {
        _key: "first-span",
        _type: "span",
        text: "Research & ",
        marks: ["strong"],
      },
      {
        _key: "second-span",
        _type: "span",
        text: "design",
        marks: ["link-1", "em"],
      },
    ],
    markDefs: [
      { _key: "link-1", _type: "link", href: "/about", openInNewTab: true },
    ],
  });
  const content = toContentPage(rawPage([text]));
  expect(content?.blocks).toEqual([
    {
      key: text._key,
      type: "portableText",
      value: {
        _type: "block",
        _key: text._key,
        style: "h3",
        listItem: "number",
        level: 2,
        children: text.children,
        markDefs: text.markDefs,
      },
    },
  ]);
});

test("Portable Text conversion tolerates null editorial fields without dropping valid text", () => {
  const content = toContentPage(
    rawPage([
      rawBlock({ _key: "missing-children", children: null }),
      rawBlock({
        style: null,
        children: [
          { _key: "valid", _type: "span", text: "Text survives", marks: null },
          { _key: "blank", _type: "span", text: "", marks: [] },
          { _key: "missing", _type: "span", text: null, marks: null },
        ],
        markDefs: null,
      }),
    ]),
  );
  expect(content?.blocks).toEqual([
    rich("rich-paragraph", "", {
      children: [
        { _key: "valid", _type: "span", text: "Text survives", marks: [] },
        { _key: "blank", _type: "span", text: "", marks: [] },
      ],
    }),
  ]);
});

test("rich-text styles and decorators render semantic, escaped server markup", () => {
  const markup = renderBlocks([
    ...fixtureBlocks,
    rich("escaped", '<script>alert("test")</script> & safe text'),
  ]);
  for (const element of [
    "p",
    "h2",
    "h3",
    "blockquote",
    "strong",
    "em",
    "code",
    "del",
    "ul",
    "ol",
  ])
    expect(markup).toMatch(new RegExp(`<${element}(?:\\s|>)`));
  expect(markup).toContain('class="underline"');
  expect(markup).toContain(
    "&lt;script&gt;alert(&quot;test&quot;)&lt;/script&gt; &amp; safe text",
  );
  expect(markup).not.toContain("<script");
  expect(markup).not.toContain("<canvas");
  expect(markup).not.toContain("reveal-item");
});

test("rich-text links allow intentional destinations and reject unsafe or ambiguous URLs", () => {
  for (const href of [
    "/about",
    "/blog?topic=design#notes",
    "#notes",
    "https://example.com/article",
    "http://example.com/article",
    "mailto:hello@example.com",
    "tel:+123456789",
  ])
    expect(safeContentLink(href), href).toBe(href);
  const unsafe: unknown[] = [
    "javascript:alert(1)",
    "JaVaScRiPt:alert(1)",
    "data:text/html,unsafe",
    "vbscript:msgbox(1)",
    "//example.com",
    "/\\example.com",
    "\\\\example.com",
    "java\nscript:alert(1)",
    "https://example.com\u0000/unsafe",
    "https://example.com/white space",
    " https://example.com",
    "https://user:pass@example.com",
    "relative/path",
    "",
    null,
    undefined,
    42,
  ];
  for (const href of unsafe) {
    expect(safeContentLink(href), String(href)).toBeUndefined();
    const markup = renderBlocks([
      rich("unsafe", "Unsafe destination remains readable", {
        children: [
          {
            _type: "span",
            _key: "unsafe-span",
            text: "Unsafe destination remains readable",
            marks: ["unsafe-link"],
          },
        ],
        markDefs: [
          {
            _type: "link",
            _key: "unsafe-link",
            href: href as string,
            openInNewTab: true,
          },
        ],
      }),
    ]);
    expect(markup).toContain("Unsafe destination remains readable");
    expect(markup).not.toContain("<a ");
  }
  const newTab = renderBlocks([fixtureBlocks[1]]);
  expect(newTab).toContain('href="/about"');
  expect(newTab).toContain('target="_blank"');
  expect(newTab).toContain('rel="noopener noreferrer"');
});

test("CMS contact annotations render enquiry buttons and preserve ordinary destination links", () => {
  for (const href of ["/#contact", "#contact"]) {
    const markup = renderBlocks([
      rich("enquiry", "", {
        children: [
          {
            _type: "span",
            _key: "enquiry-span",
            text: "Discuss your project",
            marks: ["enquiry-link"],
          },
        ],
        markDefs: [
          { _type: "link", _key: "enquiry-link", href, openInNewTab: true },
        ],
      }),
    ]);
    expect(markup).toContain("Discuss your project");
    expect(markup).toMatch(/<button\b[^>]*type="button"/);
    expect(markup).toContain('aria-controls="contact-dialog"');
    expect(markup).toContain('aria-haspopup="dialog"');
    expect(markup).not.toContain("href=");
    expect(markup).not.toContain("target=");
  }
});

test("adjacent rich-text items form one ordered list with proper nested structure", () => {
  const markup = renderBlocks(listBlocks);
  expect(markup.match(/<ol(?:\s|>)/g)).toHaveLength(2);
  expect(markup.match(/<li(?:\s|>)/g)).toHaveLength(3);
  expect(markup).toMatch(
    /First direction<ol[^>]*><li[^>]*>A nested consideration<\/li><\/ol><\/li><li[^>]*>Second direction/,
  );
});

test("rich text and images preserve captions and document order", () => {
  const markup = renderBlocks(fixtureBlocks);
  const texts = [
    "A clear direction",
    "Careful thinking becomes",
    "From the first question",
    "First direction",
    "Second direction",
    "Existing writing stays exactly where it belongs.",
    "A retained image caption.",
    "Structure leaves room for a point of view.",
    "One final consideration",
  ];
  let previous = -1;
  for (const text of texts) {
    const position = markup.indexOf(text);
    expect(position, text).toBeGreaterThan(previous);
    previous = position;
  }
  expect(markup).toContain('alt="TACTIC architectural study"');
  expect(markup).toContain("<figcaption");
  const splitLists = renderBlocks([
    ...listBlocks,
    rich("separator", "A paragraph separates lists."),
    rich("separate-list", "A new list begins here", {
      listItem: "number",
      level: 1,
    }),
  ]);
  expect(splitLists.match(/<ol(?:\s|>)/g)).toHaveLength(3);
});

test("reading time joins rich-text spans without inventing word boundaries", () => {
  expect(
    articleReadingMinutes({
      ...fixture,
      blocks: [
        rich("split-word", "", {
          children: [
            { _type: "span", _key: "start", text: "consid", marks: ["strong"] },
            {
              _type: "span",
              _key: "end",
              text: `ered ${"word ".repeat(219)}`,
              marks: [],
            },
          ],
        }),
      ],
    }),
  ).toBe(1);
  expect(
    articleReadingMinutes({
      ...fixture,
      blocks: [
        rich("long-rich", "word ".repeat(440)),
        rich("paragraph", "Paragraph"),
        rich("heading", "Heading", { style: "h2" }),
        rich("list", "List", { listItem: "bullet", level: 1 }),
        {
          type: "image",
          image: {
            src: "/studio/architecture.webp",
            alt: "Do not count alt text",
            width: 900,
            height: 900,
          },
          caption: "Caption",
        },
      ],
    }),
  ).toBe(3);
});

test.describe("Portable Text without JavaScript", () => {
  test.use({ javaScriptEnabled: false, reducedMotion: "no-preference" });

  test("rich text and images stay visible, semantic, and image-complete at every viewport", async ({
    page,
    baseURL,
  }, testInfo) => {
    await renderFixture(page, baseURL!);
    for (const viewport of [
      { name: "compact", width: 320, height: 740 },
      { name: "mobile", width: 390, height: 844 },
      { name: "small-desktop", width: 960, height: 1000 },
      { name: "desktop", width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(viewport);
      await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
      await expect(
        page.getByRole("heading", { level: 2, name: "A clear direction" }),
      ).toBeVisible();
      await expect(page.locator("main strong")).toHaveText("strong work");
      await expect(page.locator("main em")).toHaveText(" with emphasis");
      await expect(page.locator("main code")).toHaveText(" and inline code");
      await expect(page.locator("main del")).toHaveText(", revised");
      await expect(page.locator("main ol")).toHaveCount(2);
      await expect(page.locator("main ol > li > ol")).toHaveCount(1);
      await expect(
        page.getByRole("link", { name: ", connected." }),
      ).toHaveAttribute("rel", "noopener noreferrer");
      const image = page.getByRole("img", {
        name: "TACTIC architectural study",
      });
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (element: HTMLImageElement) =>
              element.complete && element.naturalWidth > 0,
          ),
        )
        .toBe(true);
      const layout = await page.evaluate(() => ({
        width: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        hiddenOrAnimated: Array.from(
          document.querySelectorAll("main, main *"),
        ).filter((element) => {
          const style = getComputedStyle(element);
          return style.opacity === "0" || style.animationName !== "none";
        }).length,
      }));
      expect(layout.scrollWidth).toBeLessThanOrEqual(layout.width);
      expect(layout.hiddenOrAnimated).toBe(0);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: testInfo.outputPath(`portable-text-${viewport.name}.png`),
        fullPage: true,
      });
    }
  });
});

async function renderFixture(page: Page, baseURL: string) {
  await page.goto("/blog", { waitUntil: "load" });
  const styles = await page
    .locator('link[rel="stylesheet"]')
    .evaluateAll((links) =>
      links.map((link) => (link as HTMLLinkElement).href),
    );
  const fontClasses = await page.locator("html").getAttribute("class");
  const markup = renderToStaticMarkup(
    createElement(DetailPage, { content: fixture }),
  );
  await page.setContent(
    `<!doctype html><html lang="en" class="${fontClasses ?? ""}"><head><base href="${baseURL}/">${styles.map((href) => `<link rel="stylesheet" href="${href}">`).join("")}</head><body id="top">${markup}</body></html>`,
    { waitUntil: "load" },
  );
}
