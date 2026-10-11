import { TacticMark } from "../ui/icons";

export function ServicesOrbit() {
  return (
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
      <TacticMark x="49" y="46" width="14" height="20" opacity=".45" />
    </svg>
  );
}
