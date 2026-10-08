"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ContactButton } from "./interactions";
export function Header() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const media = window.matchMedia("(min-width: 960px)");
    const close = () => setOpen(false);
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
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
      <header className="site-header shell">
        <Link className="brand" href="#top" aria-label="TACTIC home">
          <svg className="brand-mark" aria-hidden="true">
            <use href="#tactic-mark" />
          </svg>
          <span>TACTIC</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link href="#capabilities">What we do</Link>
          <Link href="#world">Our world</Link>
          <Link href="#studio">The studio</Link>
        </nav>
        <ContactButton className="header-contact">
          Let’s talk{" "}
          <svg aria-hidden="true">
            <use href="#arrow-up-right" />
          </svg>
        </ContactButton>
        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen(!open)}
        >
          <span></span>
          <span></span>
        </button>
      </header>
      <nav
        className="mobile-menu"
        id="mobile-menu"
        onClick={() => setOpen(false)}
        aria-label="Mobile navigation"
        hidden={!open}
      >
        <Link href="#capabilities">
          What we do <span>01</span>
        </Link>
        <Link href="#world">
          Our world <span>02</span>
        </Link>
        <Link href="#studio">
          The studio <span>03</span>
        </Link>
        <ContactButton>
          Let’s talk <span>↗</span>
        </ContactButton>
      </nav>
    </>
  );
}
