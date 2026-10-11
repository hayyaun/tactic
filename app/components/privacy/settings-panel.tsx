import Link from "next/link";
import type { RefObject } from "react";
import { ActionButton } from "../ui/action";
import { CloseButton } from "../ui/close-button";
import type { Choice } from "./use-recording-consent";

export function PrivacySettingsPanel({
  titleRef,
  choice,
  recordingStatus,
  trackingUnavailableReason,
  storageError,
  onClose,
  onSaveChoice,
}: {
  titleRef: RefObject<HTMLHeadingElement | null>;
  choice: Choice | null;
  recordingStatus: string;
  trackingUnavailableReason: string | null;
  storageError: string;
  onClose: () => void;
  onSaveChoice: (recordings: boolean) => void;
}) {
  return (
    <section
      id="privacy-settings"
      role="dialog"
      aria-labelledby="privacy-title"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          onClose();
        }
      }}
      className="fixed inset-x-4 bottom-[max(5rem,calc(env(safe-area-inset-bottom)+4rem))] z-50 max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-3xl border border-line bg-background p-5 text-foreground shadow-2xl min-[600px]:right-auto min-[600px]:left-6 min-[600px]:w-96 min-[600px]:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <h2
          ref={titleRef}
          tabIndex={-1}
          id="privacy-title"
          className="text-lg outline-none"
        >
          Your privacy choices
        </h2>
        <CloseButton
          appearance="subtle"
          aria-label="Close privacy settings"
          onClick={onClose}
        />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        Microsoft Clarity helps us improve the website using heatmaps and
        session recordings. It is enabled by default on the live website. Form
        contents are masked. Reject recordings to stop tracking.
      </p>
      <p role="status" className="mt-3 text-sm leading-relaxed text-muted">
        {recordingStatus}
      </p>
      {choice?.recordings === false && trackingUnavailableReason && (
        <p className="mt-2 text-xs leading-relaxed text-muted">
          {trackingUnavailableReason}
        </p>
      )}
      <div className="mt-5 grid grid-cols-2 gap-2 text-xs">
        <ActionButton preset="outline" onClick={() => onSaveChoice(false)}>
          Reject recordings
        </ActionButton>
        <ActionButton
          preset="outline"
          disabled={trackingUnavailableReason !== null}
          onClick={() => onSaveChoice(true)}
        >
          Allow recordings
        </ActionButton>
      </div>
      <p className="mt-4 text-xs leading-relaxed text-muted">
        Change your choice anytime here. Error monitoring helps keep the site
        reliable.{" "}
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
  );
}
