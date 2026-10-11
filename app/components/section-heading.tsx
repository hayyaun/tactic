import type { ReactNode } from "react";

const base = "font-[380] tracking-[-0.045em]";
const standard = "text-[clamp(37px,8.7vw,61px)] leading-[1.12]";
const headingClasses = {
  world: `${base} ${standard} min-[960px]:text-[58px]`,
  studio: `${base} ${standard} min-[960px]:text-[63px]`,
  contact: `${base} text-[clamp(38px,9vw,83px)] leading-[1.13] min-[960px]:text-[clamp(59px,5.6vw,84px)]`,
} as const;

export function SectionHeading({
  children,
  id,
  variant,
}: {
  children: ReactNode;
  id: string;
  variant: keyof typeof headingClasses;
}) {
  return (
    <h2 id={id} className={headingClasses[variant]}>
      {children}
    </h2>
  );
}
