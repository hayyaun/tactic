"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}
const storageKey = "tactic:privacy:v1";
type Choice = { recordings: boolean; expires: number };
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const trackingEnabled =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_ENABLE_TRACKING_PREVIEW === "true";
const validClarity = !!clarityId && /^[a-z0-9]+$/i.test(clarityId);

function subscribeChoice(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("tactic:privacy-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("tactic:privacy-change", callback);
  };
}
function readChoice() {
  try {
    const raw = localStorage.getItem(storageKey);
    const parsed = JSON.parse(raw ?? "null") as Choice | null;
    return parsed && parsed.expires > Date.now() ? raw : null;
  } catch {
    return null;
  }
}
const subscribeHydration = () => () => {};

function cleanRecordingCookies() {
  for (const cookie of document.cookie.split(";")) {
    const name = cookie.trim().split("=")[0];
    if (!/^(_clck|_clsk)$/.test(name)) continue;
    const host = location.hostname.split(".");
    const domains = [
      "",
      ...host.map((_, index) => `; Domain=${host.slice(index).join(".")}`),
    ];
    for (const domain of domains)
      document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`;
  }
}

export function PrivacyControls() {
  const storedChoice = useSyncExternalStore(
    subscribeChoice,
    readChoice,
    () => null,
  );
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );
  const choice = useMemo(() => {
    try {
      const saved = JSON.parse(storedChoice ?? "null") as Choice | null;
      return saved && typeof saved.recordings === "boolean" ? saved : null;
    } catch {
      return null;
    }
  }, [storedChoice]);
  const [open, setOpen] = useState(false);
  const [storageError, setStorageError] = useState("");
  const settingsOpen =
    open || (hydrated && !choice && trackingEnabled && validClarity);
  const recordingsAllowed =
    trackingEnabled && validClarity && choice?.recordings === true;

  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== storageKey || !recordingsAllowed) return;
      let stillAllowed = false;
      try {
        stillAllowed = JSON.parse(readChoice() ?? "null")?.recordings === true;
      } catch {}
      if (!stillAllowed) {
        window.clarity?.("consentv2", {
          analytics_Storage: "denied",
          ad_Storage: "denied",
        });
        cleanRecordingCookies();
        location.reload();
      }
    };
    window.addEventListener("storage", changed);
    return () => window.removeEventListener("storage", changed);
  }, [recordingsAllowed]);

  function save(recordings: boolean) {
    const next: Choice = { recordings, expires: Date.now() + 180 * 86400_000 };
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageError(
        "Your browser could not save your choice. Please enable local storage to save privacy preferences.",
      );
      return;
    }
    if (choice?.recordings && !recordings) {
      window.clarity?.("consentv2", {
        analytics_Storage: "denied",
        ad_Storage: "denied",
      });
      cleanRecordingCookies();
      // Reload to stop the recorder itself, including its no-consent mode.
      location.reload();
      return;
    }
    window.dispatchEvent(new Event("tactic:privacy-change"));
    setOpen(false);
  }

  return (
    <>
      {recordingsAllowed && (
        <Script
          id="tactic-clarity"
          strategy="afterInteractive"
        >{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityId)});window.clarity("consentv2",{analytics_Storage:"granted",ad_Storage:"denied"});`}</Script>
      )}
      <div className="studio-container flex flex-wrap gap-6 py-6 text-xs text-muted">
        <Link href="/privacy" className="hover:text-foreground">
          Privacy notice
        </Link>
        <button
          type="button"
          aria-expanded={settingsOpen}
          aria-controls="privacy-settings"
          onClick={() => setOpen(true)}
          className="hover:text-foreground"
        >
          Privacy settings
        </button>
      </div>
      {settingsOpen && (
        <section
          id="privacy-settings"
          aria-labelledby="privacy-title"
          className="fixed inset-x-3 bottom-3 z-50 mx-auto max-h-[80dvh] max-w-2xl overflow-y-auto rounded-2xl border border-line bg-background p-5 text-foreground shadow-xl min-[600px]:p-6"
        >
          <h2 id="privacy-title" className="text-lg">
            Your privacy choices
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            With your permission, Microsoft Clarity helps us improve the website
            using heatmaps and session recordings. Form contents are masked.
            Recording stays off until you allow it.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              className="rounded-full border border-line px-4 py-2"
              onClick={() => save(false)}
            >
              Reject recordings
            </button>
            <button
              type="button"
              className="rounded-full border border-line px-4 py-2"
              disabled={!validClarity || !trackingEnabled}
              onClick={() => save(true)}
            >
              Allow recordings
            </button>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Change your choice anytime here. Error monitoring helps keep the
            site reliable.{" "}
            <Link href="/privacy" className="underline">
              Read the privacy notice
            </Link>
            .
          </p>
          {storageError && (
            <p role="alert" className="mt-3 text-sm text-coral">
              {storageError}
            </p>
          )}
        </section>
      )}
    </>
  );
}
