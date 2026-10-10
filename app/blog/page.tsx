import {
  contentMetadata,
  PublishedContent,
} from "../components/published-content";
export function generateMetadata() {
  return contentMetadata("/blog");
}
export default function Page() {
  return <PublishedContent path="/blog" />;
}
