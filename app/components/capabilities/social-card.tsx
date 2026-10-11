import { CapabilityBackdrop } from "./capability-backdrop";
import {
  CapabilityCard,
  ServiceHeading,
  ServiceNumber,
} from "./capability-card";
import { SocialFeedArtwork } from "./social-feed-artwork";

export function SocialCard() {
  return (
    <CapabilityCard
      variant="social"
      className="ability-social-scene flex min-h-78 flex-col justify-between min-[701px]:col-span-4 min-[701px]:col-start-1 min-[701px]:row-[2/4]"
      aria-labelledby="social-title"
    >
      <CapabilityBackdrop card="social" />
      <ServiceNumber mobileNumber="2">o3</ServiceNumber>
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
    </CapabilityCard>
  );
}
