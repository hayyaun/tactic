import Link from "next/link";
import type { ComponentProps } from "react";

const filled = "bg-foreground text-background";
const paleHover = "hover:bg-[rgb(213,231,206)]";
const reducedMotion = "motion-reduce:transition-none";

// Keep the existing sizes and interaction treatments explicit. Callers only
// supply placement classes; shared surfaces and states live here.
const actionPresets = {
  hero: `${filled} ${paleHover} ${reducedMotion} mt-5 inline-flex items-center gap-7.5 rounded-[28px] px-5 py-3.25 text-[11px] [transition:background_0.3s,transform_0.3s] hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 min-[600px]:mt-4.5 min-[600px]:px-5.75 min-[600px]:py-3.5 min-[600px]:text-[12px] [@media(max-height:_740px)_and_(max-width:_700px)]:mt-3 [@media(max-height:_740px)_and_(max-width:_700px)]:px-4.5 [@media(max-height:_740px)_and_(max-width:_700px)]:py-2.5 [@media(max-height:_740px)_and_(max-width:_700px)]:text-[10px]`,
  header: `${filled} ${paleHover} ${reducedMotion} ml-auto flex items-center gap-2.25 rounded-[28px] px-2.75 py-2.5 text-[10px] whitespace-nowrap [transition:background_0.3s,color_0.3s] hover:text-background min-[360px]:gap-3.25 min-[360px]:px-3.5 min-[360px]:py-2.75 min-[360px]:text-[11px] min-[960px]:ml-0 min-[960px]:gap-5.75 min-[960px]:px-4.5 min-[960px]:py-3 min-[960px]:text-[12px]`,
  menu: `${filled} mx-0 mt-2.5 mb-0 flex justify-between rounded-[28px] px-4.25 py-3.25 text-left text-[17px] font-[350]`,
  capability: `${filled} ${reducedMotion} flex items-center gap-4 rounded-[50px] px-4.5 py-3.75 text-[10px] [transition:background_180ms,transform_180ms] hover:-translate-y-0.5 hover:bg-[color-mix(in_srgb,var(--text)_90%,var(--green))] focus-visible:[outline:2px_solid_var(--green)] focus-visible:outline-offset-1 motion-reduce:hover:transform-none min-[701px]:gap-6 min-[701px]:px-5.5 min-[701px]:py-4.25 min-[701px]:text-[12px]`,
  contact: `${filled} ${paleHover} ${reducedMotion} group/text-link inline-flex items-center justify-between gap-7 rounded-[25px] px-5 py-3.5 text-[12px] [transition:background_0.3s]`,
  siteHeader: `${filled} inline-flex min-h-11 items-center justify-center gap-4 rounded-full px-5 text-[12px] hover:bg-green`,
  text: "inline bg-transparent p-0 text-left align-baseline text-foreground underline decoration-green/60 underline-offset-4 hover:text-green",
  contactIcon: `${paleHover} ${reducedMotion} grid h-16.75 w-16.75 place-items-center rounded-full bg-foreground [transition:background_0.3s,transform_0.3s] hover:rotate-45 motion-reduce:hover:rotate-0 min-[960px]:h-26 min-[960px]:w-26 min-[960px]:flex-[0_0_auto]`,
  dialog: `${filled} ${paleHover} flex w-full items-center justify-between gap-5 rounded-[22px] p-3.75 text-[12px] font-medium focus-visible:outline-green disabled:cursor-wait disabled:opacity-60`,
  outline: `${reducedMotion} min-h-11 rounded-full border border-line px-3 py-2.5 transition-colors hover:bg-foreground/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sage disabled:cursor-not-allowed disabled:opacity-40`,
  secondary:
    "mx-auto mt-4.5 mb-0 block rounded-[22px] bg-[rgba(255,255,255,0.07)] px-4.5 py-2.75 text-[12px]",
};

export type ActionPreset = keyof typeof actionPresets;
type ActionStyleProps = { preset?: ActionPreset; className?: string };
export type ActionButtonProps = ComponentProps<"button"> & ActionStyleProps;

export function actionClassName(preset: ActionPreset, className?: string) {
  return [actionPresets[preset], className].filter(Boolean).join(" ");
}

export function ActionButton({
  preset = "contact",
  className,
  type = "button",
  ...props
}: ActionButtonProps) {
  return (
    <button
      {...props}
      type={type}
      className={actionClassName(preset, className)}
    />
  );
}

export function ActionLink({
  preset = "contact",
  className,
  ...props
}: ComponentProps<typeof Link> & ActionStyleProps) {
  return <Link {...props} className={actionClassName(preset, className)} />;
}
