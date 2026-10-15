import { expect, test } from "@playwright/test";
import {
  createHeroTapTracker,
  type HeroTapEvent,
} from "../app/components/hero-touch";

function touch(overrides: Partial<HeroTapEvent> = {}): HeroTapEvent {
  return {
    pointerId: 1,
    pointerType: "touch",
    isPrimary: true,
    clientX: 100,
    clientY: 200,
    timeStamp: 1000,
    ...overrides,
  };
}

test("a primary touch on the same artwork accepts tap boundary values", () => {
  const taps = createHeroTapTracker();
  taps.start(touch(), "green");
  taps.move(touch({ clientX: 106, clientY: 208, timeStamp: 1250 }));
  expect(
    taps.end(touch({ clientX: 106, clientY: 208, timeStamp: 1500 }), "green"),
  ).toBe(true);
  expect(taps.end(touch({ timeStamp: 1500 }), "green")).toBe(false);
});

test("a swipe stays rejected after the finger returns to its origin", () => {
  const taps = createHeroTapTracker();
  taps.start(touch(), "green");
  taps.move(touch({ clientX: 111, timeStamp: 1050 }));
  taps.move(touch({ timeStamp: 1100 }));
  expect(taps.end(touch({ timeStamp: 1150 }), "green")).toBe(false);
});

test("release displacement rejects movement even without a move event", () => {
  const taps = createHeroTapTracker();
  taps.start(touch(), "green");
  expect(taps.end(touch({ clientY: 211, timeStamp: 1100 }), "green")).toBe(
    false,
  );
});

test("long presses and inconsistent timestamps are rejected", () => {
  const taps = createHeroTapTracker();
  for (const timeStamp of [1501, 999]) {
    taps.start(touch(), "green");
    expect(taps.end(touch({ timeStamp }), "green")).toBe(false);
  }
});

test("a release on a different artwork or pointer clears the tap", () => {
  const taps = createHeroTapTracker();
  taps.start(touch(), "green");
  expect(taps.end(touch({ timeStamp: 1100 }), "red")).toBe(false);
  expect(taps.end(touch({ timeStamp: 1100 }), "green")).toBe(false);
  taps.start(touch(), "green");
  expect(taps.end(touch({ pointerId: 2, timeStamp: 1100 }), "green")).toBe(
    false,
  );
  expect(taps.end(touch({ timeStamp: 1100 }), "green")).toBe(false);
});

test("explicit cancellation rejects a pending tap", () => {
  const taps = createHeroTapTracker();
  taps.start(touch(), "green");
  taps.cancel();
  expect(taps.end(touch({ timeStamp: 1100 }), "green")).toBe(false);
});

test("secondary touches cancel a pending tap at every input phase", () => {
  const taps = createHeroTapTracker();
  const secondary = touch({ pointerId: 2, isPrimary: false });
  taps.start(touch(), "green");
  taps.start(secondary, "red");
  expect(taps.end(touch({ timeStamp: 1100 }), "green")).toBe(false);
  taps.start(touch(), "green");
  taps.move(secondary);
  expect(taps.end(touch({ timeStamp: 1100 }), "green")).toBe(false);
  taps.start(touch(), "green");
  expect(taps.end(secondary, "green")).toBe(false);
  expect(taps.end(touch({ timeStamp: 1100 }), "green")).toBe(false);
});

test("mouse and pen input cannot start taps or invalidate touch movement", () => {
  const taps = createHeroTapTracker();
  for (const pointerType of ["mouse", "pen"]) {
    taps.start(touch({ pointerType }), "green");
    expect(taps.end(touch({ pointerType }), "green")).toBe(false);
    taps.start(touch(), "green");
    taps.start(touch({ pointerType, pointerId: 2 }), "red");
    taps.move(touch({ pointerType, pointerId: 2, clientX: 300 }));
    expect(taps.end(touch({ timeStamp: 1100 }), "green")).toBe(true);
  }
});

test("a new primary touch restarts recognition and repeated taps work", () => {
  const taps = createHeroTapTracker();
  taps.start(touch(), "green");
  taps.start(touch({ pointerId: 3, timeStamp: 2000 }), "red");
  expect(taps.end(touch({ pointerId: 3, timeStamp: 2100 }), "red")).toBe(true);
  taps.start(touch({ pointerId: 4, timeStamp: 3000 }), "green");
  expect(taps.end(touch({ pointerId: 4, timeStamp: 3100 }), "green")).toBe(
    true,
  );
});
