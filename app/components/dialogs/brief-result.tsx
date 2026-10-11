import { useEffect, useRef } from "react";
import { DialogActionButton } from "../dialog-controls";
import { ActionButton } from "../ui/action";
import type { EnquiryFlow } from "./use-enquiry-flow";

export function BriefResult({
  flow,
  deliveryEnabled,
}: {
  flow: EnquiryFlow;
  deliveryEnabled: boolean;
}) {
  const { brief, sent, pending, formError, status, send, copy, edit } = flow;
  const preview = useRef<HTMLPreElement>(null);
  const copyButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (brief) copyButton.current?.focus();
  }, [brief]);

  return (
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
        {sent
          ? "Your enquiry has been submitted. We’ll reply by email."
          : deliveryEnabled
            ? "Review your brief, then send it to the studio."
            : "This brief is ready to copy. Sending will become available when the website goes live."}
      </p>
      <pre
        className="mx-0 my-5 rounded-xl border border-line bg-[rgba(255,255,255,0.02)] p-4.5 font-mono text-[11px] leading-[1.8] wrap-anywhere whitespace-pre-wrap text-foreground"
        ref={preview}
        id="brief-preview"
      >
        {brief}
      </pre>
      {deliveryEnabled && !sent && (
        <div className="mb-4">
          <DialogActionButton disabled={pending} onClick={send}>
            {pending ? "Sending enquiry…" : "Send enquiry"}
          </DialogActionButton>
          {formError && (
            <p role="alert" className="mt-3 text-sm text-coral">
              {formError}
            </p>
          )}
        </div>
      )}
      <DialogActionButton
        ref={copyButton}
        id="copy-brief"
        onClick={() => copy(preview.current)}
      >
        Copy project brief
      </DialogActionButton>
      <ActionButton
        preset="secondary"
        id="edit-brief"
        disabled={pending}
        onClick={edit}
      >
        Edit your brief
      </ActionButton>
      <p
        className="mt-2.5 min-h-[1.7em] text-center text-[12px] leading-[1.7] text-muted"
        id="copy-status"
        role="status"
      >
        {status}
      </p>
    </div>
  );
}
