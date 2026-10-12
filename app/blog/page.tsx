import { cacheLife } from "next/cache";
import { BlogListing } from "../components/blog-listing";
import { metadataForContent } from "../components/published-content";
import { getBlogArticles, getBlogListingContent } from "../content/blog";
import { loadPublishedPages } from "../content/load-pages";

export async function generateMetadata() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  return metadataForContent(getBlogListingContent(await loadPublishedPages()));
}

export default async function Page() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  const pages = await loadPublishedPages();
  return (
    <BlogListing
      content={getBlogListingContent(pages)}
      entries={getBlogArticles(pages)}
    />
  );
}
