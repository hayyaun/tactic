import type { ReactNode } from "react";

export function SectionLabel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="flex justify-between gap-5 font-mono text-[9px] leading-[1.7] font-normal tracking-wider text-muted uppercase">
      <span>{label}</span>
      {children}
    </div>
  );
}

const principles = [
  {
    number: "01",
    title: "Think clearly.",
    description:
      "Find what matters. Give the idea a purpose before giving it a form.",
  },
  {
    number: "02",
    title: "Make it distinct.",
    description:
      "Bring a fresh perspective. Build something that could only be yours.",
  },
  {
    number: "03",
    title: "Move together.",
    description:
      "Keep the conversation open. Turn shared ambition into a clear next step.",
  },
];

export function StudioPrinciples() {
  return (
    <div className="mt-16.25 grid gap-8.25 min-[600px]:grid-cols-[repeat(3,minmax(0px,1fr))] min-[600px]:gap-8 min-[960px]:mt-23 min-[960px]:gap-17.5">
      {principles.map(({ number, title, description }) => (
        <div key={number} className="pt-6 [border-top:1px_solid_var(--line)]">
          <span className="font-mono text-[9px] text-green">{number}</span>
          <h3 className="mt-5.75 text-[24px] font-[350] tracking-[-0.035em] min-[600px]:text-[21px] min-[960px]:text-[27px]">
            {title}
          </h3>
          <p className="mt-3.5 max-w-72.5 text-[12px] leading-[1.85] text-muted min-[600px]:text-[11px] min-[960px]:text-[12px]">
            {description}
          </p>
        </div>
      ))}
    </div>
  );
}
