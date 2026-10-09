"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ContactButton } from "./dialog-buttons";
const navigation = [
  { href: "#capabilities", label: "What we do", number: "01" },
  { href: "#world", label: "Our world", number: "02" },
  { href: "#studio", label: "The studio", number: "03" },
];

export function Header() {
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
          href="#top"
          aria-label="TACTIC home"
        >
          <svg
            className="h-5.25 w-3.75 text-green min-[360px]:h-6 min-[360px]:w-4.25 min-[960px]:h-7 min-[960px]:w-5"
            aria-hidden="true"
          >
            <use href="#tactic-mark" />
          </svg>
          <span>TACTIC</span>
        </Link>
        <nav
          className="hidden gap-8.5 text-[12px] text-muted min-[960px]:flex"
          aria-label="Main navigation"
        >
          {navigation.map(({ href, label }) => (
            <Link
              key={href}
              className="[transition:color_0.2s] hover:text-foreground motion-reduce:transition-none"
              href={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <ContactButton className="ml-auto flex items-center gap-2.25 rounded-[28px] bg-foreground px-2.75 py-2.5 text-[10px] whitespace-nowrap text-background [transition:background_0.3s,color_0.3s] hover:bg-[rgb(213,231,206)] hover:text-background motion-reduce:transition-none min-[360px]:gap-3.25 min-[360px]:px-3.5 min-[360px]:py-2.75 min-[360px]:text-[11px] min-[960px]:ml-0 min-[960px]:gap-5.75 min-[960px]:px-4.5 min-[960px]:py-3 min-[960px]:text-[12px]">
          Let’s talk{" "}
          <svg className="h-2.75 w-2.75" aria-hidden="true">
            <use href="#arrow-up-right" />
          </svg>
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
        {navigation.map(({ href, label, number }) => (
          <Link
            key={href}
            className="flex justify-between bg-transparent px-0 py-4.25 text-left text-[23px] font-[350]"
            href={href}
          >
            {label}{" "}
            <span className="font-mono text-[10px] text-green">{number}</span>
          </Link>
        ))}

        <ContactButton className="mx-0 mt-2.5 mb-0 flex justify-between rounded-[28px] bg-foreground px-4.25 py-3.25 text-left text-[17px] font-[350] text-background">
          Let’s talk{" "}
          <span className="font-mono text-[10px] text-inherit">↗</span>
        </ContactButton>
      </nav>
    </>
  );
}
