import Script from "next/script";
import type { Choice } from "./use-recording-consent";

export function ClarityRecorder({
  clarityId,
  choice,
  recordingsAllowed,
}: {
  clarityId: string | undefined;
  choice: Choice | null;
  recordingsAllowed: boolean;
}) {
  if (!recordingsAllowed) return null;

  return (
    <Script
      id="tactic-clarity"
      strategy="afterInteractive"
      onReady={() =>
        window.clarity?.("consentv2", {
          analytics_Storage: choice?.recordings === true ? "granted" : "denied",
          ad_Storage: "denied",
        })
      }
    >{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityId)});window.clarity("consentv2",{analytics_Storage:${JSON.stringify(choice?.recordings === true ? "granted" : "denied")},ad_Storage:"denied"});`}</Script>
  );
}
