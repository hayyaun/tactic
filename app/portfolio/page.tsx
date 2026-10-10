import {
  contentMetadata,
  PublishedContent,
} from "../components/published-content";
export function generateMetadata() {
  return contentMetadata("/portfolio");
}
export default function Page() {
  return <PublishedContent path="/portfolio" />;
}
