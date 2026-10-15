import Image from "next/image";
import Link from "next/link";
import type { ContentPage as PageContent } from "../content/types";
import { breadcrumbSchema, serializeJsonLd } from "../lib/structured-data";
import { ContentBlocks } from "./content-blocks";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ArrowUpRight, TacticMark } from "./ui/icons";

function RegistrationMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path d="M12 0v24M0 12h24" stroke="currentColor" strokeWidth="1" />
      <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth=".7" />
    </svg>
  );
}

function PortraitStudy({ index }: { index: number }) {
  const tones = ["bg-sage", "bg-chalk", "bg-rose", "bg-sage"];
  return (
    <figure className={index % 2 ? "min-[960px]:pt-14" : ""}>
      <div
        className={`relative aspect-[4/5] overflow-hidden text-carbon ${tones[index]}`}
      >
        <span className="absolute top-5 left-5 font-mono text-[10px]">
          0{index + 1} / STUDY
        </span>
        <RegistrationMark className="absolute top-4 right-4 size-6" />
        <svg
          viewBox="0 0 320 400"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <path
            d="M0 300h320M0 200h320M0 100h320M80 0v400M160 0v400M240 0v400"
            fill="none"
            stroke="currentColor"
            strokeWidth=".5"
            opacity=".18"
          />
          <g transform={index % 2 ? "translate(320 0) scale(-1 1)" : undefined}>
            <path
              d="M45 400c0-76 39-126 101-132v-39c-30-13-47-42-47-82 0-52 27-85 67-85 44 0 70 35 70 84l15 31-23 9c-3 33-17 52-39 55v28c56 15 88 61 88 131Z"
              fill="currentColor"
              opacity=".88"
            />
            <path
              d="M168 66c-39 25-49 68-23 114 9 16 13 48-1 84"
              fill="none"
              stroke="var(--color-chalk)"
              strokeWidth="1.4"
              opacity=".6"
            />
            <circle cx="201" cy="147" r="3" fill="var(--color-sage)" />
          </g>
          <path
            d="M24 372h272"
            stroke="currentColor"
            strokeWidth=".5"
            opacity=".4"
          />
        </svg>
        <span className="absolute right-5 bottom-5 left-5 font-mono text-[9px] tracking-[.08em] text-chalk">
          A DIFFERENT POINT OF VIEW
        </span>
      </div>
      <figcaption className="mt-4 flex justify-between gap-3 font-mono text-[10px] text-muted">
        <span>Portrait study</span>
        <span>0{index + 1}</span>
      </figcaption>
    </figure>
  );
}

