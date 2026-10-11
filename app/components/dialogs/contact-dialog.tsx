"use client";

import { DialogCloseButton } from "../dialog-controls";
import { BriefResult } from "./brief-result";
import { ContactForm } from "./contact-form";
import { StudioDialog, useNativeDialog } from "./native-dialog";
import { useEnquiryFlow } from "./use-enquiry-flow";

export function ContactDialog({
  deliveryEnabled,
}: {
  deliveryEnabled: boolean;
}) {
  const { dialog, close, events } = useNativeDialog();
  const flow = useEnquiryFlow();
  return (
    <StudioDialog
      ref={dialog}
      id="contact-dialog"
      data-clarity-mask="true"
      aria-labelledby="contact-dialog-title"
      {...events}
    >
      <div className="mb-6.5 flex items-center justify-between gap-3.75">
        <span className="flex items-center gap-2.5 font-mono text-[8px] leading-[1.7] font-normal tracking-wider text-green uppercase">
          Your next move starts here
        </span>
        <DialogCloseButton aria-label="Close project enquiry" onClick={close} />
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
      <ContactForm flow={flow} />
      <BriefResult flow={flow} deliveryEnabled={deliveryEnabled} />
    </StudioDialog>
  );
}
