"use client";

import { DialogCloseButton, DialogActionButton } from "./dialog-controls";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type MouseEvent,
  type ComponentProps,
} from "react";

import { studies, type Study } from "../studies";
import { takeDialogOpening } from "./dialog-opening";
import {
  enquiryLimits,
  enquiryServices,
  type EnquiryResult,
} from "../lib/enquiry";

function StudioDialog(props: ComponentProps<"dialog">) {
  return (
    <dialog
      {...props}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-24px)] max-w-170 overflow-auto rounded-[22px] border border-line bg-[#1b201c] p-6.5 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-[9px] min-[600px]:p-9"
    />
  );
}
export function Dialogs() {
  const contact = useRef<HTMLDialogElement>(null);
  const studyDialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const form = useRef<HTMLFormElement>(null);
  const preview = useRef<HTMLPreElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);
  const [study, setStudy] = useState<Study>("pathways");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");
  useEffect(
    () => () => {
      document.body.classList.remove("modal-open");
    },
    [],
  );
  useEffect(() => {
    if (brief) copyButton.current?.focus();
  }, [brief]);
  function opening(event: React.ToggleEvent<HTMLDialogElement>) {
    if (event.newState !== "open") return;
    const active = document.activeElement;
    const opening = takeDialogOpening(event.currentTarget);
    opener.current =
      opening?.opener ?? (active instanceof HTMLElement ? active : null);
    if (opening?.study) setStudy(opening.study);
    if (opener.current?.closest("#mobile-menu"))
      opener.current =
        document.querySelector<HTMLButtonElement>("#navigation-toggle");
    document.body.classList.add("modal-open");
  }
  function closed() {
    document.body.classList.remove("modal-open");
    opener.current?.focus({ preventScroll: true });
    opener.current = null;
  }
  const dialogEvents = {
    onBeforeToggleCapture: opening,
    onClose: closed,
    onClick: (event: MouseEvent<HTMLDialogElement>) => {
      if (event.target !== event.currentTarget) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      if (
        event.clientX < bounds.left ||
        event.clientX > bounds.right ||
        event.clientY < bounds.top ||
        event.clientY > bounds.bottom
      )
        event.currentTarget.close();
    },
  };
  async function copy() {
    try {
      await navigator.clipboard.writeText(brief);
      setStatus("Project brief copied. Nothing has been sent.");
    } catch {
      if (preview.current) {
        const range = document.createRange();
        range.selectNodeContents(preview.current);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus("Brief selected. Press Ctrl+C (or ⌘C) to copy.");
    }
  }
  return (
    <>
      <StudioDialog
        ref={contact}
        id="contact-dialog"
        aria-labelledby="contact-dialog-title"
        {...dialogEvents}
      >
        <div className="mb-6.5 flex items-center justify-between gap-3.75">
          <span className="flex items-center gap-2.5 font-mono text-[8px] leading-[1.7] font-normal tracking-wider text-green uppercase">
            Your next move starts here
          </span>
          <DialogCloseButton
            aria-label="Close project enquiry"
            onClick={() => contact.current?.close()}
          />
        </div>
        <h2
          className="text-[43px] leading-[1.12] font-[380] tracking-[-0.045em] min-[600px]:text-[54px]"
          id="contact-dialog-title"
        >
          Let’s make
          <br />
          something <span className="text-green">matter.</span>
        </h2>
        <p className="mx-0 mt-4.75 mb-7 text-[12px] leading-[1.7] text-muted">
          Tell us a little about you and what you have in mind.
        </p>
        <form
          ref={form}
          id="contact-form"
          hidden={!!brief}
          onInput={(event) => {
            const input = event.target;
            if (
              input instanceof HTMLInputElement ||
              input instanceof HTMLTextAreaElement ||
              input instanceof HTMLSelectElement
            )
              input.setCustomValidity("");
          }}
          aria-busy={pending}
          onSubmit={async (event) => {
            event.preventDefault();
            if (pending) return;
            const currentForm = event.currentTarget;
            const data = new FormData(event.currentTarget);
            const field = (name: string) => String(data.get(name) ?? "").trim();
            for (const name of ["name", "message"]) {
              const input = event.currentTarget.elements.namedItem(name);
              if (
                input instanceof HTMLInputElement ||
                input instanceof HTMLTextAreaElement
              ) {
                input.setCustomValidity(
                  field(name) ? "" : "Please enter more than spaces.",
                );
                if (!input.reportValidity()) return;
              }
            }
            setPending(true);
            setFormError("");
            try {
              const response = await fetch("/api/enquiry", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: field("name"),
                  email: field("email"),
                  service: field("service"),
                  message: field("message"),
                  website: field("website"),
                }),
                signal: AbortSignal.timeout(15_000),
              });
              const result: EnquiryResult = await response.json();
              if (response.ok && result.status === "prepared") {
                setBrief(result.brief);
                setStatus("");
              } else {
                if (result.status === "error") {
                  setFormError(result.message);
                  for (const [name, message] of Object.entries(
                    result.fields ?? {},
                  )) {
                    const input = currentForm.elements.namedItem(name);
                    if (
                      input instanceof HTMLInputElement ||
                      input instanceof HTMLTextAreaElement ||
                      input instanceof HTMLSelectElement
                    )
                      input.setCustomValidity(message ?? "");
                  }
                  currentForm.reportValidity();
                } else
                  setFormError(
                    "Could not prepare your brief. Please try again.",
                  );
              }
            } catch {
              setFormError(
                "Could not connect. Your details have not been sent. Please try again.",
              );
            } finally {
              setPending(false);
            }
          }}
        >
          <div className="grid gap-0 min-[600px]:grid-cols-[1fr_1fr] min-[600px]:gap-4.5">
            <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
              Your name
              <input
                name="name"
                disabled={pending}
                autoComplete="name"
                placeholder="Alex Morgan"
                required
                maxLength={enquiryLimits.name}
              />
            </label>
            <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
              Email address
              <input
                type="email"
                disabled={pending}
                name="email"
                autoComplete="email"
                placeholder="alex@yourstudio.com"
                required
                maxLength={enquiryLimits.email}
              />
            </label>
          </div>
          <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
            What are you thinking about?
            <select name="service" required defaultValue="" disabled={pending}>
              <option value="" disabled>
                Select a starting point
              </option>
              {enquiryServices.map((service) => (
                <option key={service}>{service}</option>
              ))}
            </select>
          </label>
          <label className="mb-5 flex flex-col gap-2.5 text-[11px] text-foreground">
            A little about your project
            <textarea
              name="message"
              disabled={pending}
              rows={3}
              placeholder="The idea, the challenge, the ambition…"
              required
              maxLength={enquiryLimits.message}
            />
          </label>
          <div className="hidden" aria-hidden="true">
            <label>
              Leave this empty
              <input name="website" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {formError && (
            <p role="alert" className="mb-4 text-sm leading-relaxed text-coral">
              {formError}
            </p>
          )}
          <p className="mb-4.25 text-xs leading-relaxed text-muted">
            Prepare a project brief below. Nothing is sent.
          </p>
          <DialogActionButton type="submit" disabled={pending}>
            {pending
              ? "Preparing your brief…"
              : formError
                ? "Try preparing again"
                : "Prepare project brief"}
          </DialogActionButton>
        </form>
        <div id="brief-result" hidden={!brief}>
          <p className="flex items-center gap-2.5 font-mono text-[10px] leading-[1.7] font-normal tracking-wider uppercase">
            <span className="inline-block h-1 w-1 flex-[0_0_4px] rounded-full bg-green" />{" "}
            Your starting point
          </p>
          <h3 className="mx-0 my-4.25 text-[32px] leading-[1.1] font-normal tracking-[-0.04em]">
            A clear brief.
            <br />A good first move.
          </h3>
          <p className="text-[12px] leading-[1.7] text-muted">
            This brief is ready to copy. The studio’s contact details will be
            connected when the website goes live.
          </p>
          <pre
            className="mx-0 my-5 rounded-xl border border-line bg-[rgba(255,255,255,0.02)] p-4.5 font-mono text-[11px] leading-[1.8] wrap-anywhere whitespace-pre-wrap text-foreground"
            ref={preview}
            id="brief-preview"
          >
            {brief}
          </pre>
          <DialogActionButton
            ref={copyButton}

            id="copy-brief"
            onClick={copy}
          >
            Copy project brief
          </DialogActionButton>
          <button
            className="mx-auto mt-4.5 mb-0 block rounded-[22px] bg-[rgba(255,255,255,0.07)] px-4.5 py-2.75 text-[12px]"
            id="edit-brief"
            onClick={() => {
              setBrief("");
              requestAnimationFrame(() =>
                form.current?.querySelector<HTMLInputElement>("input")?.focus(),
              );
            }}
          >
            Edit your brief
          </button>
          <p
            className="mt-2.5 min-h-[1.7em] text-center text-[12px] leading-[1.7] text-muted"
            id="copy-status"
            role="status"
          >
            {status}
          </p>
        </div>
      </StudioDialog>
      <StudioDialog
        ref={studyDialog}
        id="study-dialog"
        aria-labelledby="study-dialog-title"
        {...dialogEvents}
      >
        <div className="mb-5.75 flex items-start justify-between gap-5">
          <div>
            <p className="mb-2.25 flex items-center gap-2.5 font-mono text-[8px] leading-[1.7] font-normal tracking-wider text-green uppercase">
              The TACTIC world / Brand exploration
            </p>
            <h2
              className="text-[26px] leading-[1.12] font-[380] tracking-[-0.045em]"
              id="study-dialog-title"
            >
              {studies[study].title}
            </h2>
          </div>
          <DialogCloseButton
            aria-label="Close brand study"
            onClick={() => studyDialog.current?.close()}
          />
        </div>
        <Image
          className="w-full rounded-[14px]"
          id="study-dialog-image"
          src={studies[study].src}
          alt={studies[study].alt}
          width={studies[study].size}
          height={studies[study].size}
          sizes="(min-width: 704px) 606px, (min-width: 600px) calc(100vw - 98px), calc(100vw - 78px)"
        />
        <p
          className="mt-5.5 text-[12px] leading-[1.8] text-muted"
          id="study-dialog-description"
        >
          {studies[study].description}
        </p>
      </StudioDialog>
    </>
  );
}
