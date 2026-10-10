import { pages } from "../content/pages";
import { buildRss } from "../lib/rss";

export function GET() {
  return new Response(buildRss(pages), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
