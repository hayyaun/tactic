import {
  useEffect,
  useRef,
  type ComponentProps,
  type MouseEvent,
  type ToggleEvent,
} from "react";
import { takeDialogOpening } from "../dialog-opening";

type DialogOpening = NonNullable<ReturnType<typeof takeDialogOpening>>;

export function useNativeDialog(onOpening?: (opening: DialogOpening) => void) {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(
    () => () => {
      document.body.classList.remove("modal-open");
    },
    [],
  );

  function opening(event: ToggleEvent<HTMLDialogElement>) {
    if (event.newState !== "open") return;
    const active = document.activeElement;
    const opening = takeDialogOpening(event.currentTarget);
    opener.current =
      opening?.opener ?? (active instanceof HTMLElement ? active : null);
    if (opening) onOpening?.(opening);
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

  function backdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom
    )
      event.currentTarget.close();
  }

  return {
    dialog,
    close: () => dialog.current?.close(),
    events: {
      onBeforeToggleCapture: opening,
      onClose: closed,
      onClick: backdropClick,
    },
  };
}

export function StudioDialog(props: ComponentProps<"dialog">) {
  return (
    <dialog
      {...props}
      className="m-auto max-h-[calc(100dvh-32px)] w-[calc(100%-24px)] max-w-170 overflow-auto rounded-[22px] border border-line bg-[#1b201c] p-6.5 text-foreground backdrop:bg-black/60 backdrop:backdrop-blur-[9px] min-[600px]:p-9"
    />
  );
}
