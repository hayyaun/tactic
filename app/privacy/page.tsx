import type { Metadata } from "next";
import { cacheLife } from "next/cache";
import { ContentPage } from "../components/content-page";
import { loadPublishedPages } from "../content/load-pages";
import { defaultPrivacyContent } from "../content/privacy";
import { metadataForContent } from "../lib/content-metadata";

async function getPublishedPrivacyContent() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  return (await loadPublishedPages()).find(
    (page) => page.path === "/privacy" && page.kind === "privacy",
  );
}

export async function generateMetadata(): Promise<Metadata> {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  const content = await getPublishedPrivacyContent();
  return content
    ? metadataForContent(content)
    : {
        title: "Privacy notice",
        description:
          "How TACTIC handles enquiries, optional recordings, and error reporting.",
        alternates: { canonical: "/privacy" },
      };
}

export default async function PrivacyPage() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  const content = (await getPublishedPrivacyContent()) ?? defaultPrivacyContent;
  return <ContentPage content={content} />;
}
