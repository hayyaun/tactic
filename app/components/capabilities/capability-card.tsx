import type { HTMLAttributes, ReactNode } from "react";
import Link from "next/link";

const surfaces = {
  chalk: "bg-chalk p-6 text-carbon min-[1001px]:p-7",
  social: "bg-[rgb(156,172,134)] p-6 text-[rgb(38,48,30)] min-[1001px]:p-7",
  film: "border border-board-line bg-carbon text-chalk",
};

export function CapabilityCard({
  variant = "chalk",
  className = "",
  children,
  href,
  ...props
}: HTMLAttributes<HTMLElement> & {
  variant?: keyof typeof surfaces;
  href: string;
}) {
  return (
    <article
      {...props}
      className={`capability-card relative cursor-pointer overflow-hidden rounded-[25px] shadow-[0_12px_28px_rgb(0_0_0/0.28)] min-[701px]:min-h-0 ${surfaces[variant]} ${className}`}
    >
      {children}
      <Link
        href={href}
        aria-labelledby={props["aria-labelledby"]}
        className="absolute inset-0 z-3 rounded-[25px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current"
      />
      <svg
        className={`capability-navigation pointer-events-none absolute bottom-5 z-2 h-4 w-16 overflow-visible text-current ${href === "/services/web-app" ? "left-6 min-[1001px]:left-7" : "right-6 min-[1001px]:right-7"}`}
        viewBox="0 0 64 16"
        fill="none"
        aria-hidden="true"
      >
        <path
          className="capability-navigation-line"
          d="M0 8H63"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          className="capability-navigation-head"
          d="M55 0L63 8"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </article>
  );
}

export function ServiceHeading({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <h3
      id={id}
      className="text-[25px] leading-[1.12] font-[450] tracking-[-0.035em] min-[701px]:text-[clamp(23px,2.15vw,30px)]"
    >
      {children}
    </h3>
  );
}

export function ServiceNumber({
  children,
  mobileNumber,
  className = "top-3 right-6",
  opacityClassName = "opacity-[0.07]",
}: {
  children: string;
  mobileNumber?: string;
  className?: string;
  opacityClassName?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`capability-number pointer-events-none absolute inline-flex items-start font-editorial text-[144px] leading-none font-normal tracking-[-0.055em] lining-nums select-none min-[701px]:text-[164px] min-[1001px]:text-[192px] ${opacityClassName} ${className}`}
    >
      <span className="capability-number-prefix relative -top-[0.23em]">
        {children[0]}
      </span>
      <span className="capability-number-digit">
        {mobileNumber ? (
          <>
            <span className="min-[701px]:hidden">{mobileNumber}</span>
            <span className="hidden min-[701px]:inline">
              {children.slice(1)}
            </span>
          </>
        ) : (
          children.slice(1)
        )}
      </span>
    </span>
  );
}
