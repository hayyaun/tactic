"use client";

import Link from "next/link";
import Script from "next/script";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type MouseEvent,
} from "react";

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
const subscribeBrowser = () => () => {};
function browserAllowsTracking() {
  return !(navigator as Navigator & { globalPrivacyControl?: boolean })
    .globalPrivacyControl;
}

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
  // Wait for browser preferences before loading; honor Global Privacy Control.
  const browserAllowed = useSyncExternalStore(
    subscribeBrowser,
    browserAllowsTracking,
    () => false,
  );
  const storedChoice = useSyncExternalStore(
    subscribeChoice,
    readChoice,
    () => null,
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
  const opener = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const recordingsAllowed =
    trackingEnabled &&
    validClarity &&
    browserAllowed &&
    choice?.recordings !== false;
  const trackingUnavailableReason = !trackingEnabled
    ? "Recording is off on this development or preview version."
    : !validClarity
      ? "Recording is unavailable because Clarity is not configured."
      : !browserAllowed
        ? "Your browser's Global Privacy Control keeps recording off."
        : null;

  useEffect(() => {
    if (open) title.current?.focus();
  }, [open]);

  function showSettings(event: MouseEvent<HTMLButtonElement>) {
    opener.current = event.currentTarget;
    setOpen(true);
  }

  function closeSettings() {
    setOpen(false);
    opener.current?.focus();
  }

  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (event.key !== storageKey || !recordingsAllowed) return;
      let stillAllowed = false;
      try {
        stillAllowed = JSON.parse(readChoice() ?? "null")?.recordings !== false;
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
    if (recordingsAllowed && !recordings) {
      window.clarity?.("consentv2", {
        analytics_Storage: "denied",
        ad_Storage: "denied",
      });
      cleanRecordingCookies();
      // Reload to stop the recorder itself, including its no-consent mode.
      location.reload();
      return;
    }
    if (recordings && recordingsAllowed) {
      window.clarity?.("consentv2", {
        analytics_Storage: "granted",
        ad_Storage: "denied",
      });
    }
    window.dispatchEvent(new Event("tactic:privacy-change"));
    closeSettings();
  }

  return (
    <>
      {recordingsAllowed && (
        <Script
          id="tactic-clarity"
          strategy="afterInteractive"
          onReady={() =>
            window.clarity?.("consentv2", {
              analytics_Storage:
                choice?.recordings === true ? "granted" : "denied",
              ad_Storage: "denied",
            })
          }
        >{`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${JSON.stringify(clarityId)});window.clarity("consentv2",{analytics_Storage:${JSON.stringify(choice?.recordings === true ? "granted" : "denied")},ad_Storage:"denied"});`}</Script>
      )}
      <div className="studio-container flex flex-wrap gap-6 py-6 text-xs text-muted">
        <Link href="/privacy" className="hover:text-foreground">
          Privacy notice
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="privacy-settings"
          onClick={showSettings}
          className="hover:text-foreground"
        >
          Privacy settings
        </button>
      </div>
      <button
        type="button"
        aria-label="Privacy choices"
        aria-expanded={open}
        aria-controls="privacy-settings"
        onClick={showSettings}
        className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-line bg-background px-4 text-xs font-medium text-foreground shadow-lg transition-colors hover:border-sage/40 hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sage motion-reduce:transition-none min-[600px]:left-6"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="size-4 text-sage"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3 4.5 6v5.5c0 4.1 3 7.3 7.5 9.5 4.5-2.2 7.5-5.4 7.5-9.5V6L12 3Z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m9 12 2 2 4-4"
          />
        </svg>
        Privacy
      </button>
      {open && (
        <section
          id="privacy-settings"
          role="dialog"
          aria-labelledby="privacy-title"
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              event.stopPropagation();
              closeSettings();
            }
          }}
          className="fixed inset-x-4 bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-line bg-background p-5 text-foreground shadow-2xl min-[600px]:right-auto min-[600px]:left-6 min-[600px]:w-96 min-[600px]:p-6"
        >
          <div className="flex items-center justify-between gap-3">
            <h2
              ref={title}
              tabIndex={-1}
              id="privacy-title"
              className="text-lg outline-none"
            >
              Your privacy choices
            </h2>
            <button
              type="button"
              aria-label="Close privacy settings"
              onClick={closeSettings}
              className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-sage motion-reduce:transition-none"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-4"
              >
                <path strokeLinecap="round" d="m6 6 12 12M18 6 6 18" />
              </svg>
            </button>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Microsoft Clarity helps us improve the website using heatmaps and
            session recordings. It is enabled by default on the live website.
            Form contents are masked. Reject recordings to stop tracking.
          </p>
          <p role="status" className="mt-3 text-sm leading-relaxed text-muted">
            {choice?.recordings === false
              ? "Recordings rejected. Your choice is saved for 180 days."
              : (trackingUnavailableReason ??
                "Clarity is enabled for this browser.")}
          </p>
          {choice?.recordings === false && trackingUnavailableReason && (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              {trackingUnavailableReason}
            </p>
          )}
          <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              className="min-h-11 rounded-full border border-line px-3 py-2.5 transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage motion-reduce:transition-none"
              onClick={() => save(false)}
            >
              Reject recordings
            </button>
            <button
              type="button"
              className="min-h-11 rounded-full border border-line px-3 py-2.5 transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:opacity-40 motion-reduce:transition-none"
              disabled={trackingUnavailableReason !== null}
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
