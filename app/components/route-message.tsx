import Link from "next/link";
import type { ReactNode } from "react";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ArrowUpRight } from "./ui/icons";

export function RouteMessage({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <main
        id="page-content"
        tabIndex={-1}
        className="studio-container flex min-h-[60svh] flex-col justify-center py-16 min-[960px]:py-24"
      >
        <h1 className="max-w-3xl text-[40px] leading-[1.15] font-[380] wrap-anywhere min-[600px]:text-[64px]">
          {title}
        </h1>
        <div className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          {children}
        </div>
        <div className="mt-8 flex flex-wrap items-center gap-6">
          {action}
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-4 rounded-full border border-line px-6 py-3 text-sm hover:border-green"
          >
            Back to home <ArrowUpRight className="size-4 text-green" />
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
