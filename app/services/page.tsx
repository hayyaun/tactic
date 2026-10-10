import {
  contentMetadata,
  PublishedContent,
} from "../components/published-content";
export function generateMetadata() {
  return contentMetadata("/services");
}
export default function Page() {
  return <PublishedContent path="/services" />;
}
