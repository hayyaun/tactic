"use client";
import { useRef, useState, type ReactNode, type KeyboardEvent } from "react";
const tabs = [
  { id: "brand", label: "Brand & design" },
  { id: "digital", label: "Web & apps" },
  { id: "film", label: "AI ad films" },
];
export function CapabilityTabs({ panels }: { panels: ReactNode[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  function navigate(event: KeyboardEvent, index: number) {
    const keys: Record<string, number> = {
      ArrowRight: (index + 1) % 3,
      ArrowLeft: (index + 2) % 3,
      Home: 0,
      End: 2,
    };
    const next = keys[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }
  return (
    <>
      <div
        className="mb-8 flex flex-wrap gap-1.5 min-[701px]:mb-12 min-[701px]:gap-2"
        role="tablist"
        aria-label="Explore our capabilities"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[i] = node;
            }}
            className="rounded-[50px] border border-transparent bg-[rgba(255,255,255,0.04)] px-3.25 py-3 text-[10px] text-muted [transition:color_180ms,background_180ms] hover:bg-[rgba(255,255,255,0.08)] hover:text-foreground focus-visible:[outline:2px_solid_var(--green)] focus-visible:outline-offset-1 aria-selected:bg-green aria-selected:text-background aria-selected:hover:bg-[color-mix(in_srgb,var(--green)_88%,var(--text))] motion-reduce:transition-none min-[381px]:px-3.75 min-[381px]:text-[11px] min-[701px]:px-5.5 min-[701px]:py-3.5 min-[701px]:text-[12px]"
            type="button"
            role="tab"
            id={`ability-tab-${tab.id}`}
            aria-controls={`ability-panel-${tab.id}`}
            aria-selected={active === i}
            tabIndex={active === i ? 0 : -1}
            onClick={() => setActive(i)}
            onKeyDown={(e) => navigate(e, i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.id}
          className="outline-offset-10 focus-visible:[outline:2px_solid_var(--green)] focus-visible:outline-offset-1"
          role="tabpanel"
          id={`ability-panel-${tab.id}`}
          aria-labelledby={`ability-tab-${tab.id}`}
          tabIndex={0}
          hidden={active !== i}
        >
          {panels[i]}
        </div>
      ))}
    </>
  );
}
