import Image from "next/image";
import Link from "next/link";
import { cacheLife } from "next/cache";
import { articleReadingMinutes, getBlogArticles } from "../../content/blog";
import { loadPublishedPages } from "../../content/load-pages";
import { SectionHeading } from "../section-heading";
import { SectionLabel } from "../studio-content";
import { ArrowUpRight, DirectionArrow } from "../ui/icons";

const dateFormat = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

export async function JournalSection() {
  "use cache";
  cacheLife({ stale: 300, revalidate: 30, expire: 3600 });
  const articles = getBlogArticles(await loadPublishedPages()).slice(0, 3);

  return (
    <section
      id="journal"
      aria-labelledby="home-journal-title"
      className="studio-container pt-25 min-[960px]:pt-36.25"
    >
      <SectionLabel label="05 / From the journal">
        <span className="hidden min-[600px]:inline">
          A few things on our mind.
        </span>
      </SectionLabel>
      <div className="mt-11 grid gap-11 min-[960px]:mt-14 min-[960px]:grid-cols-[0.8fr_1.4fr] min-[960px]:gap-20">
        <div>
          <SectionHeading id="home-journal-title" variant="world">
            Notes from
            <br />
            <span className="text-muted">the studio.</span>
          </SectionHeading>
          <p className="mt-6 max-w-65 text-[12px] leading-[1.9] text-muted min-[960px]:text-[13px]">
            Thoughts on design, identity, and the decisions behind the work.
          </p>
          <Link
            href="/blog"
            className="group/journal mt-7 inline-flex min-h-11 items-center gap-7 text-[12px] min-[960px]:mt-9"
          >
            Explore the journal
            <DirectionArrow className="size-8.25 rounded-full bg-foreground/7 text-[16px] transition-colors group-hover/journal:bg-foreground group-hover/journal:text-background group-focus-visible/journal:bg-foreground group-focus-visible/journal:text-background motion-reduce:transition-none" />
          </Link>
        </div>
        {articles.length > 0 ? (
          <ol
            aria-label="Latest journal articles"
            className="border-t border-line"
          >
            {articles.map((article) => (
              <li key={article.path} className="border-b border-line">
                <article>
                  <Link
                    href={article.path}
                    className="group/article flex items-center gap-5 py-6 min-[600px]:gap-7 min-[600px]:py-7"
                  >
                    {article.hero && (
                      <div className="aspect-[4/3] w-22 shrink-0 overflow-hidden rounded-lg bg-foreground/3 min-[600px]:w-32 min-[960px]:w-36">
                        <Image
                          {...article.hero}
                          alt={article.hero.alt}
                          className="h-full w-full object-cover"
                          sizes="(min-width: 960px) 144px, (min-width: 600px) 128px, 88px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      {article.eyebrow && (
                        <p className="mb-2.5 font-mono text-[8px] leading-relaxed tracking-wider text-green uppercase min-[600px]:text-[9px]">
                          {article.eyebrow}
                        </p>
                      )}
                      <h3 className="text-[18px] leading-[1.3] font-[380] tracking-[-0.025em] wrap-anywhere transition-colors group-hover/article:text-green group-focus-visible/article:text-green motion-reduce:transition-none min-[600px]:text-[23px] min-[960px]:text-[24px]">
                        {article.title}
                      </h3>
                      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[8px] leading-relaxed text-muted min-[600px]:text-[9px]">
                        <time dateTime={article.publishedAt}>
                          {dateFormat.format(new Date(article.publishedAt!))}
                        </time>
                        <span
                          aria-hidden="true"
                          className="size-0.5 rounded-full bg-muted"
                        />
                        <span>{articleReadingMinutes(article)} min read</span>
                      </div>
                    </div>
                    <ArrowUpRight className="hidden size-4 text-muted transition-colors group-hover/article:text-green group-focus-visible/article:text-green motion-reduce:transition-none min-[600px]:block" />
                  </Link>
                </article>
              </li>
            ))}
          </ol>
        ) : (
          <p className="border-t border-line pt-7 text-[14px] leading-relaxed text-muted">
            New notes are on their way. Good ideas need a little room to take
            shape.
          </p>
        )}
      </div>
    </section>
  );
}
