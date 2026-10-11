import { CapabilityBackdrop } from "./capability-backdrop";
import {
  CapabilityCard,
  ServiceHeading,
  ServiceNumber,
} from "./capability-card";
import { BrandingArtwork } from "./branding-artwork";

export function BrandingCard() {
  return (
    <CapabilityCard
      variant="chalk"
      className="group/branding flex min-h-68 flex-col items-start justify-between min-[701px]:col-span-8 min-[701px]:row-start-1"
      aria-labelledby="branding-title"
    >
      <CapabilityBackdrop card="branding" />
      <ServiceNumber opacityClassName="opacity-[0.045]">o1</ServiceNumber>
      <div className="relative z-1">
        <ServiceHeading id="branding-title">
          Branding /{" "}
          <em className="inline-block skew-x-6 font-editorial font-normal">
            Design
          </em>
        </ServiceHeading>
        <p className="mt-2 max-w-95 text-[11px] leading-[1.5] text-carbon/80 min-[1001px]:text-[12px]">
          Strategy, naming, identity and art direction. One considered language,
          wherever your brand shows up.
        </p>
      </div>
      <BrandingArtwork />
    </CapabilityCard>
  );
}
