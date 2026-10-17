import type { SVGProps } from "react";

export function TacticMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 55" {...props}>
      <path d="M1 9 8 0 24 13 31 4 40 11 26 29Z" fill="currentColor" />
      <path d="M1 43 15 26 40 46 33 55 17 42 10 51Z" fill="currentColor" />
    </svg>
  );
}

export function ArrowUpRight({
  className = "",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path
        d="M5 19 19 5M5 5h14v14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ChevronRight({
  className = "",
  ...props
}: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      className={`shrink-0 ${className}`}
      {...props}
    >
      <path
        d="m9 5 7 7-7 7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      {...props}
    >
      <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
    </svg>
  );
}

const directions = {
  "up-right": "M5 19L19 5M5 5H19V19",
  "down-right": "M5 5L19 19M5 19H19V5",
  down: "M12 4V20M5 13L12 20L19 13",
  up: "M12 20V4M5 11L12 4L19 11",
};

export function DirectionArrow({
  direction = "up-right",
  className,
}: {
  direction?: keyof typeof directions;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`direction-arrow shrink-0 items-center justify-center ${className ?? ""}`}
    >
      <svg
        viewBox="0 0 24 24"
        width="1em"
        height="1em"
        fill="none"
        focusable="false"
        className="block shrink-0"
      >
        <path
          d={directions[direction]}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
