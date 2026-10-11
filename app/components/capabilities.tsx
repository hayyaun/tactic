import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ContactButton } from "./dialog-buttons";

function ServiceHeading({ children, id }: { children: ReactNode; id: string }) {
  return (
    <h3
      id={id}
      className="text-[25px] leading-[1.12] font-[450] tracking-[-0.035em] min-[701px]:text-[clamp(23px,2.15vw,30px)]"
    >
      {children}
    </h3>
  );
}

function ServiceNumber({
  children,
  className = "top-3 right-6",
  opacityClassName = "opacity-[0.09]",
}: {
  children: ReactNode;
  className?: string;
  opacityClassName?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute font-editorial text-[82px] leading-none font-normal tracking-[-0.055em] tabular-nums select-none min-[1001px]:text-[96px] ${opacityClassName} ${className}`}
    >
      {children}
    </span>
  );
}

function SocialFeedArtwork() {
  return (
    <div
      className="social-feed-artwork relative mx-auto my-4 h-62 w-full max-w-85 rounded-xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-carbon/50"
      role="img"
      aria-label="Social campaign concepts: a designed post, campaign artwork and a short film"
      tabIndex={0}
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
            <svg className="h-3 w-2.25">
              <use href="#tactic-mark" />
            </svg>
          </span>
          <span className="text-[8px] font-medium tracking-[-0.02em]">
            tactic.studio
          </span>
          <span className="ml-auto text-[10px] tracking-[0.12em]">···</span>
        </div>
        <div className="relative flex h-38 items-center overflow-hidden rounded-lg bg-[rgb(198,211,174)] px-4">
          <svg className="absolute -right-3 -bottom-6 h-36 w-26 rotate-12 opacity-[0.08]">
            <use href="#tactic-mark" />
          </svg>
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

function SharedCapabilityPlane({ card }: { card: "branding" | "social" }) {
  const fadeId = `capability-shared-fade-${card}`;

  // The two crops share an origin, accounting for the 12px gap before Social.
  return (
    <svg
      aria-hidden="true"
      className={`capability-shared-plane pointer-events-none absolute left-0 h-108 w-132 max-w-none text-carbon min-[701px]:h-180 min-[701px]:w-220 ${card === "branding" ? "-bottom-54 opacity-[0.045] min-[701px]:-bottom-90" : "-top-57 opacity-[0.085] min-[701px]:-top-93"}`}
      viewBox="0 0 880 720"
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.15" />
          <stop offset="0.4" stopColor="currentColor" stopOpacity="0.75" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect
        x="220"
        y="295"
        width="560"
        height="180"
        transform="rotate(-36 500 385)"
        fill={`url(#${fadeId})`}
      />
    </svg>
  );
}

function IndividualCapabilityPlane({ card }: { card: "branding" | "social" }) {
  const fadeId = `capability-plane-fade-${card}`;
  const isBranding = card === "branding";

  return (
    <svg
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 h-full w-full text-carbon ${isBranding ? "opacity-[0.022]" : "opacity-[0.10]"}`}
      viewBox={isBranding ? "0 0 880 260" : "0 0 440 440"}
      preserveAspectRatio={isBranding ? "xMinYMin slice" : "xMaxYMin slice"}
    >
      <defs>
        <linearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="currentColor" stopOpacity="0.3" />
          <stop offset="0.45" stopColor="currentColor" stopOpacity="0.8" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      {isBranding ? (
        <>
          <rect
            className="min-[701px]:hidden"
            x="-90"
            y="-66"
            width="320"
            height="108"
            transform="rotate(-36 130 -12)"
            fill={`url(#${fadeId})`}
          />
          <rect
            className="hidden min-[701px]:block"
            x="-130"
            y="-102"
            width="480"
            height="180"
            transform="rotate(-36 180 -12)"
            fill={`url(#${fadeId})`}
          />
        </>
      ) : (
        <rect
          x="130"
          y="328"
          width="380"
          height="180"
          transform="rotate(-36 320 418)"
          fill={`url(#${fadeId})`}
        />
      )}
    </svg>
  );
}

