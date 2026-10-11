"use client";

import type { ComponentProps } from "react";
import type { Study } from "../studies";
import { openDialog } from "./dialog-opening";
import { ActionButton, type ActionButtonProps } from "./ui/action";

type ButtonProps = Omit<ComponentProps<"button">, "type">;

export function ContactButton({
  onClick,
  ...props
}: Omit<ActionButtonProps, "type">) {
  return (
    <ActionButton
      {...props}
      type="button"
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented)
          openDialog("contact-dialog", { opener: event.currentTarget });
      }}
    />
  );
}

export function StudyButton({
  study,
  onClick,
  ...props
}: ButtonProps & {
  study: Study;
}) {
  return (
    <button
      {...props}
      type="button"
      data-study={study}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented)
          openDialog("study-dialog", { opener: event.currentTarget, study });
      }}
    />
  );
}
