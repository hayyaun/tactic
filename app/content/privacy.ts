import { textBlock } from "./text-block";
import type { ContentPage } from "./types";

export const defaultPrivacyContent: ContentPage = {
  path: "/privacy",
  kind: "privacy",
  status: "published",
  title: "Privacy notice",
  description:
    "TACTIC is a creative studio based in Iran. This notice describes how this website handles information.",
  blocks: [
    textBlock("text-1", "Project enquiries", { style: "h2" }),
    textBlock(
      "text-2",
      "When you send an enquiry, we use your name, email address, chosen service, and message to respond and discuss your project. Resend delivers the message to our receiving inbox. Do not include passwords, payment details, or sensitive personal information. Preparing a brief alone does not email it to us.",
    ),
    textBlock("text-3", "Optional recordings and heatmaps", {
      style: "h2",
    }),
    textBlock(
      "text-4",
      "Microsoft Clarity is enabled by default to provide heatmaps and session recordings that help us improve the website, subject to provider restrictions. You can stop it by choosing Reject recordings in Privacy settings, and change your choice by selecting Allow recordings. The saved choice in Privacy settings controls whether Clarity loads; browser privacy signals do not change this default. Advertising storage is always denied. Contact-form contents and brief previews are masked for recordings. We do not use Google Analytics or Plausible.",
    ),
    textBlock("text-5", "Reliability and spam prevention", {
      style: "h2",
    }),
    textBlock(
      "text-6",
      "Vercel hosts this website and processes requests. Sentry receives filtered technical error reports to help us fix faults; Sentry session replay, performance tracing, and log collection are disabled. Upstash Redis stores a short-lived submission counter for spam prevention. We do not put enquiry contents or IP addresses into that counter.",
    ),
    textBlock("text-7", "Cookies and choices", { style: "h2" }),
    textBlock(
      "text-8",
      "We store your privacy choices in your browser for up to 180 days. Clarity analytics storage is denied unless you choose Allow recordings; default activation is not treated as consent to cookies. You can revisit Privacy settings at any time to reject recordings. Rejecting stops future recording and clears accessible first-party Clarity cookies; it does not automatically remove information already processed by providers. When a saved choice expires, the default applies again.",
    ),
    textBlock("text-9", "Providers and retention", { style: "h2" }),
    textBlock(
      "text-10",
      "Our providers may process information outside Iran under their own terms and retention settings. We keep enquiry correspondence only as long as needed to respond, manage a project, or meet applicable obligations. Ask us to delete correspondence you no longer want us to keep. Browser privacy settings control local cookies and storage.",
    ),
    textBlock("text-11", "Contact and requests", { style: "h2" }),
    textBlock(
      "text-12",
      "For questions, access requests, corrections, or deletion requests, contact us through the project enquiry form when sending is available. Our branded address, admin@tacticforyou.com, will become available after the domain and email forwarding are activated.",
    ),
  ],
};
