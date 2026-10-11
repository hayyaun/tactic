import Link from "next/link";
import type { Metadata } from "next";
import { site } from "./lib/site";
import { enquiryDeliveryEnabled } from "./lib/enquiry-delivery";
import { Header } from "./components/header";
import { Capabilities } from "./components/capabilities";
import { Dialogs } from "./components/interactions";
import { HeroSection } from "./components/home/hero-section";
import { WorldSection } from "./components/home/world-section";
import { StudioSection } from "./components/home/studio-section";
import { ContactSection } from "./components/home/contact-section";
import { HomeFooter } from "./components/home/home-footer";

export const metadata: Metadata = {
  alternates: {
    canonical: site.url,
    types: { "application/rss+xml": "/rss.xml" },
  },
};

export default function Home() {
  return (
    <>
      <Link
        className="fixed top-2 left-2 z-30 translate-y-[-160%] rounded-lg bg-foreground px-5 py-3.5 text-background focus:translate-y-0"
        href="#main"
      >
        Skip to content
      </Link>
      <Header />
      <main id="main" tabIndex={-1}>
        <HeroSection />
        <Capabilities />
        <WorldSection />
        <StudioSection />
        <ContactSection />
      </main>
      <HomeFooter />
      <Dialogs deliveryEnabled={enquiryDeliveryEnabled()} />
    </>
  );
}
