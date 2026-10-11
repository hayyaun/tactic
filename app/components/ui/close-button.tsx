import type { ComponentProps } from "react";
import { CloseIcon } from "./icons";

const styles = {
  dialog:
    "grid h-9.5 w-9.5 flex-[0_0_auto] place-items-center rounded-full border-0 bg-[rgba(255,255,255,0.05)] text-[25px] font-extralight text-foreground hover:border-green hover:bg-green hover:text-background",
  subtle:
    "-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:outline-2 focus-visible:outline-sage motion-reduce:transition-none",
};

export function CloseButton({
  appearance = "dialog",
  ...props
}: Omit<ComponentProps<"button">, "type" | "children" | "className"> & {
  appearance?: keyof typeof styles;
}) {
  return (
    <button {...props} type="button" className={styles[appearance]}>
      {appearance === "dialog" ? "×" : <CloseIcon className="size-4" />}
    </button>
  );
}
