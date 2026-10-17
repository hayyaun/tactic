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
