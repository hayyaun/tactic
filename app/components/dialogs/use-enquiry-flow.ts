import { useRef, useState, type FormEvent } from "react";
import { readEnquiry, requestEnquiry } from "./enquiry-request";

export function useEnquiryFlow() {
  const form = useRef<HTMLFormElement>(null);
  const submissionId = useRef("");
  const [brief, setBrief] = useState("");
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);

  async function prepare(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const currentForm = event.currentTarget;
    const payload = readEnquiry(currentForm);
    for (const name of ["name", "message"] as const) {
      const input = currentForm.elements.namedItem(name);
      if (
        input instanceof HTMLInputElement ||
        input instanceof HTMLTextAreaElement
      ) {
        input.setCustomValidity(
          payload[name] ? "" : "Please enter more than spaces.",
        );
        if (!input.reportValidity()) return;
      }
    }
    setPending(true);
    setFormError("");
    try {
      const { ok, result } = await requestEnquiry(payload);
      if (ok && result.status === "prepared") {
        setBrief(result.brief);
        submissionId.current = crypto.randomUUID();
        setSent(false);
        setStatus("");
      } else if (result.status === "error") {
        setFormError(result.message);
        for (const [name, message] of Object.entries(result.fields ?? {})) {
          const input = currentForm.elements.namedItem(name);
          if (
            input instanceof HTMLInputElement ||
            input instanceof HTMLTextAreaElement ||
            input instanceof HTMLSelectElement
          )
            input.setCustomValidity(message ?? "");
        }
        currentForm.reportValidity();
      } else {
        setFormError("Could not prepare your brief. Please try again.");
      }
    } catch {
      setFormError(
        "Could not connect. Your details have not been sent. Please try again.",
      );
    } finally {
      setPending(false);
    }
  }

  async function send() {
    if (pending || !form.current) return;
    const payload = readEnquiry(form.current);
    setPending(true);
    setFormError("");
    try {
      const { ok, result } = await requestEnquiry({
        ...payload,
        intent: "send",
        submissionId: submissionId.current,
      });
      if (ok && result.status === "sent") {
        setSent(true);
        setStatus("Enquiry submitted. We’ll reply by email.");
      } else {
        setFormError(
          result.status === "error"
            ? result.message
            : "We couldn’t confirm sending. Please try again.",
        );
      }
    } catch {
      setFormError(
        "We couldn’t confirm sending. Please retry with this same brief.",
      );
    } finally {
      setPending(false);
    }
  }

  async function copy(preview: HTMLPreElement | null) {
    try {
      await navigator.clipboard.writeText(brief);
      setStatus(
        sent
          ? "Project brief copied."
          : "Project brief copied. Nothing has been sent.",
      );
    } catch {
      if (preview) {
        const range = document.createRange();
        range.selectNodeContents(preview);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      }
      setStatus("Brief selected. Press Ctrl+C (or ⌘C) to copy.");
    }
  }

  function edit() {
    setBrief("");
    setSent(false);
    setFormError("");
    requestAnimationFrame(() =>
      form.current?.querySelector<HTMLInputElement>("input")?.focus(),
    );
  }

  return {
    form,
    brief,
    status,
    pending,
    formError,
    sent,
    prepare,
    send,
    copy,
    edit,
  };
}

export type EnquiryFlow = ReturnType<typeof useEnquiryFlow>;
