import type { ReactNode } from "react";
import Image from "next/image";
import { ContactButton } from "./dialog-buttons";
function BoardCaption({ children }: { children: ReactNode }) {
  return (
    <span className="absolute bottom-4.25 left-5 font-mono text-[7px] leading-normal tracking-[0.03em] text-inherit opacity-60 min-[701px]:bottom-5 min-[701px]:left-6 min-[701px]:text-[10px]">
      {children}
    </span>
  );
}
function BoardNote({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3.75 font-mono text-[8px] leading-[1.8] tracking-[0.03em] text-muted min-[701px]:text-[9px] min-[701px]:leading-normal">
      {children}
    </p>
  );
}
function CapabilityIntro({
  title,
  description,
  index,
}: {
  title: string;
  description: string;
  index: string;
}) {
  return (
    <div className="mb-6 grid grid-cols-[1fr_auto] items-start gap-x-3.75 gap-y-3 min-[701px]:mb-7 min-[701px]:grid-cols-[1fr_1.3fr_auto] min-[701px]:gap-10">
      <h3 className="text-[22px] font-normal tracking-[-0.035em] min-[701px]:text-[23px]">
        {title}
      </h3>
      <p className="col-span-2 row-start-2 max-w-90 text-[12px] leading-[1.75] text-muted min-[701px]:col-auto min-[701px]:row-auto min-[701px]:max-w-100 min-[701px]:text-[13px]">
        {description}
      </p>
      <span className="col-start-2 row-start-1 pt-1.25 font-mono text-[10px] leading-normal tracking-[0.03em] text-muted min-[701px]:col-auto min-[701px]:row-auto">
        {index}
      </span>
    </div>
  );
}
export function Capabilities() {
  return (
    <section
      className="mx-auto my-30 w-[calc(100%-48px)] max-w-330 min-[600px]:w-[calc(100%-80px)] min-[701px]:my-[clamp(120px,14vw,220px)] min-[960px]:w-[calc(100%-144px)]"
      id="capabilities"
      aria-labelledby="abilities-title"
    >
      <div className="mb-8.75 max-w-192.5 min-[701px]:mb-14">
        <p className="mb-6 font-mono text-[10px] leading-normal tracking-[0.03em] text-muted min-[701px]:mb-8">
          01 / What we do
        </p>
        <h2
          className="text-[37px] leading-[1.09] font-normal tracking-[-0.055em] min-[381px]:text-[clamp(40px,5.6vw,76px)]"
          id="abilities-title"
        >
          A feeling.
          <br />
          <span className="text-muted">A whole new world.</span>
        </h2>
        <p className="mt-7 max-w-95 text-[13px] leading-[1.8] text-muted min-[701px]:text-[14px]">
          From the first idea to the last detail, we bring your brand into
          focus. Then into the world.
        </p>
      </div>

      <div>
        <CapabilityIntro
          title="Distinctive by design."
          description="Strategy, naming, identity and art direction. One considered language, wherever your brand shows up."
          index="01"
        />
        <div
          className="grid grid-cols-[repeat(2,minmax(0px,1fr))] grid-rows-[190px_230px_145px_110px] gap-2.25 text-carbon min-[701px]:grid-cols-[repeat(12,minmax(0px,1fr))] min-[701px]:grid-rows-[230px_180px_145px] min-[701px]:gap-3 min-[1440px]:grid-rows-[260px_210px_160px]"
          aria-label="TACTIC identity concept board"
        >
          <div className="relative col-[1/3] row-start-1 flex min-w-0 items-center justify-center gap-4.75 overflow-hidden rounded-[19px] border border-board-line bg-chalk p-6 text-[rgb(39,46,36)] min-[381px]:gap-6.25 min-[381px]:p-7.5 min-[701px]:col-[1/9] min-[701px]:row-auto min-[701px]:rounded-[25px] min-[1001px]:gap-8.75 min-[1001px]:p-11">
            <svg
              className="h-12 w-8.75 min-[381px]:h-14.5 min-[381px]:w-10.5 min-[701px]:h-15.75 min-[701px]:w-11.5 min-[1001px]:h-22.75 min-[1001px]:w-16.25"
              aria-hidden="true"
            >
              <use href="#tactic-mark" />
            </svg>
            <div>
              <strong className="text-[45px] leading-none font-medium tracking-[-0.075em] min-[381px]:text-[55px] min-[701px]:text-[clamp(43px,5.2vw,76px)]">
                TACTIC
              </strong>
              <p className="mt-2.5 text-[11px] tracking-[-0.04em] min-[381px]:text-[13px] min-[701px]:text-[14px] min-[1001px]:text-[17px]">
                Every move matters.
              </p>
            </div>
            <BoardCaption>Identity / 01</BoardCaption>
          </div>
          <div className="relative col-start-2 row-start-2 min-w-0 overflow-hidden rounded-[19px] border border-board-line bg-[rgb(22,32,22)] text-[rgb(214,224,199)] min-[701px]:col-[9/13] min-[701px]:row-[1/3] min-[701px]:rounded-[25px]">
            <Image
              className="h-full w-full object-cover filter-[saturate(0.52)_brightness(0.96)]"
              src="/studio/pathways.webp"
              alt="TACTIC’s green and red forms become intersecting pathways."
              width={1200}
              height={1200}
              sizes="(min-width: 1440px) 482px, (min-width: 701px) 424px, max(230px, calc((100vw - 57px) / 2))"
            />
            <BoardCaption>A matter of direction</BoardCaption>
          </div>
          <div className="relative col-start-1 row-start-2 flex min-w-0 flex-col justify-between overflow-hidden rounded-[19px] border border-board-line bg-[rgb(156,172,134)] p-4.5 text-[rgb(38,48,30)] min-[381px]:p-5.5 min-[701px]:col-[1/5] min-[701px]:row-[2/4] min-[701px]:rounded-[25px] min-[701px]:p-7">
            <span className="font-mono text-[7px] leading-normal tracking-[0.03em] min-[701px]:text-[10px]">
              TACTIC / Perspective series
            </span>
            <p className="relative z-1 my-3.75 text-[25px] leading-[1.05] tracking-[-0.06em] min-[381px]:text-[30px] min-[701px]:my-5 min-[701px]:text-[clamp(28px,3.5vw,45px)]">
              Good things
              <br />
              start with
              <br />
              <em className="font-editorial font-normal tracking-[-0.07em]">
                a move.
              </em>
            </p>
            <svg
              className="absolute -right-3.75 bottom-12.5 h-51.5 w-37.5 rotate-15 opacity-10"
              aria-hidden="true"
            >
              <use href="#tactic-mark" />
            </svg>
            <span className="max-w-50 font-mono text-[6px] leading-normal tracking-[0.03em] min-[701px]:text-[8px]">
              Independent thinking. Shared ambition.
            </span>
          </div>
          <div
            className="relative col-start-1 row-start-3 min-w-0 overflow-hidden rounded-[19px] border border-board-line bg-[linear-gradient(135deg,rgb(40,43,38),rgb(18,22,18)_85%)] min-[701px]:col-[5/9] min-[701px]:row-start-2 min-[701px]:rounded-[25px]"
            aria-label="TACTIC business card concept in soft green and black"
          >
            <div className="absolute top-[23%] left-[4%] flex aspect-[1.85/1] w-[66%] -rotate-12 items-center justify-between rounded-xs bg-[rgb(29,36,27)] p-3 text-[rgb(181,202,164)] shadow-[8px_14px_25px_rgba(0,0,0,0.25)] [border:1px_solid_rgba(184,204,165,0.09)] min-[701px]:top-[19%] min-[701px]:left-[12%] min-[701px]:w-[57%] min-[701px]:p-3.75">
              <span className="text-[5px] leading-[1.4] min-[701px]:text-[7px] min-[1001px]:text-[9px]">
                Independent
                <br />
                creative studio.
              </span>
              <svg
                className="h-3.75 w-2.75 min-[701px]:h-5.5 min-[701px]:w-4"
                aria-hidden="true"
              >
                <use href="#tactic-mark" />
              </svg>
            </div>
            <div className="absolute top-[41%] left-[31%] grid aspect-[1.85/1] w-[66%] rotate-11 grid-cols-[10px_1fr] content-center gap-x-1.25 rounded-xs bg-[rgb(193,207,180)] p-2.5 text-[rgb(37,48,31)] shadow-[8px_14px_25px_rgba(0,0,0,0.25)] min-[381px]:grid-cols-[13px_1fr] min-[381px]:gap-x-1.5 min-[381px]:p-3.25 min-[701px]:top-[37%] min-[701px]:left-[36%] min-[701px]:w-[57%] min-[701px]:grid-cols-[17px_1fr] min-[701px]:gap-x-2 min-[701px]:px-3.75 min-[1001px]:grid-cols-[21px_1fr] min-[1001px]:gap-x-3 min-[1001px]:px-5.25 min-[1001px]:py-4.25">
              <svg
                className="row-[1/3] h-3.5 w-2.5 min-[381px]:h-4.5 min-[381px]:w-3.25 min-[701px]:h-6 min-[701px]:w-4.25 min-[1001px]:h-7.25 min-[1001px]:w-5.25"
                aria-hidden="true"
              >
                <use href="#tactic-mark" />
              </svg>
              <strong className="text-[12px] leading-none font-medium tracking-[-0.055em] min-[381px]:text-[16px] min-[701px]:text-[18px] min-[1001px]:text-[24px]">
                TACTIC
              </strong>
              <span className="mt-1 text-[3px] min-[381px]:text-[4px] min-[701px]:text-[5px] min-[1001px]:text-[7px]">
                Every move matters.
              </span>
            </div>
          </div>
          <div className="relative col-start-2 row-start-3 grid min-w-0 grid-cols-[1fr] content-center gap-x-3.75 overflow-hidden rounded-[19px] border border-board-line bg-[rgb(210,211,200)] p-4.5 text-[rgb(48,52,42)] min-[701px]:col-[5/9] min-[701px]:grid-cols-[1fr_auto] min-[701px]:rounded-[25px] min-[701px]:p-7">
            <span className="font-mono text-[7px] leading-normal tracking-[0.03em] min-[701px]:text-[10px]">
              Type / Geist
            </span>
            <strong className="col-start-1 row-start-2 mt-1.5 text-[60px] leading-none font-normal tracking-[-0.075em] min-[701px]:col-start-2 min-[701px]:row-[1/3] min-[701px]:mt-0 min-[701px]:text-[77px]">
              Aa
            </strong>
            <span className="mt-1 max-w-none text-[7px] leading-[1.3] min-[701px]:mt-3 min-[701px]:max-w-25 min-[701px]:text-[14px]">
              Clear. Considered. Human.
            </span>
          </div>
          <div
            className="relative col-[1/3] row-start-4 flex min-w-0 overflow-hidden rounded-[19px] border-0 min-[701px]:col-[9/13] min-[701px]:row-start-3 min-[701px]:rounded-[25px]"
            aria-label="Brand palette: chalk, charcoal, soft green and muted coral"
          >
            <div className="flex flex-[1_1_0%] items-end justify-center bg-chalk px-1.25 py-5 font-mono text-[8px] text-[rgb(69,76,61)]">
              <span>Chalk</span>
            </div>
            <div className="flex flex-[1_1_0%] items-end justify-center bg-carbon px-1.25 py-5 font-mono text-[8px] text-[rgb(177,181,169)]">
              <span>Carbon</span>
            </div>
            <div className="flex flex-[1_1_0%] items-end justify-center bg-sage px-1.25 py-5 font-mono text-[8px] text-[rgb(58,71,47)]">
              <span>Growth</span>
            </div>
            <div className="flex flex-[1_1_0%] items-end justify-center bg-rose px-1.25 py-5 font-mono text-[8px] text-[rgb(70,51,45)]">
              <span>Feeling</span>
            </div>
          </div>
        </div>
        <BoardNote>TACTIC identity exploration / Studio concept</BoardNote>
      </div>
      <div className="mt-8.75 flex flex-col items-start justify-between gap-6.25 min-[381px]:flex-row min-[381px]:items-center min-[701px]:mt-12 min-[701px]:gap-7.5">
        <p className="text-[12px] leading-[1.65] text-muted min-[701px]:text-[14px]">
          Something in mind?
          <br />
          <span className="text-foreground">Let’s give it a world.</span>
        </p>
        <ContactButton
          className="flex items-center gap-4 rounded-[50px] bg-foreground px-4.5 py-3.75 text-[10px] text-background [transition:background_180ms,transform_180ms] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--text)_90%,var(--green))] focus-visible:[outline:2px_solid_var(--green)] focus-visible:outline-offset-1 motion-reduce:transition-none motion-reduce:hover:transform-none min-[701px]:gap-6 min-[701px]:px-5.5 min-[701px]:py-4.25 min-[701px]:text-[12px]"
          type="button"
        >
          Start a conversation
          <svg
            className="h-3 w-3 min-[701px]:h-3.5 min-[701px]:w-3.5"
            aria-hidden="true"
          >
            <use href="#arrow-up-right" />
          </svg>
        </ContactButton>
      </div>
    </section>
  );
}
