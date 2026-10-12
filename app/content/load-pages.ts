import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { client } from "../sanity/client";
import { PUBLISHED_CONTENT_QUERY } from "../sanity/queries";
import { toContentPage } from "../sanity/transform";
import { publishedPages } from "./pages";

export async function loadPublishedPages() {
  "use cache";
  cacheLife({ stale: 30, revalidate: 30, expire: 3600 });
  cacheTag("sanity:contentPage");

  const documents = await client.fetch(
    PUBLISHED_CONTENT_QUERY,
    {},
    {
      cache: "no-store",
    },
  );
  const entries = new Map(publishedPages().map((page) => [page.path, page]));
  // Newest CMS entries take precedence over the repository collection.
  const cmsPaths = new Set<string>();
  for (const document of documents) {
    const page = toContentPage(document);
    if (page && !cmsPaths.has(page.path)) {
      entries.set(page.path, page);
      cmsPaths.add(page.path);
    }
  }
  return [...entries.values()];
}
