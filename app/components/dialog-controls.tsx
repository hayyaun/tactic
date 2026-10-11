import type { ComponentProps } from "react";
import { ActionButton } from "./ui/action";
import { DirectionArrow } from "./ui/icons";
import { CloseButton } from "./ui/close-button";

type DialogButtonProps = Omit<ComponentProps<"button">, "className">;

export function DialogCloseButton(
  props: Omit<DialogButtonProps, "children" | "type">,
) {
  return <CloseButton {...props} />;
}

export function DialogActionButton({
  children,
  type = "button",
  ...props
}: DialogButtonProps) {
  return (
    <ActionButton {...props} type={type} preset="dialog">
      {children} <DirectionArrow />
    </ActionButton>
  );
}
