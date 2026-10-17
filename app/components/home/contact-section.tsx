import { ContactButton } from "../dialog-buttons";
import { SectionHeading } from "../section-heading";
import { SectionLabel } from "../studio-content";
import { ArrowUpRight, DirectionArrow } from "../ui/icons";

export function ContactSection() {
  return (
    <section
      className="studio-container mt-25 pt-13.5 pb-15 [border-bottom:1px_solid_var(--line)] [border-top:1px_solid_var(--line)] min-[960px]:mt-36.25 min-[960px]:pt-12.25 min-[960px]:pb-17.25"
      id="contact"
      aria-labelledby="contact-title"
    >
      <SectionLabel label="05 / Your next move">
        <span className="hidden items-center gap-2 text-muted min-[960px]:inline">
          <span className="inline-block h-1 w-1 flex-[0_0_4px] rounded-full bg-green"></span>{" "}
          Let’s make something matter.
        </span>
      </SectionLabel>
      <div className="mt-10.5 flex flex-wrap items-center gap-8.25 min-[960px]:mt-14.75 min-[960px]:flex-nowrap min-[960px]:justify-between min-[960px]:gap-12.5">
        <SectionHeading id="contact-title" variant="contact">
          A good project starts
          <br />
          with a <span className="text-green">conversation.</span>
        </SectionHeading>
        <ContactButton
          preset="contactIcon"
          aria-label="Start a project enquiry"
        >
          <ArrowUpRight className="h-6.75 w-6.75 text-background min-[960px]:h-9.25 min-[960px]:w-9.25" />
        </ContactButton>
      </div>
      <div className="mt-9.75 flex flex-col items-start gap-6.75 min-[960px]:mt-11.5 min-[960px]:flex-row min-[960px]:items-end min-[960px]:justify-between">
        <p className="text-[12px] leading-[1.9] text-muted min-[960px]:text-[13px]">
          Have a challenge, an idea, or a curious question?
          <br />
          We’d love to hear what’s on your mind.
        </p>
        <div className="flex flex-col items-start gap-3 min-[960px]:items-end">
          <ContactButton preset="contact">
            Tell us what you’re building <DirectionArrow />
          </ContactButton>
          <Link
            className="inline-flex min-h-11 items-center gap-3 text-[12px] text-muted transition-colors hover:text-foreground motion-reduce:transition-none"
            href="/contact"
          >
            Visit our contact page{" "}
            <ArrowUpRight className="h-3.5 w-3.5 text-green" />
          </Link>
        </div>
      </div>
    </section>
  );
}
import Link from "next/link";
