import Image from "next/image";
import { studies, type Study } from "../studies";
import { StudyButton } from "./dialog-buttons";

export function StudyCard({ study }: { study: Study }) {
  const content = studies[study];
  return (
    <StudyButton
      className="group/study block w-full bg-transparent p-0 text-left"
      aria-label={`View ${content.title} brand study`}
      study={study}
    >
      <div className="relative aspect-square overflow-hidden rounded-[23px] bg-[rgb(24,29,22)] min-[960px]:rounded-[28px]">
        <Image
          className="h-full w-full object-cover filter-[saturate(0.65)_brightness(0.98)] [transition:transform_0.9s_cubic-bezier(0.2,0.7,0.2,1),filter_0.6s] group-hover/study:transform-[scale(1.035)] group-hover/study:filter-[saturate(0.85)_brightness(1.04)] motion-reduce:transition-none motion-reduce:group-hover/study:transform-none"
          src={content.src}
          width={content.size}
          height={content.size}
          alt={content.alt}
          sizes="(min-width: 1424px) 408px, (min-width: 960px) calc((100vw - 204px) / 3), (min-width: 600px) calc((100vw - 124px) / 3), calc(100vw - 48px)"
        />
        <span className="absolute top-3.75 right-3.75 grid h-9 w-9 place-items-center rounded-full bg-[rgba(245,247,238,0.8)] text-[17px] text-[rgb(51,76,59)] backdrop-blur-md [transition:background_0.3s,color_0.3s] group-hover/study:bg-[rgb(51,76,59)] group-hover/study:text-[rgb(246,248,240)] motion-reduce:transition-none">
          ↗
        </span>
      </div>
      <div className="flex items-baseline justify-between gap-3 px-0.75 pt-4.75 pb-3 [border-bottom:1px_solid_var(--line)] min-[600px]:flex-wrap min-[600px]:gap-2 min-[960px]:flex-nowrap">
        <h3 className="text-[14px] font-normal tracking-[-0.02em]">
          {content.title}
        </h3>
        <span className="font-mono text-[7px] leading-[1.7] font-normal tracking-wider whitespace-nowrap text-muted uppercase">
          {content.category}
        </span>
      </div>
    </StudyButton>
  );
}
