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

export function CapabilityBackdrop({ card }: { card: "branding" | "social" }) {
  return (
    <>
      <SharedCapabilityPlane card={card} />
      <IndividualCapabilityPlane card={card} />
    </>
  );
}
