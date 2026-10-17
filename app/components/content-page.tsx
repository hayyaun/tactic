import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "./ui/icons";
import { ContentBlocks } from "./content-blocks";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { Breadcrumbs } from "./breadcrumbs";
import { ArticleToc } from "./article-toc";
import { contentHeadings } from "../lib/content-headings";
import {
  contentBreadcrumbs,
  type Breadcrumb,
} from "../lib/content-breadcrumbs";
import type { ReactNode } from "react";
import type { ContentPage as PageContent } from "../content/types";
import {
  articleSchema,
  breadcrumbSchema,
  serializeJsonLd,
} from "../lib/structured-data";

export function ContentPage({
  content,
  children,
  breadcrumbs = contentBreadcrumbs(content),
}: {
  content: PageContent;
  children?: ReactNode;
  breadcrumbs?: readonly Breadcrumb[];
}) {
  const article = articleSchema(content);
  const headings =
    content.kind === "article" ? contentHeadings(content.blocks) : [];
  const showToc = headings.length > 1;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbs)),
        }}
      />
      {article && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(article) }}
        />
      )}
      <SiteHeader
        active={content.path.startsWith("/blog") ? "journal" : undefined}
      />
      <main
        id="page-content"
        tabIndex={-1}
        className="studio-container min-h-[60svh] pb-16 min-[960px]:pb-24"
      >
        <section className="pt-12 min-[600px]:pt-16 min-[960px]:pt-20">
          <Breadcrumbs items={breadcrumbs} />
          <div className="mt-6 grid items-end gap-6 min-[960px]:grid-cols-[1.3fr_1fr] min-[960px]:gap-16">
            <h1
              className={`min-w-0 leading-[1.1] font-[380] wrap-anywhere ${content.kind === "article" ? "text-[40px] min-[600px]:text-[58px] min-[960px]:text-[72px]" : "text-[48px] min-[600px]:text-[72px] min-[960px]:text-[92px]"}`}
            >
              {content.title}
            </h1>
            <p className="max-w-md text-[16px] leading-[1.8] wrap-anywhere text-muted min-[600px]:text-[18px]">
              {content.description}
            </p>
          </div>
          {content.publishedAt && (
            <p className="mt-6 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] leading-relaxed wrap-anywhere text-muted">
              <time dateTime={content.publishedAt}>
                {content.publishedAt.slice(0, 10)}
              </time>
              {content.author && <span>{content.author}</span>}
            </p>
          )}
        </section>
        {content.hero && (
          <Image
            {...content.hero}
            alt={content.hero.alt}
            className="mt-10 h-auto w-full rounded-lg min-[600px]:mt-12"
            sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 960px) calc(100vw - 80px), (max-width: 1424px) calc(100vw - 144px), 1280px"
            loading="eager"
          />
        )}
        {content.blocks.length > 0 && (
          <div
            className={`mt-10 min-[600px]:mt-12 ${showToc ? "grid items-start gap-8 min-[960px]:grid-cols-[minmax(0,3fr)_minmax(14rem,1fr)] min-[960px]:gap-16" : "max-w-3xl space-y-7"}`}
          >
            {showToc && (
              <aside className="min-w-0 self-stretch min-[960px]:col-start-2 min-[960px]:row-start-1">
                <ArticleToc headings={headings} />
              </aside>
            )}
            <div className="max-w-3xl min-w-0 space-y-7 min-[960px]:col-start-1 min-[960px]:row-start-1">
              <ContentBlocks blocks={content.blocks} />
            </div>
          </div>
        )}
        {children}
      </main>
      <SiteFooter />
    </>
  );
}

export function ContentListing({
  content,
  entries,
}: {
  content: PageContent;
  entries: readonly PageContent[];
}) {
  return (
    <ContentPage content={content}>
      <section
        aria-label={content.path === "/services" ? "Services" : "Projects"}
        className="mt-12 min-[960px]:mt-16"
      >
        {entries.length > 0 ? (
          <ul className="grid gap-x-10 min-[600px]:grid-cols-2 min-[960px]:gap-x-16">
            {entries.map((entry, index) => (
              <li key={entry.path} className="min-w-0 border-t border-line">
                <Link
                  href={entry.path}
                  className="group block h-full py-7 min-[600px]:py-9"
                >
                  {entry.hero && (
                    <div className="mb-6 aspect-[3/2] overflow-hidden rounded-lg bg-foreground/3">
                      <Image
                        {...entry.hero}
                        alt={entry.hero.alt}
                        className="h-full w-full object-cover"
                        sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 960px) calc((100vw - 120px) / 2), (max-width: 1424px) calc((100vw - 208px) / 2), 608px"
                      />
                    </div>
                  )}
                  <div className="mb-4 flex items-center justify-between gap-4 font-mono text-[11px] text-green">
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <ArrowUpRight className="size-4" />
                  </div>
                  <h2 className="text-[26px] leading-[1.25] font-[400] wrap-anywhere group-hover:text-green min-[960px]:text-[34px]">
                    {entry.title}
                  </h2>
                  <p className="mt-4 text-[15px] leading-[1.8] wrap-anywhere text-muted">
                    {entry.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="border-y border-line py-10 min-[960px]:py-14">
            <h2 className="text-[26px] leading-tight font-[400] min-[960px]:text-[34px]">
              {content.path === "/services"
                ? "No services yet."
                : "No projects yet."}
            </h2>
          </div>
        )}
      </section>
    </ContentPage>
  );
}