export function AboutPage({ content }: { content: PageContent }) {
  const team = content.team ?? [];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "About Tactic", path: "/about" },
            ]),
          ),
        }}
      />
      <SiteHeader />
      <main id="page-content" tabIndex={-1} className="pb-20 min-[960px]:pb-28">
        <section
          className="studio-container pt-12 min-[600px]:pt-20 min-[960px]:pt-24"
          aria-labelledby="about-title"
        >
          <div className="flex items-center justify-between gap-6 font-mono text-[10px] leading-relaxed text-green uppercase">
            <p>{content.eyebrow || "TACTIC / AN INDEPENDENT POINT OF VIEW"}</p>
            <RegistrationMark className="size-7 shrink-0" />
          </div>
          <div className="mt-10 grid gap-10 min-[960px]:grid-cols-[1.6fr_1fr] min-[960px]:items-end min-[960px]:gap-20">
            <h1
              id="about-title"
              className="max-w-[13ch] text-[clamp(3.4rem,8.4vw,8rem)] leading-[.98] font-[380] tracking-[-.065em] wrap-anywhere"
            >
              {content.title}
            </h1>
            <div className="pb-2">
              <TacticMark className="mb-8 h-16 w-12 text-green min-[960px]:mb-12 min-[960px]:h-24 min-[960px]:w-18" />
              <p className="max-w-md text-[17px] leading-[1.8] text-muted min-[960px]:text-[19px]">
                {content.description}
              </p>
              <a
                href="#people"
                className="mt-7 inline-flex min-h-11 items-center gap-7 border-b border-green/50 pb-2 text-[12px]"
              >
                The people & the perspective <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
          <div className="mt-12 flex flex-wrap justify-between gap-4 border-t border-line py-5 font-mono text-[9px] tracking-[.08em] text-muted uppercase min-[960px]:mt-20">
            <span>Independent minds / Collective ambition</span>
            <span>Identity · Digital · Film · Social</span>
          </div>
        </section>

        <section
          id="people"
          aria-labelledby="people-title"
          className="studio-container mt-12 min-[960px]:mt-20"
        >
          <div className="mb-10 grid gap-6 min-[960px]:grid-cols-[1fr_1fr] min-[960px]:items-end min-[960px]:gap-20">
            <div>
              <p className="font-mono text-[10px] text-green uppercase">
                01 / THE PEOPLE
              </p>
              <h2
                id="people-title"
                className="mt-5 text-[clamp(2.6rem,5.2vw,4.8rem)] leading-[1.04] font-[380] tracking-[-.045em]"
              >
                The <em className="font-editorial font-normal">human</em> index.
              </h2>
            </div>
            <p className="max-w-lg text-[16px] leading-[1.85] text-muted">
              {content.teamIntro ||
                "No one sees the same brief in quite the same way. We bring different perspectives into the conversation, then give the work one clear direction."}
            </p>
          </div>
          {team.length > 0 ? (
            <div className="grid items-start gap-x-8 gap-y-12 min-[600px]:grid-cols-2 min-[1100px]:grid-cols-3 min-[1100px]:gap-x-12">
              {team.map((member, index) => (
                <article
                  key={member.key}
                  className={
                    index % 3 === 1 ? "min-w-0 min-[1100px]:pt-16" : "min-w-0"
                  }
                >
                  <div className="relative overflow-hidden bg-sage">
                    <Image
                      {...member.portrait}
                      alt={member.portrait.alt}
                      className="aspect-[4/5] w-full object-cover contrast-110 grayscale"
                      sizes="(max-width: 599px) calc(100vw - 48px), (max-width: 1099px) 46vw, 30vw"
                    />
                    <span className="absolute top-4 left-4 bg-carbon px-3 py-2 font-mono text-[10px] text-chalk">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <RegistrationMark className="absolute right-4 bottom-4 size-7 text-chalk" />
                  </div>
                  <div className="mt-5 border-t border-line pt-4">
                    <p className="font-mono text-[10px] leading-relaxed wrap-anywhere text-green uppercase">
                      {member.role}
                    </p>
                    <h3 className="mt-2 text-[27px] leading-tight font-[400] tracking-[-.03em] wrap-anywhere">
                      {member.name}
                    </h3>
                    {member.bio && (
                      <p className="mt-4 text-[14px] leading-[1.85] wrap-anywhere text-muted">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <>
              {content.hero ? (
                <Image
                  {...content.hero}
                  alt={content.hero.alt}
                  className="h-auto w-full"
                  sizes="(max-width: 600px) calc(100vw - 48px), (max-width: 960px) calc(100vw - 80px), 1280px"
                />
              ) : (
                <div className="grid grid-cols-2 items-start gap-4 min-[600px]:gap-8 min-[960px]:grid-cols-4">
                  {[0, 1, 2, 3].map((index) => (
                    <PortraitStudy key={index} index={index} />
                  ))}
                </div>
              )}
              <div className="mt-6 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-6">
                <p className="font-mono text-[10px] text-green uppercase">
                  STUDIO STUDIES / PORTRAITS TO FOLLOW
                </p>
                <p className="max-w-md text-[13px] leading-[1.8] text-muted">
                  Abstract studies hold the space for our people. Individual
                  portraits and introductions will appear here.
                </p>
              </div>
            </>
          )}
        </section>

        <section
          className="studio-container mt-20 grid gap-10 border-t border-line pt-10 min-[960px]:mt-28 min-[960px]:grid-cols-[.8fr_1.2fr] min-[960px]:gap-24 min-[960px]:pt-14"
          aria-label="Our point of view"
        >
          <div>
            <p className="font-mono text-[10px] text-green uppercase">
              02 / A SHARED WAY OF SEEING
            </p>
            <p className="mt-7 max-w-[10ch] text-[clamp(2.5rem,4.5vw,4.5rem)] leading-[1.05] font-[380] tracking-[-.045em]">
              Good instinct.
              <br />
              <em className="font-editorial font-normal text-green">
                Clear intent.
              </em>
            </p>
          </div>
          <div className="max-w-3xl min-w-0 space-y-7">
            <ContentBlocks blocks={content.blocks} />
          </div>
        </section>

        <section
          className="studio-container mt-20 border-t border-line pt-10 min-[960px]:mt-28 min-[960px]:pt-14"
          aria-labelledby="about-next"
        >
          <p className="font-mono text-[10px] text-green uppercase">
            03 / YOUR NEXT MOVE
          </p>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-8">
            <h2
              id="about-next"
              className="max-w-[15ch] text-[clamp(2.6rem,5vw,5rem)] leading-[1.05] font-[380] tracking-[-.045em]"
            >
              A new perspective <br />
              starts with{" "}
              <em className="font-editorial font-normal text-green">
                a conversation.
              </em>
            </h2>
            <Link
              href="/#contact"
              className="inline-flex min-h-14 items-center justify-between gap-10 rounded-full bg-foreground px-7 py-4 text-[13px] text-background hover:bg-green"
            >
              Tell us what you&apos;re thinking{" "}
              <ArrowUpRight className="size-4" />
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
