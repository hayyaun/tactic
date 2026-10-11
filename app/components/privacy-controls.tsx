"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { ClarityRecorder } from "./privacy/clarity-recorder";
import { PrivacySettingsPanel } from "./privacy/settings-panel";
import { useRecordingConsent } from "./privacy/use-recording-consent";

export function PrivacyControls() {
  const {
    clarityId,
    choice,
    recordingsAllowed,
    recordingStatus,
    trackingUnavailableReason,
    storageError,
    saveChoice,
  } = useRecordingConsent();
  const [open, setOpen] = useState(false);
  const opener = useRef<HTMLButtonElement>(null);
  const title = useRef<HTMLHeadingElement>(null);

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

  function save(recordings: boolean) {
    if (saveChoice(recordings)) closeSettings();
  }

  return (
    <>
      <ClarityRecorder
        clarityId={clarityId}
        choice={choice}
        recordingsAllowed={recordingsAllowed}
      />
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
        <PrivacySettingsPanel
          titleRef={title}
          choice={choice}
          recordingStatus={recordingStatus}
          trackingUnavailableReason={trackingUnavailableReason}
          storageError={storageError}
          onClose={closeSettings}
          onSaveChoice={save}
        />
      )}
    </>
  );
}
