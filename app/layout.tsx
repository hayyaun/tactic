import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { isIndexable, site } from "./lib/site";
import { organizationSchema, serializeJsonLd } from "./lib/structured-data";
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
  metadataBase: new URL(site.url),
  title: { default: "TACTIC — Every move matters.", template: "%s | TACTIC" },
  description:
    "TACTIC is an independent creative studio. Clear thinking, distinctive identities, and considered digital experiences.",
  icons: { icon: "/studio/mark.svg" },
  robots: isIndexable()
    ? { index: true, follow: true }
    : { index: false, follow: false },
  alternates: { types: { "application/rss+xml": "/rss.xml" } },
};
export const viewport: Viewport = { themeColor: "#101211" };
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geist.variable} ${mono.variable}`}>
      <body id="top">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: serializeJsonLd(organizationSchema()),
          }}
        />
        {children}
      </body>
    </html>
  );
}
