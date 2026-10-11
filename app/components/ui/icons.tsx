import type { SVGProps } from "react";

export function TacticMark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 40 55" {...props}>
      <path d="M1 9 8 0 24 13 31 4 40 11 26 29Z" fill="currentColor" />
      <path d="M1 43 15 26 40 46 33 55 17 42 10 51Z" fill="currentColor" />
    </svg>
  );
}

export function ArrowUpRight(props: SVGProps<SVGSVGElement>) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" {...props}>
      <path
        d="M5 19 19 5M5 5h14v14"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
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

const directions = { "up-right": "↗", "down-right": "↘", down: "↓", up: "↑" };

export function DirectionArrow({
  direction = "up-right",
  className,
}: {
  direction?: keyof typeof directions;
  className?: string;
}) {
  return (
    <span aria-hidden="true" className={className}>
      {directions[direction]}
    </span>
  );
}
