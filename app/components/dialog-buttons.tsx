"use client";

import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;
function openDialog(id: string) {
  const dialog = document.getElementById(id);
  if (dialog instanceof HTMLDialogElement) dialog.showModal();
}

export function ContactButton(props: ButtonProps) {
  return (
    <button
      {...props}
      type="button"
      onClick={() => openDialog("contact-dialog")}
    />
  );
}

export function StudyButton({
  study,
  ...props
}: ButtonProps & {
  study: "pathways" | "strategy" | "architecture";
}) {
  return (
    <button
      {...props}
      type="button"
      data-study={study}
      onClick={() => openDialog("study-dialog")}
    />
  );
}
