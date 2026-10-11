import Link from "next/link";
import { HeroArt } from "../hero-art";
import { HeroPreview } from "../hero-preview";
import { ActionLink } from "../ui/action";
import { DirectionArrow } from "../ui/icons";

export function HeroSection() {
  return (
    <section
      className="hero-atmosphere relative isolate flex h-svh min-h-220 flex-col items-center overflow-hidden bg-background px-5 pt-33 pb-0 text-center min-[360px]:px-6 min-[600px]:pt-36.5 min-[960px]:pt-37.5 [@media(max-height:_740px)_and_(max-width:_700px)]:min-h-140 [@media(max-height:_740px)_and_(max-width:_700px)]:pt-26.25"
      aria-labelledby="hero-title"
    >
      <div
        className="absolute bottom-7.75 left-8 z-2 flex flex-col items-start gap-2.5 min-[960px]:bottom-8.75 min-[960px]:left-[max(56px,-630px+50vw)] [@media(max-height:_740px)_and_(max-width:_700px)]:bottom-4.5 [@media(max-height:_740px)_and_(max-width:_700px)]:left-6"
        aria-label="TACTIC creative studio"
      >
        <span className="text-[9px] font-[450] tracking-[0.28em] text-[rgb(179,190,176)]">
          TACTIC
        </span>
        <span className="font-mono text-[7px] tracking-[0.045em] text-muted min-[600px]:text-[8px] [@media(max-height:_740px)_and_(max-width:_700px)]:hidden">
          Independent minds. Shared direction.
        </span>
      </div>
      <div className="relative z-1 w-full max-w-200 min-[960px]:max-w-295">
        <p className="mb-4.25 flex items-center justify-center gap-2.5 font-mono text-[7px] leading-[1.7] font-normal tracking-[0.14em] text-muted uppercase min-[360px]:text-[8px] min-[600px]:mb-4.5 min-[600px]:text-[9px] [@media(max-height:_740px)_and_(max-width:_700px)]:mb-2.25 [@media(max-height:_740px)_and_(max-width:_700px)]:text-[7px]">
          Strategy. Design. Technology.
        </p>
        <h1
          className="text-[37px] leading-[1.08] font-[380] tracking-[-0.055em] min-[360px]:text-[clamp(40px,11.2vw,72px)] min-[600px]:text-[clamp(60px,7vw,82px)] min-[960px]:flex min-[960px]:flex-wrap min-[960px]:justify-center min-[960px]:gap-[0.2em] min-[960px]:text-[clamp(54px,4.8vw,76px)] [@media(max-height:_740px)_and_(max-width:_700px)]:text-[34px]"
          id="hero-title"
        >
          Make your next
          <br className="min-[960px]:hidden" />
          <span className="inline-block">
            move matter<span className="text-green">.</span>
          </span>
        </h1>
        <p className="mt-4.25 text-[12px] leading-[1.85] text-muted min-[600px]:mt-4 min-[600px]:text-[13px] [@media(max-height:_740px)_and_(max-width:_700px)]:mt-2.5 [@media(max-height:_740px)_and_(max-width:_700px)]:text-[10px] [@media(max-height:_740px)_and_(max-width:_700px)]:leading-[1.7]">
          Distinctive brands. Thoughtful experiences.
          <br />A little imagination. A clear direction.
        </p>
        <ActionLink preset="hero" href="#capabilities">
          Discover what we do <DirectionArrow />
        </ActionLink>
      </div>

      <HeroArt>
        <HeroPreview />
      </HeroArt>
      <div className="absolute right-8 bottom-7.75 z-2 min-[960px]:right-[max(56px,-630px+50vw)] min-[960px]:bottom-8.75 [@media(max-height:_740px)_and_(max-width:_700px)]:right-6 [@media(max-height:_740px)_and_(max-width:_700px)]:bottom-4.5">
        <Link
          className="flex flex-row items-center gap-3.25 font-mono text-[8px] tracking-[0.06em] text-muted"
          href="#capabilities"
          aria-label="Scroll to what we do"
        >
          A little further{" "}
          <DirectionArrow
            direction="down"
            className="font-sans text-[16px] text-green"
          />
        </Link>
      </div>
    </section>
  );
}
