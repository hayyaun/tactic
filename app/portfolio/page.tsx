import {
  contentMetadata,
  PublishedContent,
} from "../components/published-content";
export function generateMetadata() {
  return contentMetadata("/portfolio");
}
export default async function Page() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  return <PublishedContent path="/portfolio" />;
}
import { cacheLife } from "next/cache";
