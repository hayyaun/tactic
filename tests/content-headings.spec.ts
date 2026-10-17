import { expect, test } from "@playwright/test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { ContentBlock, ContentPage } from "../app/content/types";
import { contentHeadings } from "../app/lib/content-headings";
import { ContentPage as DetailPage } from "../app/components/content-page";

function heading(key: string, title: string, style = "h2"): ContentBlock {
  return {
    type: "portableText",
    value: {
      _key: key,
      _type: "block",
      style,
      children: [
        { _type: "span", _key: `${key}-text`, text: title, marks: [] },
      ],
      markDefs: [],
    },
  };
}

test("heading anchors stay unique for repeated titles, accents and non-Latin text", () => {
  const blocks = [
    heading("first", "A direction"),
    heading("second", "A direction 2"),
    heading("repeat", "A direction", "h3"),
    heading("accent", "Café & design"),
    heading("persian", "طراحی روشن"),
    heading("symbols", "✨"),
    heading("paragraph", "Ordinary text", "normal"),
    heading("empty", "  "),
  ];
  const headings = contentHeadings(blocks);
  expect(headings).toHaveLength(6);
  expect(new Set(headings.map(({ id }) => id)).size).toBe(6);
  expect(headings[2]).toMatchObject({ id: "section-a-direction-3", level: 3 });
  expect(headings[3].id).toBe("section-cafe-design");
  expect(headings[4].id).toBe("section-طراحی-روشن");
  expect(contentHeadings(blocks)).toEqual(headings);
});

test("article contents links target the rendered headings, including formatted titles", () => {
  const blocks: ContentBlock[] = [
    heading("intro", "An introduction", "normal"),
    {
      type: "portableText",
      value: {
        _key: "formatted",
        _type: "block",
        style: "h2",
        children: [
          { _key: "first", _type: "span", text: "Start ", marks: [] },
          { _key: "bold", _type: "span", text: "clearly", marks: ["strong"] },
        ],
        markDefs: [],
      },
    },
    heading("next", "Next steps", "h3"),
    {
      type: "image",
      image: {
        src: "/studio/strategy.webp",
        alt: "A strategy study",
        width: 800,
        height: 600,
      },
    },
    {
      type: "portableText",
      value: {
        _type: "block",
        style: "h2",
        children: [
          {
            _type: "span",
            text: "A heading without an editorial key",
            marks: [],
          },
        ],
        markDefs: [],
      },
    },
  ];
  const content: ContentPage = {
    path: "/blog/a-clear-direction",
    kind: "article",
    status: "published",
    title: "A clear direction",
    description: "A considered approach to design.",
    publishedAt: "2026-10-17T12:00:00Z",
    blocks,
  };
  const markup = renderToStaticMarkup(createElement(DetailPage, { content }));
  expect(markup).toContain('aria-label="Table of contents"');
  for (const item of contentHeadings(blocks)) {
    expect(markup).toContain(`href="#${encodeURIComponent(item.id)}"`);
    expect(markup).toContain(`<h${item.level} id="${item.id}"`);
  }
  expect(markup).toContain("Start <strong");
  expect(
    renderToStaticMarkup(
      createElement(DetailPage, {
        content: { ...content, kind: "service", path: "/services/design" },
      }),
    ),
  ).not.toContain('aria-label="Table of contents"');
});
