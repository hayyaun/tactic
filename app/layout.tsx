import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import "./base.css";
import "./artwork.css";

const geist = localFont({
  src: "../public/studio/geist-latin.woff2",
  variable: "--font-geist-sans",
  weight: "100 900",
  display: "swap",
});
const mono = localFont({
  src: "../public/studio/geist-mono-latin.woff2",
  variable: "--font-geist-mono",
  weight: "100 900",
  display: "swap",
});
export const metadata: Metadata = {
  title: "TACTIC — Every move matters.",
  description:
    "TACTIC is an independent creative studio. Clear thinking, distinctive identities, and considered digital experiences.",
  icons: { icon: "/studio/mark.svg" },
};
export const viewport: Viewport = { themeColor: "#101211" };
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body id="top">{children}</body>
    </html>
  );
}
