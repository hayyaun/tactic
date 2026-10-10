import type { ComponentProps } from "react";

type DialogButtonProps = Omit<ComponentProps<"button">, "className">;

export function DialogCloseButton(props: Omit<DialogButtonProps, "children">) {
  return (
    <button
      {...props}
      type="button"
      className="grid h-9.5 w-9.5 flex-[0_0_auto] place-items-center rounded-full border-0 bg-[rgba(255,255,255,0.05)] text-[25px] font-extralight text-foreground hover:border-green hover:bg-green hover:text-background"
    >
      ×
    </button>
  );
}

export function DialogActionButton({
  children,
  type = "button",
  ...props
}: DialogButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className="flex w-full items-center justify-between gap-5 rounded-[22px] bg-foreground p-3.75 text-[12px] font-medium text-background hover:bg-[rgb(213,231,206)] focus-visible:outline-green disabled:cursor-wait disabled:opacity-60"
    >
      {children} <span aria-hidden="true">↗</span>
    </button>
  );
}
