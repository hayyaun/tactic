import Image from "next/image";
import Link from "next/link";
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
}: {
  content: PageContent;
  children?: ReactNode;
}) {
  const article = articleSchema(content);
  const breadcrumbs = [
    { name: "Home", path: "/" },
    { name: content.title, path: content.path },
  ];
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
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:block focus:p-4"
      >
        Skip to content
      </a>
      <header className="studio-container flex items-center justify-between border-b border-line py-6">
        <Link href="/" className="text-xl font-medium">
          TACTIC
        </Link>
        <Link
          href="/#contact"
          className="text-sm text-muted hover:text-foreground"
        >
          Start a conversation ↗
        </Link>
      </header>
      <main
        id="page-content"
        className="studio-container py-16 min-[960px]:py-24"
      >
        <div className="max-w-3xl">
          {content.eyebrow && (
            <p className="mb-5 font-mono text-xs tracking-wider text-green uppercase">
              {content.eyebrow}
            </p>
          )}
          <h1 className="text-4xl leading-tight tracking-tight min-[600px]:text-6xl">
            {content.title}
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {content.description}
          </p>
          {content.publishedAt && (
            <p className="mt-4 text-sm text-muted">
              <time dateTime={content.publishedAt}>
                {content.publishedAt.slice(0, 10)}
              </time>
              {content.author ? ` · ${content.author}` : ""}
            </p>
          )}
        </div>
        {content.hero && (
          <Image
            {...content.hero}
            alt={content.hero.alt}
            className="mt-10 h-auto w-full rounded-xl"
            sizes="(max-width: 960px) 100vw, 1280px"
          />
        )}
        <div className="mt-12 max-w-3xl space-y-7 text-base leading-relaxed">
          {content.blocks.map((block, index) => {
            switch (block.type) {
              case "heading":
                return (
                  <h2 key={index} className="pt-5 text-2xl tracking-tight">
                    {block.text}
                  </h2>
                );
              case "paragraph":
                return (
                  <p key={index} className="text-muted">
                    {block.text}
                  </p>
                );
              case "list":
                return (
                  <ul
                    key={index}
                    className="list-disc space-y-2 pl-6 text-muted"
                  >
                    {block.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                );
              case "image":
                return (
                  <figure key={index}>
                    <Image
                      {...block.image}
                      alt={block.image.alt}
                      className="h-auto rounded-xl"
                      sizes="(max-width: 960px) 100vw, 768px"
                    />
                    {block.caption && (
                      <figcaption className="mt-3 text-sm text-muted">
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
            }
          })}
        </div>
        {children}
      </main>
      <footer className="studio-container border-t border-line py-8">
        <Link href="/" className="text-sm text-muted hover:text-foreground">
          Back to TACTIC
        </Link>
      </footer>
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
      <ul className="mt-12 grid gap-8 min-[600px]:grid-cols-2">
        {entries.map((entry) => (
          <li key={entry.path}>
            <Link
              href={entry.path}
              className="group block border-t border-line py-6"
            >
              {entry.hero && (
                <Image
                  {...entry.hero}
                  alt={entry.hero.alt}
                  className="mb-5 h-auto w-full rounded-xl"
                  sizes="(max-width: 600px) 100vw, 640px"
                />
              )}
              <h2 className="text-2xl group-hover:text-green">{entry.title}</h2>
              <p className="mt-3 leading-relaxed text-muted">
                {entry.description}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </ContentPage>
  );
}
