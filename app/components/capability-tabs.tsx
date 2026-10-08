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
        className="ability-tabs"
        role="tablist"
        aria-label="Explore our capabilities"
      >
        {tabs.map((tab, i) => (
          <button
            key={tab.id}
            ref={(node) => {
              refs.current[i] = node;
            }}
            className="ability-tab"
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
          className="ability-panel"
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
