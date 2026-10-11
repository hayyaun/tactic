import Link from "next/link";
import { ArrowUpRight, TacticMark } from "../ui/icons";
import { ServicesOrbit } from "./services-orbit";

export function ServicesExploreCard() {
  return (
    <Link
      href="/services"
      className="services-explore group relative flex min-h-60 flex-col justify-between overflow-hidden rounded-[25px] bg-[#2e3731] bg-[linear-gradient(125deg,transparent_40%,rgb(189_136_129/38%)_100%)] p-6 text-chalk shadow-[inset_1px_1px_1px_rgb(171_194_146/24%),inset_-1px_-1px_1px_rgb(189_136_129/22%),0_12px_28px_rgb(0_0_0/0.28)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-chalk min-[701px]:col-span-4 min-[701px]:col-start-9 min-[701px]:row-start-3 min-[701px]:min-h-0 min-[1001px]:p-7"
      aria-label="Explore our services"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,transparent_12%,rgb(189_136_129/22%)_100%)] opacity-0 transition-opacity duration-1200 ease-in-out group-hover:opacity-100 group-focus-visible:opacity-100 motion-reduce:transition-none"
      />
      <div className="relative z-1 flex items-center gap-2 opacity-65">
        <TacticMark className="h-6 w-4.5" aria-hidden="true" />
        <span className="text-[18px] font-medium tracking-[-0.055em]">
          TACTIC
        </span>
      </div>
      <ServicesOrbit />
      <p className="relative z-1 my-5 max-w-[65%] text-[28px] leading-[1.08] tracking-[-0.045em] min-[701px]:max-w-[62%] min-[1001px]:text-[34px]">
        Explore our
        <br />
        <em className="inline-block origin-bottom-left font-editorial font-normal transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover:translate-x-1 motion-safe:group-hover:-skew-x-8 motion-safe:group-focus-visible:translate-x-1 motion-safe:group-focus-visible:-skew-x-8 motion-reduce:transition-none">
          services.
        </em>
      </p>
      <span className="relative z-1 flex items-end justify-between gap-4">
        <span className="font-mono text-[8px] leading-[1.7] tracking-[0.03em] opacity-65 min-[1001px]:text-[9px]">
          Four specialties. One direction.
        </span>
        <ArrowUpRight
          className="h-5 w-5 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none"
          aria-hidden="true"
        />
      </span>
    </Link>
  );
}
