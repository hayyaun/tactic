import { ContactButton } from "./dialog-buttons";
import { ArrowUpRight } from "./ui/icons";
import { AiFilmCard } from "./capabilities/ai-film-card";
import { BrandingCard } from "./capabilities/branding-card";
import { ServicesExploreCard } from "./capabilities/services-explore-card";
import { SocialCard } from "./capabilities/social-card";
import { StudioTile } from "./capabilities/studio-tile";
import { WebAppCard } from "./capabilities/web-app-card";

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
        <BrandingCard />

        <SocialCard />

        <StudioTile />

        <WebAppCard />

        <AiFilmCard />

        <ServicesExploreCard />
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
        <ContactButton preset="capability">
          Start a conversation
          <ArrowUpRight
            className="h-3 w-3 min-[701px]:h-3.5 min-[701px]:w-3.5"
            aria-hidden="true"
          />
        </ContactButton>
      </div>
    </section>
  );
}
