import Link from "next/link";
import { ArrowUpRight, TacticMark } from "./ui/icons";

export function SiteHeader({ active }: { active?: "journal" | "studio" }) {
  return (
    <>
      <a
        href="#page-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-6 focus:z-50 focus:bg-foreground focus:p-4 focus:text-background"
      >
        Skip to content
      </a>
      <header className="studio-container flex min-h-24 flex-wrap items-center justify-between gap-x-5 gap-y-4 border-b border-line py-5 min-[600px]:min-h-28">
        <Link
          href="/"
          aria-label="TACTIC home"
          className="flex items-center gap-2.5 text-[20px] font-[550]"
        >
          <TacticMark className="h-7 w-5 text-green" />
          TACTIC
        </Link>
        <nav
          aria-label="Main navigation"
          className="flex flex-wrap items-center gap-5 text-[12px] min-[600px]:gap-9"
        >
          <Link
            href="/#capabilities"
            className="hidden text-muted hover:text-foreground min-[960px]:block"
          >
            What we do
          </Link>
          <Link
            href="/#studio"
            aria-current={active === "studio" ? "page" : undefined}
            className="hidden text-muted hover:text-foreground aria-[current=page]:text-green min-[600px]:block"
          >
            The studio
          </Link>
          <Link
            href="/blog"
            aria-current={active === "journal" ? "page" : undefined}
            className="text-muted hover:text-foreground aria-[current=page]:text-green"
          >
            Journal
          </Link>
          <Link
            href="/#contact"
            className="inline-flex min-h-11 items-center justify-center gap-4 rounded-full bg-foreground px-5 text-background hover:bg-green"
          >
            Let&apos;s talk <ArrowUpRight className="size-3" />
          </Link>
        </nav>
      </header>
    </>
  );
}
