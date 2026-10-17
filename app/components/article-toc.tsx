"use client";

import { useEffect, useState } from "react";
import type { ContentHeading } from "../lib/content-headings";
import { ChevronRight } from "./ui/icons";

export function ArticleToc({
  headings,
}: {
  headings: readonly ContentHeading[];
}) {
  const [activeId, setActiveId] = useState(headings[0]?.id);

  useEffect(() => {
    const elements = headings.map(({ id }) => document.getElementById(id));
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = headings[0]?.id;
      for (const heading of elements) {
        if (heading && heading.getBoundingClientRect().top <= 160)
          current = heading.id;
      }
      // A short final section can reach the page bottom before its heading reaches the activation line.
      if (
        Math.ceil(window.scrollY + window.innerHeight) >=
        document.documentElement.scrollHeight - 2
      )
        current = headings.at(-1)?.id ?? current;
      setActiveId(current);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [headings]);

  function links() {
    return (
      <ol className="space-y-1 border-l border-line">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${encodeURIComponent(heading.id)}`}
              aria-current={activeId === heading.id ? "location" : undefined}
              onClick={() => setActiveId(heading.id)}
              className={`-ml-px block border-l border-transparent py-2 text-[13px] leading-[1.65] wrap-anywhere text-muted transition-colors hover:text-foreground aria-[current=location]:border-green aria-[current=location]:text-green motion-reduce:transition-none ${heading.level === 3 ? "pl-7" : "pl-4"}`}
            >
              {heading.title}
            </a>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <nav
      aria-label="Table of contents"
      className="min-[960px]:sticky min-[960px]:top-12 min-[960px]:max-h-[calc(100svh-6rem)] min-[960px]:overflow-y-auto"
    >
      <details className="group border-y border-line min-[960px]:hidden">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 font-mono text-[10px] tracking-wider uppercase [&::-webkit-details-marker]:hidden">
          In this article
          <span className="flex items-center gap-3 text-muted">
            {headings.length} sections
            <ChevronRight className="size-3.5 rotate-90 group-open:rotate-270" />
          </span>
        </summary>
        <div className="pb-5">{links()}</div>
      </details>
      <div className="hidden min-[960px]:block">
        <p className="mb-5 font-mono text-[10px] tracking-wider text-foreground uppercase">
          In this article
        </p>
        {links()}
      </div>
    </nav>
  );
}
