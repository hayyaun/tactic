import Image from "next/image";
import { ContactButton } from "./dialog-buttons";
import { CapabilityTabs } from "./capability-tabs";
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

      <CapabilityTabs
        panels={[
          <div key="0">
            <CapabilityIntro
              title="Distinctive by design."
              description="Strategy, naming, identity and art direction. One considered language, wherever your brand shows up."
              index="01 / 03"
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
                <span className="absolute bottom-4.25 left-5 font-mono text-[7px] leading-normal tracking-[0.03em] text-inherit opacity-60 min-[701px]:bottom-5 min-[701px]:left-6 min-[701px]:text-[10px]">
                  Identity / 01
                </span>
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
                <span className="absolute bottom-4.25 left-5 font-mono text-[7px] leading-normal tracking-[0.03em] text-inherit opacity-60 min-[701px]:bottom-5 min-[701px]:left-6 min-[701px]:text-[10px]">
                  A matter of direction
                </span>
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
            <p className="mt-3.75 font-mono text-[8px] leading-[1.8] tracking-[0.03em] text-muted min-[701px]:text-[9px] min-[701px]:leading-normal">
              TACTIC identity exploration / Studio concept
            </p>
          </div>,
          <div key="1">
            <CapabilityIntro
              title="Beautiful to use."
              description="Websites and apps, designed and developed together. Thoughtful experiences that make every interaction feel effortless."
              index="02 / 03"
            />
            <div
              className="grid grid-cols-[repeat(2,minmax(0px,1fr))] grid-rows-[300px_470px_150px] gap-2.25 text-carbon min-[701px]:grid-cols-[repeat(12,minmax(0px,1fr))] min-[701px]:grid-rows-[380px_175px] min-[701px]:gap-3 min-[1440px]:grid-rows-[420px_185px]"
              aria-label="Original website and app interface concepts"
            >
              <div className="relative col-[1/3] row-start-1 flex min-w-0 items-center justify-center overflow-hidden rounded-[19px] border border-board-line bg-[radial-gradient(at_80%_10%,rgb(55,59,49),rgb(35,40,32)_70%)] px-3 pt-5.5 pb-11.25 text-[rgb(203,208,194)] min-[381px]:px-4 min-[701px]:col-[1/9] min-[701px]:rounded-[25px] min-[701px]:px-5 min-[701px]:pt-6.25 min-[701px]:pb-12.5 min-[1001px]:px-7.5 min-[1001px]:pt-7 min-[1001px]:pb-13">
                <div className="w-full max-w-175 overflow-hidden rounded-[10px] shadow-[0_30px_60px_rgba(0,0,0,0.23)] [border:1px_solid_rgba(255,255,255,0.12)]">
                  <div className="flex items-center justify-between bg-[rgb(51,55,46)] px-3.75 py-3 font-mono text-[7px] text-[rgb(155,159,147)]">
                    <span className="flex gap-1" aria-hidden="true">
                      <i className="h-1 w-1 rounded-full bg-[rgb(129,136,118)]"></i>
                      <i className="h-1 w-1 rounded-full bg-[rgb(129,136,118)]"></i>
                      <i className="h-1 w-1 rounded-full bg-[rgb(129,136,118)]"></i>
                    </span>
                    <span>TACTIC / Digital experience</span>
                    <span aria-hidden="true">↗</span>
                  </div>
                  <div className="bg-[rgb(228,226,214)] p-2.75 text-[rgb(69,74,59)] min-[381px]:p-3.75 min-[701px]:px-4.25 min-[701px]:pt-4.5 min-[1001px]:px-6.25 min-[1001px]:pt-5">
                    <div className="flex items-center justify-between text-[6px]">
                      <strong className="text-[14px] font-medium tracking-[-0.09em] min-[381px]:text-[16px]">
                        FORM.
                      </strong>
                      <span className="text-[5px] min-[381px]:[font-size:inherit]">
                        Objects   /   Our story
                      </span>
                      <span className="text-[5px] min-[381px]:[font-size:inherit]">
                        Bag (0)
                      </span>
                    </div>
                    <div className="grid grid-cols-[1.05fr_1fr] items-center gap-3 pt-3.5 min-[701px]:pt-5">
                      <div>
                        <span className="font-mono text-[5px] leading-normal tracking-[0.03em] text-[rgb(138,142,125)] min-[381px]:text-[6px]">
                          An everyday collection
                        </span>
                        <p className="mt-3.25 text-[21px] leading-[1.05] tracking-[-0.06em] min-[381px]:text-[24px] min-[701px]:text-[clamp(22px,3vw,39px)]">
                          Less noise.
                          <br />
                          <em className="font-editorial font-normal tracking-[-0.06em]">
                            More living.
                          </em>
                        </p>
                        <span className="mt-4.25 inline-block rounded-[20px] bg-[rgb(112,123,97)] p-2 text-[5px] text-[rgb(239,240,230)] min-[701px]:mt-5.5 min-[701px]:px-3 min-[701px]:text-[6px]">
                          Explore the collection ↗
                        </span>
                      </div>
                      <div
                        className="relative flex h-33.25 [align-items:end] justify-center rounded-[55%_55%_3px_3px] bg-[radial-gradient(at_50%_0px,rgb(232,232,221),rgb(200,204,186))] min-[381px]:h-35.75 min-[701px]:h-45 min-[1440px]:h-53.75"
                        aria-hidden="true"
                      >
                        <div className="absolute bottom-7 left-[32%] z-1 h-3.75 w-26.25 rounded-full bg-[rgb(81,87,72)] opacity-40 filter-[blur(7px)]"></div>
                        <div className="ability-vase absolute bottom-6 z-2 h-18.25 w-15 rounded-[46%_46%_30%_30%] bg-[linear-gradient(100deg,rgb(134,146,116),rgb(188,197,171)_30%,rgb(166,176,149)_60%,rgb(102,117,83))] shadow-[inset_-5px_0_8px_rgba(68,85,54,0.15)] min-[701px]:bottom-7.5 min-[701px]:h-25 min-[701px]:w-20.5"></div>
                        <div className="absolute bottom-0 h-8.25 w-26.25 rounded-[50%_50%_0px_0px/10px_10px_0px_0px] bg-[linear-gradient(100deg,rgb(173,175,158),rgb(217,217,204)_40%,rgb(190,190,173))] min-[701px]:h-10.5 min-[701px]:w-33.75"></div>
                        <span className="absolute right-2 bottom-1.75 z-3 text-[5px] text-[rgb(103,111,89)]">
                          01 — The quiet vase
                        </span>
                      </div>
                    </div>
                    <div className="mt-4.25 flex items-center justify-between text-[5px] text-[rgb(149,153,136)]">
                      <span>Objects with intention.</span>
                      <span>Made for the everyday.</span>
                    </div>
                  </div>
                </div>
                <span className="absolute bottom-4.25 left-5 font-mono text-[7px] leading-normal tracking-[0.03em] text-inherit opacity-60 min-[701px]:bottom-5 min-[701px]:left-6 min-[701px]:text-[10px]">
                  Web design + development
                </span>
              </div>
              <div
                className="relative col-[1/3] row-start-2 flex min-w-0 items-center justify-center overflow-hidden rounded-[19px] border border-board-line bg-[radial-gradient(at_left_top,rgb(71,76,61),rgb(44,50,37))] px-3.75 pt-8.75 pb-13 text-[rgb(212,220,203)] min-[701px]:col-[9/13] min-[701px]:row-[1/3] min-[701px]:rounded-[25px]"
                aria-label="Mobile app concept for a calm daily planning experience"
              >
                <div className="w-50 max-w-full rotate-4 overflow-hidden rounded-[31px] bg-[rgb(225,230,216)] text-[rgb(58,73,49)] shadow-[12px_24px_40px_rgba(0,0,0,0.25),inset_0_0_0_1px_rgb(77,87,65)] [border:5px_solid_rgb(32,37,27)] min-[701px]:rotate-0 min-[1001px]:w-56.25">
                  <div className="flex justify-between px-4.25 pt-3 pb-1.5 text-[7px]">
                    <span>9:41</span>
                    <span aria-hidden="true">•••</span>
                  </div>
                  <div className="px-3.75 pt-5 pb-4 min-[1001px]:px-4.5">
                    <span className="font-mono text-[6px] leading-normal tracking-[0.03em] text-[rgb(141,153,131)]">
                      A little room to breathe.
                    </span>
                    <strong className="mt-2.75 block text-[28px] leading-[1.06] font-normal tracking-[-0.065em]">
                      Your day,
                      <br />
                      in balance.
                    </strong>
                    <div
                      className="mx-auto my-6 flex h-35.5 w-35.5 flex-col items-center justify-center rounded-full shadow-[0_0_0_7px_rgba(169,190,150,0.09),0_0_0_15px_rgba(169,190,150,0.06)] [border:1px_solid_rgb(189,201,176)]"
                      aria-hidden="true"
                    >
                      <span className="text-[8px] text-[rgb(122,138,109)]">
                        Today
                      </span>
                      <b className="text-[47px] leading-[1.1] font-light tracking-[-0.07em]">
                        04
                      </b>
                      <small className="text-[6px] text-[rgb(139,153,128)]">
                        things that matter
                      </small>
                    </div>
                    <div className="mt-2 flex items-center gap-1.75 rounded-lg bg-[rgb(212,222,201)] px-2 py-2.75 text-[7px]">
                      <i className="h-2.5 w-2.5 rounded-full [border:1px_solid_rgb(157,173,142)]"></i>
                      <span>
                        A fresh perspective
                        <small className="mt-0.75 block text-[5px] text-[rgb(137,151,126)]">
                          Creative time · 10:00
                        </small>
                      </span>
                      <b className="ml-auto font-normal">↗</b>
                    </div>
                    <div className="mt-2 flex items-center gap-1.75 rounded-lg bg-[rgb(212,222,201)] px-2 py-2.75 text-[7px]">
                      <i className="h-2.5 w-2.5 rounded-full [border:1px_solid_rgb(157,173,142)]"></i>
                      <span>
                        Make room for you
                        <small className="mt-0.75 block text-[5px] text-[rgb(137,151,126)]">
                          Afternoon walk · 16:00
                        </small>
                      </span>
                      <b className="ml-auto font-normal">↗</b>
                    </div>
                    <div
                      className="mt-6 flex justify-around pt-2 text-[10px] text-[rgb(135,154,120)]"
                      aria-hidden="true"
                    >
                      <span>◉</span>
                      <span>▦</span>
                      <span>☰</span>
                    </div>
                  </div>
                </div>
                <span className="absolute bottom-4.25 left-5 font-mono text-[7px] leading-normal tracking-[0.03em] text-inherit opacity-60 min-[701px]:bottom-5 min-[701px]:left-6 min-[701px]:text-[10px]">
                  App design + development
                </span>
              </div>
              <div className="relative col-start-1 row-start-3 min-w-0 overflow-hidden rounded-[19px] border border-board-line bg-[rgb(196,201,185)] p-4.25 text-[rgb(64,75,52)] min-[381px]:p-5 min-[701px]:col-[1/5] min-[701px]:row-start-2 min-[701px]:rounded-[25px] min-[701px]:p-5.75 min-[1001px]:p-7">
                <svg
                  className="absolute top-4.25 right-3.25 h-4.5 w-3.25 opacity-25 min-[381px]:opacity-70 min-[701px]:top-6.5 min-[701px]:right-4.75 min-[701px]:h-6 min-[701px]:w-4.25 min-[1001px]:right-6.25 min-[1001px]:h-7.75 min-[1001px]:w-5.5"
                  aria-hidden="true"
                >
                  <use href="#tactic-mark" />
                </svg>
                <p className="text-[20px] leading-[1.08] tracking-tighter min-[381px]:text-[22px] min-[701px]:text-[23px] min-[1001px]:text-[27px]">
                  Good design
                  <br />
                  feels <em className="font-sans font-normal">natural.</em>
                </p>
                <span className="mt-3.75 block max-w-25 text-[7px] leading-[1.6] text-[rgb(111,122,99)] min-[701px]:mt-5.25 min-[701px]:max-w-none min-[701px]:text-[8px] min-[701px]:leading-[inherit]">
                  Considered on every screen.
                </span>
              </div>
              <div className="relative col-start-2 row-start-3 min-w-0 overflow-hidden rounded-[19px] border border-board-line bg-[rgb(31,38,27)] p-4.25 text-[rgb(131,149,118)] min-[381px]:p-4.75 min-[701px]:col-[5/9] min-[701px]:row-start-2 min-[701px]:rounded-[25px] min-[701px]:p-5.75 min-[1001px]:p-6">
                <span className="block max-w-28.75 font-mono text-[6px] leading-normal tracking-[0.03em] min-[701px]:inline min-[701px]:max-w-none min-[701px]:text-[8px]">
                  A consistent design language
                </span>
                <div
                  className="mt-3.75 flex flex-wrap items-center gap-1.25 min-[381px]:gap-2 min-[701px]:mt-5.25 min-[701px]:flex-nowrap min-[701px]:gap-1.75 min-[1001px]:gap-2.75"
                  aria-hidden="true"
                >
                  <span className="rounded-[20px] bg-[rgb(180,201,159)] p-1.75 text-[5px] text-[rgb(40,51,30)] min-[381px]:px-2.25 min-[381px]:text-[6px] min-[701px]:px-2.75 min-[701px]:py-2.25 min-[701px]:text-[7px] min-[1001px]:px-3.5 min-[1001px]:py-2.5 min-[1001px]:text-[9px]">
                    Discover ↗
                  </span>
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-[rgb(52,66,42)] text-[13px] text-[rgb(175,195,157)] min-[701px]:h-8 min-[701px]:w-8 min-[701px]:text-[16px]">
                    +
                  </span>
                  <span className="hidden h-5.75 w-9.75 items-center justify-end rounded-[20px] bg-[rgb(130,156,108)] p-0.75 min-[701px]:flex">
                    <i className="h-4.25 w-4.25 rounded-full bg-[rgb(213,226,200)]"></i>
                  </span>
                </div>
                <div className="mt-3.75 flex gap-1.25" aria-hidden="true">
                  <i className="h-0.75 w-9 rounded-[3px] bg-[rgb(72,92,59)]"></i>
                  <i className="h-0.75 w-6.25 rounded-[3px] bg-[rgb(53,72,42)]"></i>
                  <i className="h-0.75 w-3.75 rounded-[3px] bg-[rgb(41,60,31)]"></i>
                </div>
                <span className="mt-3 block text-[6px] min-[701px]:mt-3.75 min-[701px]:text-[8px]">
                  Thoughtful systems. Seamless details.
                </span>
              </div>
            </div>
            <p className="mt-3.75 font-mono text-[8px] leading-[1.8] tracking-[0.03em] text-muted min-[701px]:text-[9px] min-[701px]:leading-normal">
              FORM website + daily planning app / Studio concepts
            </p>
          </div>,
          <div key="2">
            <CapabilityIntro
              title="A world in a few seconds."
              description="AI advertising films shaped by creative direction. From the first storyboard to cinematic visuals, sound and the final cut."
              index="03 / 03"
            />
            <div
              className="grid grid-cols-[repeat(2,minmax(0px,1fr))] grid-rows-[450px_220px_auto] gap-2.25 text-carbon min-[701px]:grid-cols-[repeat(12,minmax(0px,1fr))] min-[701px]:grid-rows-[270px_270px] min-[701px]:gap-3 min-[1440px]:grid-rows-[295px_295px]"
              aria-label="Cinematic advertising storyboard concept"
            >
              <div className="ability-film-scene relative col-[1/3] row-start-1 min-h-0 min-w-0 overflow-hidden rounded-[19px] border border-board-line bg-[rgb(53,45,37)] text-[rgb(225,210,188)] min-[701px]:col-[1/9] min-[701px]:row-[1/3] min-[701px]:rounded-[25px]">
                <div className="absolute top-5.5 right-5.5 left-5.5 z-4 flex justify-between gap-5 font-mono text-[6px] leading-normal tracking-[0.03em] text-[rgb(193,181,158)] min-[701px]:top-6.5 min-[701px]:right-7 min-[701px]:left-7 min-[701px]:text-[8px]">
                  <span>TACTIC / Motion studies</span>
                  <span>Ad direction / Concept still</span>
                </div>
                <Image
                  className="h-full w-full object-cover object-[48%_center] min-[701px]:object-[center_center]"
                  src="/studio/ai-campaign.png"
                  alt="Smoked glass perfume bottle on stone, lit by sage light and a muted coral sunset in an imagined landscape."
                  width={1672}
                  height={941}
                  sizes="(min-width: 1440px) 1070px, (min-width: 701px) 981px, 800px"
                />
                <div className="absolute bottom-22 left-6 z-3 min-[701px]:bottom-21.25 min-[701px]:left-6.25 min-[1001px]:bottom-22 min-[1001px]:left-8">
                  <span className="font-mono text-[7px] leading-normal tracking-[0.03em] text-[rgb(174,178,150)] min-[701px]:text-[8px]">
                    01 / The reveal
                  </span>
                  <strong className="mt-3.5 block text-[31px] leading-[1.08] font-normal tracking-[-0.055em] min-[701px]:mt-5 min-[701px]:text-[clamp(28px,3.1vw,42px)]">
                    A moment.
                    <br />
                    <em className="font-editorial text-[0.92em] font-normal">
                      An entire feeling.
                    </em>
                  </strong>
                </div>
                <div className="absolute right-5.5 bottom-5.25 left-5.5 z-4 flex justify-between gap-5 font-mono text-[6px] leading-normal tracking-[0.03em] text-[rgb(193,181,158)] min-[701px]:right-7 min-[701px]:bottom-6 min-[701px]:left-7 min-[701px]:text-[8px]">
                  <span>Creative direction × AI imagination</span>
                  <span aria-hidden="true">16:9</span>
                </div>
              </div>
              <div className="ability-storyboard-light relative col-start-1 row-start-2 min-w-0 overflow-hidden rounded-[19px] border border-board-line bg-[radial-gradient(at_80%_0px,rgb(140,144,110),rgb(67,73,56)_65%)] p-5 text-[rgb(217,210,182)] min-[701px]:col-[9/13] min-[701px]:row-start-1 min-[701px]:rounded-[25px] min-[701px]:p-6.25">
                <Image
                  className="absolute top-0 right-0 bottom-0 left-0 h-full w-full origin-[52%_54%] transform-[scale(2.25)] object-cover"
                  src="/studio/ai-campaign.png"
                  alt="Close detail of the perfume bottle and softly lit vapor."
                  width={1672}
                  height={941}
                  sizes="(min-width: 1440px) 1180px, (min-width: 701px) 1080px, 880px"
                />
                <span className="relative z-2 font-mono text-[6px] leading-normal tracking-[0.03em] text-[rgb(207,204,178)] min-[701px]:text-[10px]">
                  02 / Light & texture
                </span>
                <p className="absolute bottom-5 left-5 z-2 text-[7px] min-[701px]:bottom-5.5 min-[701px]:left-6.25 min-[701px]:text-[10px]">
                  Details you can feel.
                </p>
              </div>
              <div className="relative col-start-2 row-start-2 min-w-0 overflow-hidden rounded-[19px] border border-board-line bg-[rgb(192,198,173)] p-5 text-[rgb(234,215,200)] min-[701px]:col-[9/13] min-[701px]:rounded-[25px] min-[701px]:p-6.25">
                <Image
                  className="absolute top-0 right-0 bottom-0 left-0 h-full w-full origin-[100%_52%] transform-[scale(2.5)] object-cover filter-[brightness(0.53)_saturate(0.7)]"
                  src="/studio/ai-campaign.png"
                  alt="Muted coral sunset reflected over an imagined rocky shoreline."
                  width={1672}
                  height={941}
                  sizes="(min-width: 1440px) 1312px, (min-width: 701px) 1200px, 978px"
                />
                <span className="relative z-2 font-mono text-[6px] leading-normal tracking-[0.03em] text-[rgb(208,184,170)] min-[701px]:text-[10px]">
                  03 / The last frame
                </span>
                <div className="absolute top-0 right-0 bottom-0 left-0 flex flex-col items-center justify-center">
                  <strong className="text-[35px] font-light tracking-[0.07em] min-[701px]:text-[60px] min-[701px]:tracking-[0.08em]">
                    STILL
                  </strong>
                  <span className="mt-1 font-sans text-[10px] text-[rgb(211,187,171)] italic min-[701px]:text-[15px]">
                    A new perspective.
                  </span>
                </div>
                <p className="absolute bottom-5 left-5 z-2 text-[7px] min-[701px]:bottom-5.5 min-[701px]:left-6.25 min-[701px]:text-[10px]">
                  Leave a little wonder.
                </p>
              </div>
              <div className="relative col-[1/3] row-start-3 flex min-w-0 flex-col flex-wrap items-start justify-between gap-3.75 overflow-hidden rounded-[19px] border border-board-line bg-[rgb(28,33,25)] p-5.25 text-[rgb(142,156,127)] min-[701px]:col-[1/13] min-[701px]:row-auto min-[701px]:flex-row min-[701px]:items-center min-[701px]:gap-5.5 min-[701px]:rounded-[20px] min-[701px]:px-7.5 min-[701px]:py-6.5 min-[1001px]:flex-nowrap">
                <span className="font-mono text-[8px] leading-normal tracking-[0.03em]">
                  From a thought to a feeling.
                </span>
                <div className="flex flex-wrap items-center gap-3 text-[10px] text-[rgb(184,195,171)] min-[701px]:flex-nowrap min-[701px]:gap-4 min-[701px]:text-[12px]">
                  <span>Story</span>
                  <i className="text-[11px] text-[rgb(86,104,74)] not-italic">
                    →
                  </i>
                  <span>World</span>
                  <i className="text-[11px] text-[rgb(86,104,74)] not-italic">
                    →
                  </i>
                  <span>Motion</span>
                  <i className="text-[11px] text-[rgb(86,104,74)] not-italic">
                    →
                  </i>
                  <span>Sound</span>
                </div>
                <p className="hidden text-[8px] min-[1001px]:block">
                  Human direction. New possibilities.
                </p>
              </div>
            </div>
            <p className="mt-3.75 font-mono text-[8px] leading-[1.8] tracking-[0.03em] text-muted min-[701px]:text-[9px] min-[701px]:leading-normal">
              STILL advertising direction / AI-generated concept stills
            </p>
          </div>,
        ]}
      />
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
