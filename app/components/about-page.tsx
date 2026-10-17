import Image from "next/image";
import { ContactButton } from "./dialog-buttons";
import type { ContentPage as PageContent } from "../content/types";
import { breadcrumbSchema, serializeJsonLd } from "../lib/structured-data";
import { ContentBlocks } from "./content-blocks";
import { SiteHeader } from "./site-header";
import { SiteFooter } from "./site-footer";
import { ArrowUpRight, TacticMark } from "./ui/icons";
import { Breadcrumbs } from "./breadcrumbs";
import { contentBreadcrumbs } from "../lib/content-breadcrumbs";

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

export function AboutPage({ content }: { content: PageContent }) {
  const breadcrumbs = contentBreadcrumbs(content);
  const team = content.team ?? [];
  const hasStudies = team.some((member) => member.isPlaceholder);
  const cardRhythms = [
    "min-[960px]:-rotate-3",
    "mt-12 min-[960px]:mt-20 min-[960px]:rotate-2",
    "min-[960px]:mt-6 min-[960px]:-rotate-2",
    "mt-12 min-[960px]:mt-16 min-[960px]:rotate-3",
  ];
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(breadcrumbSchema(breadcrumbs)),
        }}
      />
      <SiteHeader path={content.path} />
      <main id="page-content" tabIndex={-1} className="pb-20 min-[960px]:pb-28">
        <section
          className="studio-container pt-12 min-[600px]:pt-20 min-[960px]:pt-24"
          aria-labelledby="about-title"
        >
          <div className="flex items-center justify-between gap-6 font-mono text-[10px] leading-relaxed text-green uppercase">
            <Breadcrumbs
              items={breadcrumbs}
              className="font-mono text-[10px] leading-relaxed text-green uppercase"
            />
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
                Different minds.
                <br />
                <em className="font-editorial font-normal text-green">
                  Same frequency.
                </em>
              </h2>
            </div>
            <p className="max-w-lg text-[16px] leading-[1.85] text-muted">
              {content.teamIntro ||
                "No one sees the same brief in quite the same way. We bring different perspectives into the conversation, then give the work one clear direction."}
            </p>
          </div>
          {team.length > 0 ? (
            <div className="grid grid-cols-2 items-start gap-x-5 gap-y-9 py-5 min-[600px]:gap-x-8 min-[960px]:grid-cols-4 min-[960px]:gap-x-7 min-[960px]:py-12">
              {team.map((member, index) => (
                <article
                  key={member.key}
                  className={`group min-w-0 ${cardRhythms[index % cardRhythms.length]}`}
                >
                  <div className="border border-chalk/20 bg-chalk p-2 text-carbon shadow-[0_12px_30px_rgb(0_0_0/12%)] min-[600px]:p-3">
                    <div className="mb-2 flex items-center justify-between gap-3 font-mono text-[8px] uppercase min-[600px]:mb-3 min-[600px]:text-[9px]">
                      <span>TACTIC / PEOPLE</span>
                      <RegistrationMark className="size-4 shrink-0" />
                    </div>
                    <div className="relative overflow-hidden bg-sage">
                      <Image
                        {...member.portrait}
                        alt={member.portrait.alt}
                        className="aspect-[4/5] w-full object-cover motion-safe:transition-transform motion-safe:duration-500 motion-safe:group-hover:scale-[1.04]"
                        sizes="(max-width: 599px) calc((100vw - 88px) / 2), (max-width: 959px) 43vw, 23vw"
                      />
                      <span
                        className="absolute bottom-0 left-2 text-[clamp(3.8rem,7vw,7rem)] leading-[.85] font-[350] tracking-[-.08em] text-chalk mix-blend-difference"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2 font-mono text-[8px] uppercase min-[600px]:mt-3 min-[600px]:text-[9px]">
                      <span>
                        {member.isPlaceholder ? "CHARACTER STUDY" : "ONE OF US"}
                      </span>
                      <span aria-hidden="true">↗</span>
                    </div>
                  </div>
                  <div className="mt-5 min-[960px]:rotate-0">
                    <p className="font-mono text-[9px] leading-relaxed wrap-anywhere text-green uppercase min-[600px]:text-[10px]">
                      {member.role}
                    </p>
                    <h3 className="mt-2 text-[clamp(1.4rem,2.4vw,2rem)] leading-[1.08] font-[400] tracking-[-.035em] wrap-anywhere">
                      {member.name}
                    </h3>
                    {member.bio && (
                      <p className="mt-3 text-[12px] leading-[1.8] wrap-anywhere text-muted min-[600px]:text-[13px]">
                        {member.bio}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="border-y border-line py-10 text-[18px] text-muted">
              New introductions are on their way.
            </p>
          )}
          {hasStudies && (
            <div className="mt-9 flex flex-wrap items-start justify-between gap-4 border-y border-line py-5 min-[960px]:mt-14">
              <p className="font-mono text-[9px] text-green uppercase">
                CASTING NOTES / ILLUSTRATED STAND-INS
              </p>
              <p className="max-w-md text-[12px] leading-[1.8] text-muted">
                Cards marked “Character study” are fictional portrait studies.
                They’ll make way for more of our team.
              </p>
            </div>
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
            <ContactButton preset="contact">
              Tell us what you&apos;re thinking{" "}
              <ArrowUpRight className="size-4" />
            </ContactButton>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