function CapabilityBackdrop({ card }: { card: "branding" | "social" }) {
  return (
    <>
      <SharedCapabilityPlane card={card} />
      <IndividualCapabilityPlane card={card} />
    </>
  );
}

function IdentityMarks() {
  return (
    <div
      className="relative z-1 grid w-full max-w-160 grid-cols-3 items-center justify-items-center gap-x-8 gap-y-7 px-7 text-[rgb(48,55,43)] min-[701px]:min-h-17 min-[701px]:grid-cols-5 min-[701px]:gap-9 min-[701px]:px-0"
      role="img"
      aria-label="Five selected brand identity logos, reproduced as flat monochrome symbols"
    >
      <svg
        className="h-8 w-full max-w-14 opacity-90 transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none min-[701px]:motion-safe:group-hover/branding:translate-x-2 min-[1001px]:h-10"
        viewBox="90 45 245 370"
        aria-hidden="true"
      >
        <path
          d="M117 59Q117 50 126 50Q135 50 135 59V114H146Q158 114 158 126V331Q158 343 146 343H135V398Q135 408 126 408Q117 408 117 398V343H106Q94 343 94 331V126Q94 114 106 114H117ZM190 115H279Q293 115 293 129V133Q293 145 306 145H316Q330 145 330 159V300Q330 314 316 314H305Q293 314 293 325Q293 334 306 334H318Q330 334 330 346V395Q330 408 318 408H289Q250 408 250 366V356Q250 343 237 343H190Q178 343 178 331V291Q178 278 190 278H251Q266 278 266 262V194Q266 179 251 179H190Q178 179 178 167V127Q178 115 190 115Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="h-8 w-full max-w-14 opacity-90 transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none min-[701px]:motion-safe:group-hover/branding:translate-x-1 min-[1001px]:h-10"
        viewBox="100 60 390 320"
        aria-hidden="true"
      >
        <path
          d="M199 112C181 132 175 157 175 183C175 252 228 307 294 307C362 307 415 254 415 186C415 156 408 133 391 112L410 96Q424 85 432 99C457 133 463 163 461 193C460 229 449 260 433 288L452 308C480 339 442 371 414 346L390 324C365 343 332 354 294 354C202 354 128 278 128 187C128 149 138 116 154 95Q162 82 173 93ZM225 132 294 180 364 132C378 150 384 167 381 189C378 237 340 275 294 275C247 275 209 239 208 191C205 168 214 145 225 132Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="h-8 w-full max-w-14 opacity-90 min-[1001px]:h-10"
        viewBox="59 77 306 303"
        aria-hidden="true"
      >
        <path
          d="M130 106Q217 54 304 115Q318 124 307 131C223 153 155 210 110 326Q107 334 102 329L84 304Q81 300 88 290Q127 224 189 164L193 159Q204 149 189 141L132 122Q117 115 130 106ZM101 145 130 151Q143 154 134 164C103 198 84 234 75 269Q72 277 69 266C58 223 65 183 86 151Q91 142 101 145ZM125 347C167 250 258 188 329 163Q339 160 344 169C354 192 361 224 358 238Q358 247 347 248C267 249 193 287 125 347ZM161 353C214 313 272 288 335 286Q349 285 341 299C307 359 233 393 160 363Q146 358 161 353Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="h-8 w-full max-w-14 opacity-90 transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none min-[701px]:motion-safe:group-hover/branding:-translate-x-1 min-[1001px]:h-10"
        viewBox="0 4 100 94"
        aria-hidden="true"
      >
        <path
          d="M10 78C12 36 29 9 57 8C67 7 75 9 84 10C81 32 65 38 51 50C37 62 24 72 10 78ZM49 94C46 73 50 54 68 43C78 37 87 37 95 38C94 66 87 93 64 95ZM44 66 42 95 9 89Z"
          fill="currentColor"
        />
      </svg>
      <svg
        className="h-8 w-full max-w-14 opacity-90 transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none min-[701px]:motion-safe:group-hover/branding:-translate-x-2 min-[1001px]:h-10"
        viewBox="35 25 146 120"
        aria-hidden="true"
      >
        <path
          d="M43 142C55 82 66 29 109 29C152 29 164 85 175 142H137C147 85 137 32 109 30C80 32 70 86 81 142Z"
          fill="currentColor"
        />
      </svg>
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

      <div className="mb-6 grid gap-3 min-[701px]:mb-7 min-[701px]:grid-cols-[1fr_1.3fr_auto] min-[701px]:items-start min-[701px]:gap-10">
        <p className="text-[22px] font-normal tracking-[-0.035em] min-[701px]:text-[23px]">
          Every move matters.
        </p>
        <p className="max-w-100 text-[12px] leading-[1.75] text-muted min-[701px]:text-[13px]">
          Branding, digital experiences, AI films and social. One considered
          language, wherever your brand shows up.
        </p>
        <span className="hidden pt-1.25 font-mono text-[9px] leading-normal tracking-[0.06em] text-muted min-[701px]:block">
          OUR SPECIALTIES
        </span>
      </div>

      <div
        className="grid gap-3 min-[701px]:grid-cols-12 min-[701px]:grid-rows-[230px_160px_220px] min-[1001px]:grid-rows-[250px_170px_240px] min-[1440px]:grid-rows-[260px_180px_250px]"
        aria-label="TACTIC specialties and studio concepts"
      >
        <article
          className="group/branding relative flex min-h-68 flex-col items-start justify-between overflow-hidden rounded-[25px] bg-chalk p-6 text-carbon shadow-[0_12px_28px_rgb(0_0_0/0.28)] min-[701px]:col-span-8 min-[701px]:row-start-1 min-[701px]:min-h-0 min-[1001px]:p-7"
          aria-labelledby="branding-title"
        >
          <CapabilityBackdrop card="branding" />
          <ServiceNumber>01</ServiceNumber>
          <div className="relative z-1">
            <ServiceHeading id="branding-title">
              Branding / Design
            </ServiceHeading>
            <p className="mt-2 max-w-95 text-[11px] leading-[1.5] text-carbon/80 min-[1001px]:text-[12px]">
              Strategy, naming, identity and art direction. One considered
              language, wherever your brand shows up.
            </p>
          </div>
          <div className="relative my-5 flex w-full justify-center min-[701px]:my-4">
            <svg
              className="pointer-events-none absolute top-1/2 left-0 h-[calc(100%+48px)] w-full -translate-y-1/2 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] text-carbon opacity-[0.07] transition-opacity duration-700 ease-in-out group-hover/branding:opacity-[0.14] motion-reduce:transition-none"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="branding-construction-grid"
                  width="28"
                  height="28"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M28 0H0V28"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.8"
                  />
                </pattern>
              </defs>
              <rect
                width="100%"
                height="100%"
                fill="url(#branding-construction-grid)"
              />
            </svg>
            <IdentityMarks />
          </div>
        </article>

        <article
          className="relative flex min-h-78 flex-col justify-between overflow-hidden rounded-[25px] bg-[rgb(156,172,134)] p-6 text-[rgb(38,48,30)] shadow-[0_12px_28px_rgb(0_0_0/0.28)] min-[701px]:col-span-4 min-[701px]:col-start-1 min-[701px]:row-[2/4] min-[701px]:min-h-0 min-[1001px]:p-7"
          aria-labelledby="social-title"
        >
          <CapabilityBackdrop card="social" />
          <ServiceNumber>03</ServiceNumber>
          <div className="relative z-1">
            <ServiceHeading id="social-title">Social</ServiceHeading>
            <p className="mt-2 max-w-60 text-[11px] leading-[1.5] min-[1001px]:text-[12px]">
              We turn scrolls into stops, and audiences into communities.
            </p>
          </div>
          <SocialFeedArtwork />
          <span className="relative z-1 max-w-55 font-mono text-[8px] leading-[1.7] tracking-[0.03em]">
            Strategy. Content. Community.
          </span>
        </article>

        <div
          className="flex min-h-48 flex-col items-center justify-center overflow-hidden bg-background px-6 py-5 text-center min-[701px]:col-span-4 min-[701px]:col-start-5 min-[701px]:row-start-2 min-[701px]:min-h-0"
          aria-label="TACTIC — the studio connecting our specialties"
        >
          <svg
            className="h-18 w-13 shrink-0 text-[rgb(44,51,40)] min-[1001px]:h-21 min-[1001px]:w-15.25"
            aria-hidden="true"
          >
            <use href="#tactic-mark" />
          </svg>
          <p className="mt-3 font-mono text-[10px] leading-[1.5] text-muted/55 min-[1001px]:text-[11px]">
            One considered language.
          </p>
        </div>

        <article
          className="group/web relative min-h-65 overflow-hidden rounded-[25px] bg-chalk p-6 text-carbon shadow-[0_12px_28px_rgb(0_0_0/0.28)] min-[701px]:col-span-4 min-[701px]:col-start-5 min-[701px]:row-start-3 min-[701px]:min-h-0 min-[1001px]:p-7"
          aria-labelledby="web-app-title"
        >
          <ServiceNumber className="-bottom-2 left-5">04</ServiceNumber>
          <div className="relative z-1 flex h-full max-w-[53%] -translate-y-3 flex-col justify-center min-[701px]:max-w-[60%] min-[1001px]:max-w-[53%]">
            <ServiceHeading id="web-app-title">Web / App</ServiceHeading>
            <p className="mt-2 max-w-42 text-[11px] leading-[1.5] min-[1001px]:text-[12px]">
              We design digital products that turn complex ideas into intuitive,
              seamless experiences.
            </p>
          </div>
          <Image
            src="/studio/web-app-phone.svg"
            width={300}
            height={560}
            alt="A metallic phone displaying TACTIC’s sculptural opposing forms."
            className="absolute top-8 -right-2 w-[52%] max-w-55 transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/web:-translate-y-1.5 motion-reduce:transition-none min-[701px]:top-7 min-[701px]:-right-3 min-[701px]:w-[47%] min-[1001px]:right-1 min-[1001px]:w-[52%]"
            sizes="(min-width: 1001px) 220px, (min-width: 701px) 170px, 52vw"
          />
        </article>

        <article
          className="ability-film-scene group/film relative min-h-100 overflow-hidden rounded-[25px] border border-board-line bg-carbon text-chalk shadow-[0_12px_28px_rgb(0_0_0/0.28)] min-[701px]:col-span-4 min-[701px]:col-start-9 min-[701px]:row-[1/3] min-[701px]:min-h-0"
          aria-labelledby="ai-film-title"
        >
          <Image
            src="/studio/ai-campaign.png"
            alt="A black perfume bottle on volcanic rocks, surrounded by smoke against a green and rose sunset."
            fill
            sizes="(min-width: 701px) 900px, 720px"
            className="object-cover object-[51%_center] saturate-75 transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/film:scale-[1.035] motion-reduce:transition-none"
          />
          <ServiceNumber
            className="top-3 right-6 z-1 min-[1001px]:right-7"
            opacityClassName="opacity-[0.07]"
          >
            02
          </ServiceNumber>
          <div className="absolute right-6 bottom-7 left-6 z-1 min-[1001px]:right-7 min-[1001px]:left-7">
            <ServiceHeading id="ai-film-title">AI / AI Film</ServiceHeading>
            <p className="mt-2 max-w-48 text-[11px] leading-[1.5] text-chalk/85 min-[1001px]:text-[12px]">
              AI-powered films shaped by creative direction. From the first
              story to the final frame.
            </p>
          </div>
        </article>

        <Link
          href="/services"
          className="services-explore group relative flex min-h-60 flex-col justify-between overflow-hidden rounded-[25px] bg-[#2e3731] bg-[linear-gradient(125deg,transparent_40%,rgb(189_136_129/38%)_100%)] p-6 text-chalk shadow-[inset_1px_1px_1px_rgb(171_194_146/24%),inset_-1px_-1px_1px_rgb(189_136_129/22%),0_12px_28px_rgb(0_0_0/0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chalk min-[701px]:col-span-4 min-[701px]:col-start-9 min-[701px]:row-start-3 min-[701px]:min-h-0 min-[1001px]:p-7"
          aria-label="Explore our services"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_12%,rgb(189_136_129/22%)_100%)] opacity-0 transition-opacity duration-1200 ease-in-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
          />
          <div className="relative z-1 flex items-center gap-2 opacity-65">
            <svg className="h-6 w-4.5" aria-hidden="true">
              <use href="#tactic-mark" />
            </svg>
            <span className="text-[18px] font-medium tracking-[-0.055em]">
              TACTIC
            </span>
          </div>
          <svg
            className="services-orbit pointer-events-none absolute top-1/2 right-5 z-1 h-28 w-28 -translate-y-1/2 text-chalk min-[701px]:right-4 min-[701px]:h-22 min-[701px]:w-22 min-[1001px]:right-7 min-[1001px]:h-28 min-[1001px]:w-28"
            viewBox="0 0 112 112"
            aria-hidden="true"
          >
            <circle
              cx="56"
              cy="56"
              r="43"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".12"
            />
            <path
              d="M30 30 48 48M82 30 64 48M30 82 48 64M82 82 64 64"
              fill="none"
              stroke="currentColor"
              strokeOpacity=".2"
            />
            <g fill="currentColor" fillOpacity=".07">
              <circle cx="26" cy="26" r="15" />
              <circle cx="86" cy="26" r="15" />
              <circle cx="26" cy="86" r="15" />
              <circle cx="86" cy="86" r="15" />
            </g>
            <g
              className="font-mono"
              fill="currentColor"
              fillOpacity=".65"
              fontSize="7"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              <text
                className="services-orbit-label"
                style={{ transformOrigin: "26px 26px" }}
                x="26"
                y="26"
              >
                Brand
              </text>
              <text
                className="services-orbit-label"
                style={{ transformOrigin: "86px 26px" }}
                x="86"
                y="26"
              >
                Film
              </text>
              <text
                className="services-orbit-label"
                style={{ transformOrigin: "26px 86px" }}
                x="26"
                y="86"
              >
                Social
              </text>
              <text
                className="services-orbit-label"
                style={{ transformOrigin: "86px 86px" }}
                x="86"
                y="86"
              >
                Digital
              </text>
            </g>
            <use
              href="#tactic-mark"
              x="49"
              y="46"
              width="14"
              height="20"
              opacity=".45"
            />
          </svg>
          <p className="relative z-1 my-5 max-w-[65%] text-[28px] leading-[1.08] tracking-[-0.045em] min-[701px]:max-w-[62%] min-[1001px]:text-[34px]">
            Explore our
            <br />
            <em className="inline-block origin-bottom-left font-editorial font-normal transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-skew-x-8 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-skew-x-8 motion-reduce:transition-none">
              services.
            </em>
          </p>
          <span className="relative z-1 flex items-end justify-between gap-4">
            <span className="font-mono text-[8px] leading-[1.7] tracking-[0.03em] opacity-65 min-[1001px]:text-[9px]">
              Four specialties. One direction.
            </span>
            <svg
              className="h-5 w-5 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
              aria-hidden="true"
            >
              <use href="#arrow-up-right" />
            </svg>
          </span>
        </Link>
      </div>

      <p className="mt-4 font-mono text-[8px] leading-[1.8] tracking-[0.03em] text-muted min-[701px]:text-[9px]">
        Branding & Design / Web & App / AI & AI Film / Social
      </p>

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
