import type { Metadata } from "next";
import { ContentPage } from "../components/content-page";

export const metadata: Metadata = {
  title: "Privacy notice",
  description:
    "How TACTIC handles enquiries, optional recordings, and error reporting.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <ContentPage
      content={{
        path: "/privacy",
        kind: "about",
        status: "published",
        title: "Privacy notice",
        description:
          "TACTIC is a creative studio based in Iran. This notice describes how this website handles information.",
        blocks: [
          { type: "heading", text: "Project enquiries" },
          {
            type: "paragraph",
            text: "When you send an enquiry, we use your name, email address, chosen service, and message to respond and discuss your project. Resend delivers the message to our receiving inbox. Do not include passwords, payment details, or sensitive personal information. Preparing a brief alone does not email it to us.",
          },
          { type: "heading", text: "Optional recordings and heatmaps" },
          {
            type: "paragraph",
            text: "Microsoft Clarity provides heatmaps and session recordings to help us improve the website. It loads only if you allow recordings in Privacy settings. Advertising storage is denied. Contact-form contents and brief previews are masked for recordings. We do not use Google Analytics or Plausible.",
          },
          { type: "heading", text: "Reliability and spam prevention" },
          {
            type: "paragraph",
            text: "Vercel hosts this website and processes requests. Sentry receives filtered technical error reports to help us fix faults; Sentry session replay, performance tracing, and log collection are disabled. Upstash Redis stores a short-lived submission counter for spam prevention. We do not put enquiry contents or IP addresses into that counter.",
          },
          { type: "heading", text: "Cookies and choices" },
          {
            type: "paragraph",
            text: "We store your privacy choices in your browser for up to 180 days. Clarity may use cookies when you allow it. You can revisit Privacy settings at any time to reject recordings. Withdrawing permission stops future recording and clears accessible first-party Clarity cookies; it does not automatically remove information already processed by providers.",
          },
          { type: "heading", text: "Providers and retention" },
          {
            type: "paragraph",
            text: "Our providers may process information outside Iran under their own terms and retention settings. We keep enquiry correspondence only as long as needed to respond, manage a project, or meet applicable obligations. Ask us to delete correspondence you no longer want us to keep. Browser privacy settings control local cookies and storage.",
          },
          { type: "heading", text: "Contact and requests" },
          {
            type: "paragraph",
            text: "For questions, access requests, corrections, or deletion requests, contact us through the project enquiry form when sending is available. Our branded address, admin@tacticforyou.com, will become available after the domain and email forwarding are activated.",
          },
        ],
      }}
    />
  );
}
