import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void;
  }
}
const storageKey = "tactic:privacy:v1";
export type Choice = { recordings: boolean; expires: number };
const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
const trackingEnabled =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production" ||
  process.env.NEXT_PUBLIC_ENABLE_TRACKING_PREVIEW === "true";
const validClarity = !!clarityId && /^[a-z0-9]+$/i.test(clarityId);
const subscribeBrowser = () => () => {};
const browserIsReady = () => true;

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

export function useRecordingConsent() {
  // Read the saved choice before loading Clarity to avoid recording rejected visits.
  const browserReady = useSyncExternalStore(
    subscribeBrowser,
    browserIsReady,
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
  const [storageError, setStorageError] = useState("");
  const recordingsAllowed =
    trackingEnabled &&
    validClarity &&
    browserReady &&
    choice?.recordings !== false;
  const trackingUnavailableReason = !trackingEnabled
    ? "Recording is off on this development or preview version."
    : !validClarity
      ? "Recording is unavailable because Clarity is not configured."
      : null;
  const recordingStatus =
    choice?.recordings === false
      ? "Recordings rejected. Your choice is saved for 180 days."
      : (trackingUnavailableReason ?? "Clarity is enabled for this browser.");

  useEffect(() => {
    const changed = (event: StorageEvent) => {
      if (
        (event.key !== storageKey && event.key !== null) ||
        !recordingsAllowed
      )
        return;
      let stillAllowed = false;
      try {
        const saved = JSON.parse(readChoice() ?? "null") as Choice | null;
        stillAllowed = saved?.recordings !== false;
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

  function saveChoice(recordings: boolean): boolean {
    const next: Choice = { recordings, expires: Date.now() + 180 * 86400_000 };
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      setStorageError(
        "Your browser could not save your choice. Please enable local storage to save privacy preferences.",
      );
      return false;
    }
    if (recordingsAllowed && !recordings) {
      window.clarity?.("consentv2", {
        analytics_Storage: "denied",
        ad_Storage: "denied",
      });
      cleanRecordingCookies();
      // Reload to stop the recorder itself, including its no-consent mode.
      location.reload();
      return false;
    }
    if (recordings && recordingsAllowed) {
      window.clarity?.("consentv2", {
        analytics_Storage: "granted",
        ad_Storage: "denied",
      });
    }
    window.dispatchEvent(new Event("tactic:privacy-change"));
    return true;
  }

  return {
    clarityId,
    choice,
    recordingsAllowed,
    trackingUnavailableReason,
    recordingStatus,
    storageError,
    saveChoice,
  };
}
