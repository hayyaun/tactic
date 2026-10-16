import { Suspense } from "react";
import {
  contentMetadata,
  ContentDetail,
} from "../../components/published-content";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return contentMetadata(`/blog/${(await params).slug}`);
}
export default function Page({ params }: Props) {
  return (
    <Suspense fallback={null}>
      <ContentDetail params={params} section="blog" />
    </Suspense>
  );
}
