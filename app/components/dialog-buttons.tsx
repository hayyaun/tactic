"use client";

import { openDialog } from "./dialog-opening";
import { ActionButton, type ActionButtonProps } from "./ui/action";

export function ContactButton({
  onClick,
  ...props
}: Omit<ActionButtonProps, "type">) {
  return (
    <ActionButton
      {...props}
      type="button"
      aria-haspopup="dialog"
      aria-controls="contact-dialog"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented)
          openDialog("contact-dialog", { opener: event.currentTarget });
      }}
    />
  );
}
