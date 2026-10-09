"use client";

import type { ButtonHTMLAttributes } from "react";
import type { Study } from "../studies";
import { openDialog } from "./dialog-opening";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function ContactButton(props: ButtonProps) {
  return (
    <button
      {...props}
      type="button"
      onClick={(event) =>
        openDialog("contact-dialog", { opener: event.currentTarget })
      }
    />
  );
}

export function StudyButton({
  study,
  ...props
}: ButtonProps & {
  study: Study;
}) {
  return (
    <button
      {...props}
      type="button"
      data-study={study}
      onClick={(event) =>
        openDialog("study-dialog", { opener: event.currentTarget, study })
      }
    />
  );
}
