import {
  contentMetadata,
  PublishedContent,
} from "../components/published-content";
export function generateMetadata() {
  return contentMetadata("/contact");
}
export default function Page() {
  return <PublishedContent path="/contact" />;
}
