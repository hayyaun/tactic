export type HeroTapEvent = Pick<
  PointerEvent,
  | "pointerId"
  | "pointerType"
  | "isPrimary"
  | "clientX"
  | "clientY"
  | "timeStamp"
>;

type TapCandidate = {
  pointerId: number;
  bodyName: string;
  x: number;
  y: number;
  startedAt: number;
};

const MAX_TAP_MOVEMENT = 10;
const MAX_TAP_DURATION = 500;

function withinTapDistance(event: HeroTapEvent, candidate: TapCandidate) {
  return (
    Math.hypot(event.clientX - candidate.x, event.clientY - candidate.y) <=
    MAX_TAP_MOVEMENT
  );
}

export function createHeroTapTracker() {
  let candidate: TapCandidate | null = null;

  return {
    start(event: HeroTapEvent, bodyName: string) {
      if (event.pointerType !== "touch") return;
      candidate = event.isPrimary
        ? {
            pointerId: event.pointerId,
            bodyName,
            x: event.clientX,
            y: event.clientY,
            startedAt: event.timeStamp,
          }
        : null;
    },
    move(event: HeroTapEvent) {
      if (event.pointerType !== "touch" || !candidate) return;
      if (
        !event.isPrimary ||
        event.pointerId !== candidate.pointerId ||
        !withinTapDistance(event, candidate)
      ) {
        candidate = null;
      }
    },
    end(event: HeroTapEvent, bodyName: string) {
      const previous = candidate;
      candidate = null;
      if (
        !previous ||
        event.pointerType !== "touch" ||
        !event.isPrimary ||
        event.pointerId !== previous.pointerId ||
        bodyName !== previous.bodyName ||
        !withinTapDistance(event, previous)
      ) {
        return false;
      }
      const elapsed = event.timeStamp - previous.startedAt;
      return elapsed >= 0 && elapsed <= MAX_TAP_DURATION;
    },
    cancel() {
      candidate = null;
    },
  };
}
