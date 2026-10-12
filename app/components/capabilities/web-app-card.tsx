import Image from "next/image";
import {
  CapabilityCard,
  ServiceHeading,
  ServiceNumber,
} from "./capability-card";

export function WebAppCard() {
  return (
    <CapabilityCard
      href="/services/web-app"
      variant="chalk"
      className="group/web min-h-65 min-[701px]:col-span-4 min-[701px]:col-start-5 min-[701px]:row-start-3"
      aria-labelledby="web-app-title"
    >
      <ServiceNumber className="-bottom-2 left-5" mobileNumber="3">
        o4
      </ServiceNumber>
      <div className="relative z-1 flex h-full max-w-[53%] -translate-y-3 flex-col justify-center min-[701px]:max-w-[60%] min-[1001px]:max-w-[53%]">
        <ServiceHeading id="web-app-title">
          Web /{" "}
          <em className="inline-block origin-bottom-left skew-x-6 font-editorial font-normal transition-transform duration-800 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-focus-within/web:translate-x-1 motion-safe:group-focus-within/web:-skew-x-2 motion-safe:group-hover/web:translate-x-1 motion-safe:group-hover/web:-skew-x-2 motion-reduce:transition-none">
            App
          </em>
        </ServiceHeading>
        <p className="mt-2 max-w-42 text-[11px] leading-[1.5] min-[1001px]:text-[12px]">
          We design digital products that turn complex ideas into intuitive,
          seamless experiences.
        </p>
      </div>
      <Image
        src="/studio/web-app-phone.png"
        width={666}
        height={1126}
        alt="A metallic phone displaying TACTIC’s sculptural opposing forms."
        className="absolute top-8 left-[calc(100%-min(46%,196px)-8px)] w-[43%] max-w-46 transition-transform duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:group-hover/web:-translate-y-1.5 motion-reduce:transition-none min-[701px]:top-7 min-[701px]:left-[calc(100%-min(42%,196px)-8px)] min-[701px]:w-[39%] min-[1001px]:left-[calc(100%-min(46%,196px)-12px)] min-[1001px]:w-[43%]"
        sizes="(min-width: 1001px) 184px, (min-width: 701px) 140px, 43vw"
      />
    </CapabilityCard>
  );
}
