"use client";

import Image from "next/image";
import { useState } from "react";
import { studies, type Study } from "../../studies";
import { DialogCloseButton } from "../dialog-controls";
import { StudioDialog, useNativeDialog } from "./native-dialog";

export function StudyDialog() {
  const [study, setStudy] = useState<Study>("pathways");
  const { dialog, close, events } = useNativeDialog((opening) => {
    if (opening.study) setStudy(opening.study);
  });
  const content = studies[study];
  return (
    <StudioDialog
      ref={dialog}
      id="study-dialog"
      aria-labelledby="study-dialog-title"
      {...events}
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
            {content.title}
          </h2>
        </div>
        <DialogCloseButton aria-label="Close brand study" onClick={close} />
      </div>
      <Image
        className="w-full rounded-[14px]"
        id="study-dialog-image"
        src={content.src}
        alt={content.alt}
        width={content.size}
        height={content.size}
        sizes="(min-width: 704px) 606px, (min-width: 600px) calc(100vw - 98px), calc(100vw - 78px)"
      />
      <p
        className="mt-5.5 text-[12px] leading-[1.8] text-muted"
        id="study-dialog-description"
      >
        {content.description}
      </p>
    </StudioDialog>
  );
}
