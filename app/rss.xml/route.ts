import { loadPublishedPages } from "../content/load-pages";
import { buildRss } from "../lib/rss";

export async function GET() {
  return new Response(buildRss(await loadPublishedPages()), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
