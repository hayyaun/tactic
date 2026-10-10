import Link from "next/link";
import type { ReactNode } from "react";

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
    <main className="studio-container flex min-h-svh flex-col justify-center py-16">
      <Link href="/" className="mb-12 w-fit text-sm font-medium text-green">
        TACTIC
      </Link>
      <h1 className="max-w-3xl text-4xl leading-tight tracking-tight min-[600px]:text-6xl">
        {title}
      </h1>
      <div className="mt-6 max-w-xl text-base leading-relaxed text-muted">
        {children}
      </div>
      <div className="mt-8 flex flex-wrap items-center gap-6">
        {action}
        <Link
          href="/"
          className="rounded-full border border-line px-6 py-3 text-sm hover:border-green"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}
