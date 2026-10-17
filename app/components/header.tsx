"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactButton } from "./dialog-buttons";
import { ArrowUpRight, DirectionArrow, TacticMark } from "./ui/icons";
const navigation = [
  {
    section: "#capabilities",
    page: "/services",
    label: "What we do",
    number: "01",
  },
  {
    section: "#work",
    page: "/portfolio",
    label: "Selected work",
    number: "02",
  },
  { section: "#studio", page: "/about", label: "The studio", number: "03" },
];

export function Header({
  sectionLinks = true,
  activePage,
}: {
  sectionLinks?: boolean;
  activePage?: string;
}) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 960px)");
    const close = () => setOpen(false);
    const key = (e: KeyboardEvent) => {
      if (
        e.key === "Escape" &&
        toggle.current?.getAttribute("aria-expanded") === "true"
      ) {
        close();
        toggle.current.focus({ preventScroll: true });
      }
    };
    media.addEventListener("change", close);
    document.addEventListener("keydown", key);
    return () => {
      media.removeEventListener("change", close);
      document.removeEventListener("keydown", key);
    };
  }, []);
  return (
    <>
      <header className="fixed top-4 left-1/2 z-20 mx-auto flex h-17 w-[calc(100%-48px)] max-w-7xl -translate-x-1/2 items-center justify-between gap-1.75 rounded-[18px] border border-line bg-[rgba(27,32,27,0.79)] py-0 pr-2 pl-3 shadow-[0_12px_35px_rgba(0,0,0,0.11)] backdrop-blur-[22px] min-[360px]:gap-3 min-[360px]:pr-3.75 min-[360px]:pl-5 min-[600px]:top-6 min-[600px]:h-18.5 min-[600px]:w-[calc(100%-80px)] min-[600px]:rounded-[20px] min-[600px]:px-4.5 min-[960px]:w-[calc(100%-112px)] min-[960px]:max-w-315 min-[960px]:pl-6">
        <Link
          className="flex items-center gap-1.75 text-[16px] font-[550] tracking-[-0.5px] min-[360px]:gap-2.25 min-[360px]:text-[18px] min-[960px]:gap-2.75 min-[960px]:text-[21px]"
          href={sectionLinks ? "#top" : "/"}
          aria-label="TACTIC home"
        >
          <TacticMark
            className="h-5.25 w-3.75 text-green min-[360px]:h-6 min-[360px]:w-4.25 min-[960px]:h-7 min-[960px]:w-5"
            aria-hidden="true"
          />
          <span>TACTIC</span>
        </Link>
        <nav
          className="hidden gap-8.5 text-[12px] text-muted min-[960px]:flex"
          aria-label="Main navigation"
        >
          {navigation.map(({ section, page, label }) => (
            <Link
              key={page}
              className="[transition:color_0.2s] hover:text-foreground aria-[current=page]:text-green motion-reduce:transition-none"
              href={sectionLinks ? section : page}
              aria-current={activePage === page ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
        </nav>
        <ContactButton preset="header">
          Let’s talk <ArrowUpRight className="h-2.75 w-2.75" />
        </ContactButton>
        <button
          ref={toggle}
          id="navigation-toggle"
          className="group/menu-toggle flex h-11 w-10 flex-[0_0_40px] flex-col items-center justify-center gap-1.25 bg-transparent p-2.5 min-[960px]:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          <span className="h-px w-4.25 bg-foreground [transition:transform_0.2s] group-aria-expanded/menu-toggle:transform-[translateY(3px)_rotate(45deg)] motion-reduce:transition-none"></span>
          <span className="h-px w-4.25 bg-foreground [transition:transform_0.2s] group-aria-expanded/menu-toggle:transform-[translateY(-3px)_rotate(-45deg)] motion-reduce:transition-none"></span>
        </button>
      </header>
      <nav
        className="fixed top-23.25 right-6 left-6 z-19 grid rounded-[18px] border border-line bg-[rgba(27,32,27,0.96)] px-6 py-5 backdrop-blur-xl min-[600px]:top-27.25 min-[600px]:right-10 min-[600px]:left-10 min-[960px]:hidden"
        id="mobile-menu"
        onClick={() => setOpen(false)}
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {navigation.map(({ section, page, label, number }) => (
          <Link
            key={page}
            className="flex justify-between bg-transparent px-0 py-4.25 text-left text-[23px] font-[350] aria-[current=page]:text-green"
            href={sectionLinks ? section : page}
            aria-current={activePage === page ? "page" : undefined}
          >
            {label}{" "}
            <span className="font-mono text-[10px] text-green">{number}</span>
          </Link>
        ))}

        <ContactButton preset="menu">
          Let’s talk{" "}
          <DirectionArrow className="font-mono text-[10px] text-inherit" />
        </ContactButton>
      </nav>
      {!sectionLinks && (
        <noscript>
          <nav
            aria-label="Main navigation"
            className="studio-container flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-muted min-[960px]:hidden"
          >
            {navigation.map(({ page, label }) => (
              <Link
                key={page}
                href={page}
                aria-current={activePage === page ? "page" : undefined}
                className="inline-flex min-h-11 items-center hover:text-foreground aria-[current=page]:text-green"
              >
                {label}
              </Link>
            ))}
          </nav>
        </noscript>
      )}
    </>
  );
}
