import type { Study } from "../studies";

type DialogOpening = { opener: HTMLButtonElement; study?: Study };
const openings = new WeakMap<HTMLDialogElement, DialogOpening>();

export function openDialog(id: string, opening: DialogOpening) {
  const dialog = document.getElementById(id);
  if (!(dialog instanceof HTMLDialogElement) || dialog.open) return;
  openings.set(dialog, opening);
  try {
    dialog.showModal();
  } catch (error) {
    openings.delete(dialog);
    throw error;
  }
}

export function takeDialogOpening(dialog: HTMLDialogElement) {
  const opening = openings.get(dialog);
  openings.delete(dialog);
  return opening;
}
