import Link from "next/link";
import { DirectionArrow } from "./ui/icons";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <div className="studio-container grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-5 py-8 min-[600px]:flex min-[600px]:flex-wrap min-[600px]:justify-between min-[600px]:py-10">
        <Link
          href="/"
          className="text-[26px] font-[450] text-green"
          aria-label="TACTIC home"
        >
          TACTIC
        </Link>
        <p className="order-last col-span-2 pl-32 text-right font-mono text-[10px] leading-relaxed text-muted min-[600px]:order-none min-[600px]:pl-0 min-[600px]:text-left">
          Independent minds. Collective ambition.
        </p>
        <Link
          href="/rss.xml"
          className="inline-flex min-h-11 items-center gap-3 text-[12px] text-muted hover:text-foreground"
        >
          RSS feed <DirectionArrow className="text-green" />
        </Link>
      </div>
    </footer>
  );
}
