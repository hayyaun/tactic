import Link from "next/link";
import { SectionHeading } from "../section-heading";
import { SectionLabel, StudioPrinciples } from "../studio-content";
import { DirectionArrow, TacticMark } from "../ui/icons";

export function StudioSection() {
  return (
    <section
      className="bg-[linear-gradient(120deg,rgba(148,189,124,0.02),rgba(217,119,100,0.02))] py-25 [border-bottom:1px_solid_var(--line)] [border-top:1px_solid_var(--line)] min-[960px]:py-36.25"
      id="studio"
      aria-labelledby="studio-title"
    >
      <div className="studio-container">
        <SectionLabel label="04 / The studio">
          <TacticMark className="h-4.25 w-3 text-green" />
        </SectionLabel>
        <div className="mt-11.25 grid gap-9 min-[960px]:mt-14.25 min-[960px]:grid-cols-[1.15fr_1fr] min-[960px]:gap-27.5">
          <SectionHeading id="studio-title" variant="studio">
            Good instinct.
            <br />
            <span className="text-muted">Clear intent.</span>
          </SectionHeading>
          <div className="max-w-112.5">
            <p className="text-[21px] leading-[1.55] font-[350] tracking-tight min-[960px]:text-[24px]">
              We’re TACTIC. A creative studio for ambitious people with
              somewhere to go.
            </p>
            <p className="mt-6.25 text-[12px] leading-[1.95] text-muted min-[960px]:text-[13px]">
              We connect strategy, identity and digital design to help ideas
              find their strongest form. Curious by nature and considered in our
              craft, we ask better questions, look a little closer, and make
              every detail count.
            </p>
            <Link
              className="group/text-link mt-8 inline-flex items-center justify-between gap-7 bg-transparent p-0 text-[12px]"
              href="#capabilities"
            >
              Meet our approach{" "}
              <DirectionArrow
                direction="down-right"
                className="inline-grid h-8.25 w-8.25 place-items-center rounded-full bg-[rgba(255,255,255,0.07)] text-[16px] [transition:background_0.3s,color_0.3s,transform_0.3s] group-hover/text-link:rotate-45 group-hover/text-link:bg-foreground group-hover/text-link:text-background motion-reduce:transition-none motion-reduce:group-hover/text-link:rotate-0"
              />
            </Link>
          </div>
        </div>
        <StudioPrinciples />
      </div>
    </section>
  );
}
