import Image from "next/image";
import Link from "next/link";
import { ContactButton, StudyButton } from "./components/dialog-buttons";
import { Dialogs } from "./components/interactions";
import { Header } from "./components/header";
import { Capabilities } from "./components/capabilities";
import { HeroArt } from "./components/hero-art";
import { HeroPreview } from "./components/hero-preview";
export default function Home() {
  return (
    <>
      <svg
        className="absolute h-0 w-0 overflow-hidden"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <symbol id="tactic-mark" viewBox="0 0 40 55">
          <path d="M1 9 8 0 24 13 31 4 40 11 26 29Z" fill="currentColor"></path>
          <path
            d="M1 43 15 26 40 46 33 55 17 42 10 51Z"
            fill="currentColor"
          ></path>
        </symbol>
        <symbol id="arrow-up-right" viewBox="0 0 24 24">
          <path
            d="M5 19 19 5M5 5h14v14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          ></path>
        </symbol>
      </svg>

      <Link
        className="fixed top-2 left-2 z-30 translate-y-[-160%] rounded-lg bg-foreground px-5 py-3.5 text-background focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </Link>
      <Header />

      <main id="main">
        <section
          className="relative isolate flex h-svh min-h-220 flex-col items-center overflow-hidden bg-background bg-[radial-gradient(circle_at_108%_80%,rgb(255_44_75/0.32),rgb(255_44_75/0.095)_29.25vw,transparent_65vw),radial-gradient(circle_at_-8%_80%,rgb(128_230_80/0.32),rgb(128_230_80/0.095)_29.25vw,transparent_65vw)] px-5 pt-33 pb-0 text-center min-[360px]:px-6 min-[600px]:pt-36.5 min-[960px]:pt-37.5 [@media(max-height:_740px)_and_(max-width:_700px)]:min-h-140 [@media(max-height:_740px)_and_(max-width:_700px)]:pt-26.25"
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
            <Link
              className="mt-5 inline-flex items-center gap-7.5 rounded-[28px] bg-foreground px-5 py-3.25 text-[11px] text-background [transition:background_0.3s,transform_0.3s] hover:-translate-y-0.5 hover:bg-[rgb(213,231,206)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 min-[600px]:mt-4.5 min-[600px]:px-5.75 min-[600px]:py-3.5 min-[600px]:text-[12px] [@media(max-height:_740px)_and_(max-width:_700px)]:mt-3 [@media(max-height:_740px)_and_(max-width:_700px)]:px-4.5 [@media(max-height:_740px)_and_(max-width:_700px)]:py-2.5 [@media(max-height:_740px)_and_(max-width:_700px)]:text-[10px]"
              href="#capabilities"
            >
              Discover what we do <span>↗</span>
            </Link>
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
              <span className="font-sans text-[16px] text-green">↓</span>
            </Link>
          </div>
        </section>

        <Capabilities />

        <section
          className="mx-auto w-[calc(100%-48px)] max-w-7xl py-25 min-[600px]:w-[calc(100%-80px)] min-[960px]:w-[calc(100%-144px)] min-[960px]:py-36.25"
          id="world"
          aria-labelledby="world-title"
        >
          <div className="flex justify-between gap-5 font-mono text-[9px] leading-[1.7] font-normal tracking-wider text-muted uppercase">
            <span>02 / The TACTIC world</span>
            <span className="hidden text-muted min-[960px]:inline">
              Thinking, made visible.
            </span>
          </div>
          <div className="mx-0 mt-9.5 mb-10 grid gap-6.5 min-[960px]:mt-11.75 min-[960px]:mb-15 min-[960px]:flex min-[960px]:items-end min-[960px]:justify-between">
            <h2
              className="text-[clamp(37px,8.7vw,61px)] leading-[1.12] font-[380] tracking-[-0.045em] min-[960px]:text-[58px]"
              id="world-title"
            >
              A point of view.
              <br />
              <span className="text-muted">Made visible.</span>
            </h2>
            <p className="text-[12px] leading-[1.85] text-muted min-[960px]:mr-2 min-[960px]:pb-0.75">
              A glimpse into how we see things.
              <br />
              Purposeful ideas. Unexpected perspectives.
              <br />
              Always a clear direction.
            </p>
          </div>
          <div className="grid gap-8.75 min-[600px]:grid-cols-[repeat(3,minmax(0px,1fr))] min-[600px]:gap-5.5 min-[960px]:gap-7.5">
            <StudyButton
              className="group/study block w-full bg-transparent p-0 text-left"
              aria-label="View A clearer direction brand study"
              study="pathways"
            >
              <div className="relative aspect-square overflow-hidden rounded-[23px] bg-[rgb(24,29,22)] min-[960px]:rounded-[28px]">
                <Image
                  className="h-full w-full object-cover filter-[saturate(0.65)_brightness(0.98)] [transition:transform_0.9s_cubic-bezier(0.2,0.7,0.2,1),filter_0.6s] group-hover/study:transform-[scale(1.035)] group-hover/study:filter-[saturate(0.85)_brightness(1.04)] motion-reduce:transition-none motion-reduce:group-hover/study:transform-none"
                  src="/studio/pathways.webp"
                  width={1200}
                  height={1200}
                  alt="TACTIC’s green and red marks become intersecting pathways with figures choosing a direction."
                  sizes="(min-width: 1424px) 408px, (min-width: 960px) calc((100vw - 204px) / 3), (min-width: 600px) calc((100vw - 124px) / 3), calc(100vw - 48px)"
                />
                <span className="absolute top-3.75 right-3.75 grid h-9 w-9 place-items-center rounded-full bg-[rgba(245,247,238,0.8)] text-[17px] text-[rgb(51,76,59)] backdrop-blur-md [transition:background_0.3s,color_0.3s] group-hover/study:bg-[rgb(51,76,59)] group-hover/study:text-[rgb(246,248,240)] motion-reduce:transition-none">
                  ↗
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-0.75 pt-4.75 pb-3 [border-bottom:1px_solid_var(--line)] min-[600px]:flex-wrap min-[600px]:gap-2 min-[960px]:flex-nowrap">
                <h3 className="text-[14px] font-normal tracking-[-0.02em]">
                  A clearer direction
                </h3>
                <span className="font-mono text-[7px] leading-[1.7] font-normal tracking-wider whitespace-nowrap text-muted uppercase">
                  01 / Perspective
                </span>
              </div>
            </StudyButton>
            <StudyButton
              className="group/study block w-full bg-transparent p-0 text-left"
              aria-label="View Thinking ahead brand study"
              study="strategy"
            >
              <div className="relative aspect-square overflow-hidden rounded-[23px] bg-[rgb(24,29,22)] min-[960px]:rounded-[28px]">
                <Image
                  className="h-full w-full object-cover filter-[saturate(0.65)_brightness(0.98)] [transition:transform_0.9s_cubic-bezier(0.2,0.7,0.2,1),filter_0.6s] group-hover/study:transform-[scale(1.035)] group-hover/study:filter-[saturate(0.85)_brightness(1.04)] motion-reduce:transition-none motion-reduce:group-hover/study:transform-none"
                  src="/studio/strategy.webp"
                  width={1200}
                  height={1200}
                  alt="A chess pawn sits within a green ring among other pieces and TACTIC brand symbols."
                  sizes="(min-width: 1424px) 408px, (min-width: 960px) calc((100vw - 204px) / 3), (min-width: 600px) calc((100vw - 124px) / 3), calc(100vw - 48px)"
                />
                <span className="absolute top-3.75 right-3.75 grid h-9 w-9 place-items-center rounded-full bg-[rgba(245,247,238,0.8)] text-[17px] text-[rgb(51,76,59)] backdrop-blur-md [transition:background_0.3s,color_0.3s] group-hover/study:bg-[rgb(51,76,59)] group-hover/study:text-[rgb(246,248,240)] motion-reduce:transition-none">
                  ↗
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-0.75 pt-4.75 pb-3 [border-bottom:1px_solid_var(--line)] min-[600px]:flex-wrap min-[600px]:gap-2 min-[960px]:flex-nowrap">
                <h3 className="text-[14px] font-normal tracking-[-0.02em]">
                  Thinking ahead
                </h3>
                <span className="font-mono text-[7px] leading-[1.7] font-normal tracking-wider whitespace-nowrap text-muted uppercase">
                  02 / Strategy
                </span>
              </div>
            </StudyButton>
            <StudyButton
              className="group/study block w-full bg-transparent p-0 text-left"
              aria-label="View Built to stand apart brand study"
              study="architecture"
            >
              <div className="relative aspect-square overflow-hidden rounded-[23px] bg-[rgb(24,29,22)] min-[960px]:rounded-[28px]">
                <Image
                  className="h-full w-full object-cover filter-[saturate(0.65)_brightness(0.98)] [transition:transform_0.9s_cubic-bezier(0.2,0.7,0.2,1),filter_0.6s] group-hover/study:transform-[scale(1.035)] group-hover/study:filter-[saturate(0.85)_brightness(1.04)] motion-reduce:transition-none motion-reduce:group-hover/study:transform-none"
                  src="/studio/architecture.webp"
                  width={900}
                  height={900}
                  alt="TACTIC’s opposing green and red marks form two architectural towers."
                  sizes="(min-width: 1424px) 408px, (min-width: 960px) calc((100vw - 204px) / 3), (min-width: 600px) calc((100vw - 124px) / 3), calc(100vw - 48px)"
                />
                <span className="absolute top-3.75 right-3.75 grid h-9 w-9 place-items-center rounded-full bg-[rgba(245,247,238,0.8)] text-[17px] text-[rgb(51,76,59)] backdrop-blur-md [transition:background_0.3s,color_0.3s] group-hover/study:bg-[rgb(51,76,59)] group-hover/study:text-[rgb(246,248,240)] motion-reduce:transition-none">
                  ↗
                </span>
              </div>
              <div className="flex items-baseline justify-between gap-3 px-0.75 pt-4.75 pb-3 [border-bottom:1px_solid_var(--line)] min-[600px]:flex-wrap min-[600px]:gap-2 min-[960px]:flex-nowrap">
                <h3 className="text-[14px] font-normal tracking-[-0.02em]">
                  Built to stand apart
                </h3>
                <span className="font-mono text-[7px] leading-[1.7] font-normal tracking-wider whitespace-nowrap text-muted uppercase">
                  03 / Identity
                </span>
              </div>
            </StudyButton>
          </div>
          <p className="mt-8 flex items-center gap-2.25 font-mono text-[8px] leading-[1.8] font-normal tracking-normal text-muted min-[960px]:mt-9.75">
            <span className="inline-block h-1 w-1 flex-[0_0_4px] rounded-full bg-green"></span>{" "}
            An exploration of our own identity. A reflection of our approach.
          </p>
        </section>

        <section
          className="bg-[linear-gradient(120deg,rgba(148,189,124,0.02),rgba(217,119,100,0.02))] py-25 [border-bottom:1px_solid_var(--line)] [border-top:1px_solid_var(--line)] min-[960px]:py-36.25"
          id="studio"
          aria-labelledby="studio-title"
        >
          <div className="mx-auto w-[calc(100%-48px)] max-w-7xl min-[600px]:w-[calc(100%-80px)] min-[960px]:w-[calc(100%-144px)]">
            <div className="flex justify-between gap-5 font-mono text-[9px] leading-[1.7] font-normal tracking-wider text-muted uppercase">
              <span>03 / The studio</span>
              <svg className="h-4.25 w-3 text-green" aria-hidden="true">
                <use href="#tactic-mark" />
              </svg>
            </div>
            <div className="mt-11.25 grid gap-9 min-[960px]:mt-14.25 min-[960px]:grid-cols-[1.15fr_1fr] min-[960px]:gap-27.5">
              <h2
                className="text-[clamp(37px,8.7vw,61px)] leading-[1.12] font-[380] tracking-[-0.045em] min-[960px]:text-[63px]"
                id="studio-title"
              >
                Good instinct.
                <br />
                <span className="text-muted">Clear intent.</span>
              </h2>
              <div className="max-w-112.5">
                <p className="text-[21px] leading-[1.55] font-[350] tracking-tight min-[960px]:text-[24px]">
                  We’re TACTIC. A creative studio for ambitious people with
                  somewhere to go.
                </p>
                <p className="mt-6.25 text-[12px] leading-[1.95] text-muted min-[960px]:text-[13px]">
                  We connect strategy, identity and digital design to help ideas
                  find their strongest form. Curious by nature and considered in
                  our craft, we ask better questions, look a little closer, and
                  make every detail count.
                </p>
                <Link
                  className="group/text-link mt-8 inline-flex items-center justify-between gap-7 bg-transparent p-0 text-[12px]"
                  href="#capabilities"
                >
                  Meet our approach{" "}
                  <span className="inline-grid h-8.25 w-8.25 place-items-center rounded-full bg-[rgba(255,255,255,0.07)] text-[16px] [transition:background_0.3s,color_0.3s,transform_0.3s] group-hover/text-link:rotate-45 group-hover/text-link:bg-foreground group-hover/text-link:text-background motion-reduce:transition-none motion-reduce:group-hover/text-link:rotate-0">
                    ↘
                  </span>
                </Link>
              </div>
            </div>
            <div className="mt-16.25 grid gap-8.25 min-[600px]:grid-cols-[repeat(3,minmax(0px,1fr))] min-[600px]:gap-8 min-[960px]:mt-23 min-[960px]:gap-17.5">
              <div className="pt-6 [border-top:1px_solid_var(--line)]">
                <span className="font-mono text-[9px] text-green">01</span>
                <h3 className="mt-5.75 text-[24px] font-[350] tracking-[-0.035em] min-[600px]:text-[21px] min-[960px]:text-[27px]">
                  Think clearly.
                </h3>
                <p className="mt-3.5 max-w-72.5 text-[12px] leading-[1.85] text-muted min-[600px]:text-[11px] min-[960px]:text-[12px]">
                  Find what matters. Give the idea a purpose before giving it a
                  form.
                </p>
              </div>
              <div className="pt-6 [border-top:1px_solid_var(--line)]">
                <span className="font-mono text-[9px] text-green">02</span>
                <h3 className="mt-5.75 text-[24px] font-[350] tracking-[-0.035em] min-[600px]:text-[21px] min-[960px]:text-[27px]">
                  Make it distinct.
                </h3>
                <p className="mt-3.5 max-w-72.5 text-[12px] leading-[1.85] text-muted min-[600px]:text-[11px] min-[960px]:text-[12px]">
                  Bring a fresh perspective. Build something that could only be
                  yours.
                </p>
              </div>
              <div className="pt-6 [border-top:1px_solid_var(--line)]">
                <span className="font-mono text-[9px] text-green">03</span>
                <h3 className="mt-5.75 text-[24px] font-[350] tracking-[-0.035em] min-[600px]:text-[21px] min-[960px]:text-[27px]">
                  Move together.
                </h3>
                <p className="mt-3.5 max-w-72.5 text-[12px] leading-[1.85] text-muted min-[600px]:text-[11px] min-[960px]:text-[12px]">
                  Keep the conversation open. Turn shared ambition into a clear
                  next step.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="mx-auto mt-25 w-[calc(100%-48px)] max-w-7xl pt-13.5 pb-15 [border-bottom:1px_solid_var(--line)] [border-top:1px_solid_var(--line)] min-[600px]:w-[calc(100%-80px)] min-[960px]:mt-36.25 min-[960px]:w-[calc(100%-144px)] min-[960px]:pt-12.25 min-[960px]:pb-17.25"
          id="contact"
          aria-labelledby="contact-title"
        >
          <div className="flex justify-between gap-5 font-mono text-[9px] leading-[1.7] font-normal tracking-wider text-muted uppercase">
            <span>04 / Your next move</span>
            <span className="hidden items-center gap-2 text-muted min-[960px]:inline">
              <span className="inline-block h-1 w-1 flex-[0_0_4px] rounded-full bg-green"></span>{" "}
              Let’s make something matter.
            </span>
          </div>
          <div className="mt-10.5 flex flex-wrap items-center gap-8.25 min-[960px]:mt-14.75 min-[960px]:flex-nowrap min-[960px]:justify-between min-[960px]:gap-12.5">
            <h2
              className="text-[clamp(38px,9vw,83px)] leading-[1.13] font-[380] tracking-[-0.045em] min-[960px]:text-[clamp(59px,5.6vw,84px)]"
              id="contact-title"
            >
              A good project starts
              <br />
              with a <span className="text-green">conversation.</span>
            </h2>
            <ContactButton
              className="grid h-16.75 w-16.75 place-items-center rounded-full bg-foreground [transition:background_0.3s,transform_0.3s] hover:rotate-45 hover:bg-[rgb(213,231,206)] motion-reduce:transition-none motion-reduce:hover:rotate-0 min-[960px]:h-26 min-[960px]:w-26 min-[960px]:flex-[0_0_auto]"
              aria-label="Start a project enquiry"
            >
              <svg
                className="h-6.75 w-6.75 text-background min-[960px]:h-9.25 min-[960px]:w-9.25"
                aria-hidden="true"
              >
                <use href="#arrow-up-right" />
              </svg>
            </ContactButton>
          </div>
          <div className="mt-9.75 flex flex-col items-start gap-6.75 min-[960px]:mt-11.5 min-[960px]:flex-row min-[960px]:items-end min-[960px]:justify-between">
            <p className="text-[12px] leading-[1.9] text-muted min-[960px]:text-[13px]">
              Have a challenge, an idea, or a curious question?
              <br />
              We’d love to hear what’s on your mind.
            </p>
            <ContactButton className="group/text-link inline-flex items-center justify-between gap-7 rounded-[25px] bg-foreground px-5 py-3.5 text-[12px] text-background [transition:background_0.3s] hover:bg-[rgb(213,231,206)] motion-reduce:transition-none">
              Tell us what you’re building <span>↗</span>
            </ContactButton>
          </div>
        </section>
      </main>

      <footer className="mx-auto w-[calc(100%-48px)] max-w-7xl overflow-hidden pt-15 pb-7 min-[600px]:w-[calc(100%-80px)] min-[960px]:w-[calc(100%-144px)] min-[960px]:pt-19.5 min-[960px]:pb-8.75">
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
      <Dialogs />
    </>
  );
}
