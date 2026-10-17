import { SectionHeading } from "../section-heading";
import { SectionLabel } from "../studio-content";
import { StudyCard } from "../study-card";

export function WorldSection() {
  return (
    <section
      className="studio-container py-25 min-[960px]:py-36.25"
      id="world"
      aria-labelledby="world-title"
    >
      <SectionLabel label="03 / The TACTIC world">
        <span className="hidden text-muted min-[960px]:inline">
          Thinking, made visible.
        </span>
      </SectionLabel>
      <div className="mx-0 mt-9.5 mb-10 grid gap-6.5 min-[960px]:mt-11.75 min-[960px]:mb-15 min-[960px]:flex min-[960px]:items-end min-[960px]:justify-between">
        <SectionHeading id="world-title" variant="world">
          A point of view.
          <br />
          <span className="text-muted">Made visible.</span>
        </SectionHeading>
        <p className="text-[12px] leading-[1.85] text-muted min-[960px]:mr-2 min-[960px]:pb-0.75">
          A glimpse into how we see things.
          <br />
          Purposeful ideas. Unexpected perspectives.
          <br />
          Always a clear direction.
        </p>
      </div>
      <div className="grid gap-8.75 min-[600px]:grid-cols-[repeat(3,minmax(0px,1fr))] min-[600px]:gap-5.5 min-[960px]:gap-7.5">
        <StudyCard study="pathways" />
        <StudyCard study="strategy" />
        <StudyCard study="architecture" />
      </div>
      <p className="mt-8 flex items-center gap-2.25 font-mono text-[8px] leading-[1.8] font-normal tracking-normal text-muted min-[960px]:mt-9.75">
        <span className="inline-block h-1 w-1 flex-[0_0_4px] rounded-full bg-green"></span>{" "}
        An exploration of our own identity. A reflection of our approach.
      </p>
    </section>
  );
}
