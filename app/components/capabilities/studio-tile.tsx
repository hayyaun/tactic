import { TacticMark } from "../ui/icons";

export function StudioTile() {
  return (
    <div
      className="flex min-h-48 flex-col items-center justify-center overflow-hidden bg-background px-6 py-5 text-center min-[701px]:col-span-4 min-[701px]:col-start-5 min-[701px]:row-start-2 min-[701px]:min-h-0"
      aria-label="TACTIC — the studio connecting our specialties"
    >
      <TacticMark
        className="h-18 w-13 shrink-0 text-[rgb(44,51,40)] min-[1001px]:h-21 min-[1001px]:w-15.25"
        aria-hidden="true"
      />
      <p className="mt-3 font-mono text-[10px] leading-[1.5] text-muted/55 min-[1001px]:text-[11px]">
        One considered language.
      </p>
    </div>
  );
}
