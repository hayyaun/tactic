import type { ContentPage } from "../content/types";
import { publishedArticles } from "../content/pages";
import { absoluteUrl, site } from "./site";

function xml(value: string) {
  return value.replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!,
  );
}

export function buildRss(entries: readonly ContentPage[]) {
  const items = publishedArticles(entries)
    .map(
      (article) =>
        `<item><title>${xml(article.title)}</title><link>${xml(absoluteUrl(article.path))}</link><guid isPermaLink="true">${xml(absoluteUrl(article.path))}</guid><description>${xml(article.description)}</description><pubDate>${new Date(article.publishedAt!).toUTCString()}</pubDate></item>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel><title>TACTIC Journal</title><link>${site.url}</link><description>${xml(site.description)}</description><language>en</language><atom:link href="${site.url}/rss.xml" rel="self" type="application/rss+xml"/>${items}</channel></rss>`;
}
