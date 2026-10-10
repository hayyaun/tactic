import { Suspense } from "react";
import {
  contentMetadata,
  ContentDetail,
} from "../../components/published-content";
import Loading from "../../loading";
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) {
  return contentMetadata(`/portfolio/${(await params).slug}`);
}
export default function Page({ params }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      <ContentDetail params={params} section="portfolio" />
    </Suspense>
  );
}
