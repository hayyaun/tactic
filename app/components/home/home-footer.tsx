import Link from "next/link";

export function HomeFooter() {
  return (
    <footer className="studio-container overflow-hidden pt-15 pb-7 min-[960px]:pt-19.5 min-[960px]:pb-8.75">
      <Link
        className="block w-fit text-[clamp(72px,23vw,345px)] leading-[0.96] font-[420] tracking-[-0.068em] text-[rgb(160,177,154)]"
        href="#top"
        aria-label="TACTIC — back to top"
      >
        TACTIC
      </Link>
      <div className="mt-9.25 flex flex-wrap justify-between gap-[16px_22px] font-mono text-[8px] leading-[1.7] font-normal tracking-[0.01em] text-muted min-[960px]:mt-12.25 min-[960px]:text-[9px]">
        <span className="flex-[0_0_100%] min-[960px]:flex-[0_0_auto]">
          Independent minds. Collective ambition.
        </span>
        <span>
          © <span id="year">2026</span> TACTIC Studio
        </span>
        <Link className="hover:text-foreground" href="#top">
          Back to top ↑
        </Link>
      </div>
    </footer>
  );
}
