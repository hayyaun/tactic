import Image from "next/image";
import Link from "next/link";
import type { ContentPage } from "../content/types";
import { articleReadingMinutes } from "../content/blog";
import { breadcrumbSchema, serializeJsonLd } from "../lib/structured-data";
import { ContentBlocks } from "./content-blocks";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ArrowUpRight } from "./ui/icons";

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function ArticleMeta({ article }: { article: ContentPage }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] leading-relaxed text-muted">
      {article.publishedAt && (
        <time dateTime={article.publishedAt}>
          {dateFormat.format(new Date(article.publishedAt))}
        </time>
      )}
      <span>{articleReadingMinutes(article)} min read</span>
      {article.author && <span>{article.author}</span>}
    </div>
  );
}

function FeaturedArticle({ article }: { article: ContentPage }) {
  return (
    <article className="border-b border-line pb-10 min-[960px]:pb-14">
      <Link
        href={article.path}
        className={`group grid items-center gap-7 min-[600px]:gap-10 ${article.hero ? "min-[960px]:grid-cols-[1.2fr_1fr] min-[960px]:gap-16" : "max-w-4xl"}`}
      >
        {article.hero && (
          <div className="aspect-[16/10] overflow-hidden rounded-lg bg-foreground/3">
            <Image
              {...article.hero}
              alt={article.hero.alt}
              className="h-full w-full object-cover"
              sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 960px) calc(100vw - 80px), (max-width: 1440px) 52vw, 672px"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        )}
        <div className="min-w-0">
          <p className="mb-5 font-mono text-[11px] text-green uppercase">
            Latest article
          </p>
          <h2 className="text-[30px] leading-[1.2] font-[400] wrap-anywhere group-hover:text-green min-[600px]:text-[38px] min-[960px]:text-[42px]">
            {article.title}
          </h2>
          <p className="mt-5 max-w-lg text-[15px] leading-[1.8] wrap-anywhere text-muted">
            {article.description}
          </p>
          <div className="mt-6">
            <ArticleMeta article={article} />
          </div>
          <span className="mt-8 inline-flex items-center gap-5 text-[12px]">
            Read article
            <ArrowUpRight className="size-4 text-green" />
          </span>
        </div>
      </Link>
    </article>
  );
}

function ArchiveArticle({ article }: { article: ContentPage }) {
  return (
    <li className="border-b border-line">
      <article>
        <Link
          href={article.path}
          className={`group grid items-center gap-5 py-7 min-[600px]:gap-8 min-[600px]:py-8 ${article.hero ? "grid-cols-[80px_minmax(0,1fr)] min-[600px]:grid-cols-[184px_minmax(0,1fr)_24px]" : "grid-cols-[minmax(0,1fr)_24px]"}`}
        >
          {article.hero && (
            <div className="aspect-square overflow-hidden rounded-lg bg-foreground/3 min-[600px]:aspect-[3/2]">
              <Image
                {...article.hero}
                alt={article.hero.alt}
                className="h-full w-full object-cover"
                sizes="(max-width: 600px) 80px, 184px"
              />
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-[20px] leading-[1.35] font-[400] wrap-anywhere group-hover:text-green min-[600px]:text-[28px]">
              {article.title}
            </h2>
            <p className="mt-3 line-clamp-2 max-w-2xl text-[14px] leading-[1.8] wrap-anywhere text-muted">
              {article.description}
            </p>
            <div className="mt-4">
              <ArticleMeta article={article} />
            </div>
          </div>
          <ArrowUpRight
            className={`size-5 text-muted group-hover:text-green ${article.hero ? "hidden min-[600px]:block" : ""}`}
          />
        </Link>
      </article>
    </li>
  );
}

export function BlogListing({
  content,
  entries,
}: {
  content: ContentPage;
  entries: readonly ContentPage[];
}) {
  const [featured, ...archive] = entries;
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: content.title, path: "/blog" },
            ]),
          ),
        }}
      />
      <SiteHeader active="journal" />
      <main
        id="page-content"
        tabIndex={-1}
        className="studio-container min-h-[60svh] pb-16 min-[960px]:pb-24"
      >
        <section
          aria-labelledby="journal-title"
          className="pt-12 pb-10 min-[600px]:pt-16 min-[960px]:pt-20 min-[960px]:pb-14"
        >
          <p className="font-mono text-[11px] text-green uppercase">
            {content.eyebrow || "TACTIC / Journal"}
          </p>
          <div className="mt-6 grid items-end gap-6 min-[960px]:grid-cols-[1.3fr_1fr] min-[960px]:gap-16">
            <h1
              id="journal-title"
              className="text-[48px] leading-[1.05] font-[380] wrap-anywhere min-[600px]:text-[72px] min-[960px]:text-[92px]"
            >
              {content.title}
              <span className="text-green">.</span>
            </h1>
            <p className="max-w-md text-[16px] leading-[1.8] wrap-anywhere text-muted min-[600px]:text-[18px]">
              {content.description}
            </p>
          </div>
          {(content.hero || content.blocks.length > 0) && (
            <div className="mt-10 max-w-3xl space-y-7 text-base leading-relaxed">
              {content.hero && (
                <Image
                  {...content.hero}
                  alt={content.hero.alt}
                  className="h-auto w-full rounded-lg"
                  sizes="(max-width: 960px) calc(100vw - 48px), 768px"
                />
              )}
              <ContentBlocks blocks={content.blocks} />
            </div>
          )}
        </section>
        <section aria-labelledby="articles-title">
          <div className="mb-7 flex items-center justify-between gap-4 border-t border-line pt-6 font-mono text-[11px] text-muted min-[960px]:mb-9">
            <h2 id="articles-title" className="font-normal uppercase">
              The latest thinking
            </h2>
            <span className="shrink-0 tabular-nums">
              {String(entries.length).padStart(2, "0")}{" "}
              {entries.length === 1 ? "article" : "articles"}
            </span>
          </div>
          {featured ? (
            <>
              <FeaturedArticle article={featured} />
              {archive.length > 0 && (
                <ul aria-label="More articles">
                  {archive.map((article) => (
                    <ArchiveArticle key={article.path} article={article} />
                  ))}
                </ul>
              )}
            </>
          ) : (
            <div className="grid items-center gap-8 border-b border-line pb-10 min-[600px]:grid-cols-[1fr_1fr] min-[960px]:gap-16 min-[960px]:pb-14">
              <div className="aspect-[16/10] overflow-hidden rounded-lg bg-foreground/3">
                <Image
                  src="/studio/architecture.webp"
                  alt="TACTIC brand study with intersecting green and red structures."
                  width={900}
                  height={900}
                  className="h-full w-full object-cover"
                  sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 1440px) 45vw, 608px"
                  loading="eager"
                />
              </div>
              <div>
                <h3 className="text-[28px] leading-tight font-[400] min-[960px]:text-[34px]">
                  No articles yet.
                </h3>
                <p className="mt-4 max-w-sm text-[15px] leading-[1.8] text-muted">
                  New perspectives will find their home here. In the meantime,
                  get to know the studio behind the work.
                </p>
                <Link
                  href="/#studio"
                  className="mt-7 inline-flex min-h-11 items-center gap-5 text-[12px] hover:text-green"
                >
                  Meet TACTIC <ArrowUpRight className="size-4 text-green" />
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
