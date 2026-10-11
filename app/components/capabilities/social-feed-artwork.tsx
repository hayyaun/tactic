import Image from "next/image";
import { TacticMark } from "../ui/icons";

export function SocialFeedArtwork() {
  return (
    <div
      className="social-feed-artwork relative mx-auto my-4 h-62 w-full max-w-85 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-carbon/50"
      role="img"
      aria-label="Social campaign concepts: a designed post, campaign artwork and a short film"
    >
      <div
        aria-hidden="true"
        className="social-feed-piece social-feed-strategy absolute top-1 right-0 h-40 w-[54%] rotate-9 overflow-hidden rounded-xl border border-carbon/10 bg-carbon shadow-[0_8px_24px_rgb(32_34_30/0.12)]"
      >
        <Image
          src="/studio/strategy.webp"
          alt=""
          fill
          sizes="220px"
          className="object-cover saturate-75"
        />
        <span className="absolute bottom-3 left-3 font-mono text-[7px] tracking-[0.06em] text-chalk">
          A DIFFERENT PERSPECTIVE.
        </span>
      </div>

      <div
        aria-hidden="true"
        className="social-feed-piece social-feed-post absolute top-5 left-1 z-1 w-[65%] -rotate-6 rounded-[14px] border border-carbon/10 bg-chalk p-3 text-carbon shadow-[0_12px_28px_rgb(32_34_30/0.13)]"
      >
        <div className="mb-2 flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-carbon text-chalk">
            <TacticMark className="h-3 w-2.25" />
          </span>
          <span className="text-[8px] font-medium tracking-[-0.02em]">
            tactic.studio
          </span>
          <span className="ml-auto text-[10px] tracking-[0.12em]">···</span>
        </div>
        <div className="relative flex h-38 items-center overflow-hidden rounded-lg bg-[rgb(198,211,174)] px-4">
          <TacticMark className="absolute -right-3 -bottom-6 h-36 w-26 rotate-12 opacity-[0.08]" />
          <p className="relative text-[30px] leading-[0.98] tracking-[-0.06em]">
            Worth
            <br />
            a second
            <br />
            <em className="font-editorial text-[34px] font-normal">look.</em>
          </p>
        </div>
        <svg
          className="mt-2.5 h-4 w-full"
          viewBox="0 0 190 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <path d="M8 14 2.5 8.7C-2 4.3 4-1 8 3c4-4 10 1.3 5.5 5.7Z" />
          <path d="M29 2a5.5 5.5 0 0 0-5.5 5.5c0 1.5.5 2.8 1.5 3.8l-1 3 3.3-1.1c.6.3 1.2.4 1.7.4a5.8 5.8 0 1 0 0-11.6Z" />
          <path d="m43 2 14 5-5 2-2 5-7-12Zm0 0 9 7" />
          <path d="M178 2h9v12l-4.5-3-4.5 3Z" />
        </svg>
      </div>

      <div
        aria-hidden="true"
        className="social-feed-piece social-feed-reel absolute right-0 bottom-0 z-2 h-42 w-[32%] rotate-7 overflow-hidden rounded-[13px] border border-chalk/30 bg-carbon shadow-[0_10px_24px_rgb(32_34_30/0.18)]"
      >
        <Image
          src="/studio/ai-campaign.png"
          alt=""
          fill
          sizes="300px"
          className="object-cover object-[51%_center] brightness-90 saturate-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-carbon/80 via-transparent to-carbon/20" />
        <span className="absolute top-3 left-3 font-mono text-[7px] text-chalk/85">
          IN MOTION
        </span>
        <svg
          className="absolute top-1/2 left-1/2 h-7 w-7 -translate-1/2 text-chalk"
          viewBox="0 0 28 28"
          fill="none"
        >
          <circle cx="14" cy="14" r="13" stroke="currentColor" opacity=".6" />
          <path d="m11 9 8 5-8 5Z" fill="currentColor" />
        </svg>
        <p className="absolute bottom-3 left-3 text-[10px] leading-[1.1] tracking-[-0.035em] text-chalk">
          A feeling.
          <br />
          In fifteen seconds.
        </p>
      </div>
      <span
        aria-hidden="true"
        className="social-feed-piece social-feed-save absolute bottom-0 left-6 z-3 rounded-full border border-carbon/10 bg-chalk px-3 py-2 text-[9px] tracking-[-0.02em] text-carbon shadow-[0_4px_12px_rgb(32_34_30/0.08)]"
      >
        That’s a save.
      </span>
    </div>
  );
}
