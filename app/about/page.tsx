import {
  contentMetadata,
  PublishedContent,
} from "../components/published-content";
export function generateMetadata() {
  return contentMetadata("/about");
}
export default async function Page() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  return <PublishedContent path="/about" />;
}
import { cacheLife } from "next/cache";
