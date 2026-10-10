import {
  contentMetadata,
  PublishedContent,
} from "../components/published-content";
export function generateMetadata() {
  return contentMetadata("/about");
}
export default function Page() {
  return <PublishedContent path="/about" />;
}
