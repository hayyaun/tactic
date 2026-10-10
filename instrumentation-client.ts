// This file configures the initialization of Sentry on the client.
// Error monitoring only; no session replay, performance traces, logs, or metrics.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { filterErrorEvent } from "./app/lib/sentry-privacy";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled:
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_VERCEL_ENV === "production",
  beforeSend: filterErrorEvent,
  beforeSendLog: () => null,
  beforeSendMetric: () => null,

  // Clarity is the sole optional recorder and requires explicit consent.
  replaysSessionSampleRate: 0,
  replaysOnErrorSampleRate: 0,

  dataCollection: {
    userInfo: false,
    httpBodies: [],
    cookies: false,
    httpHeaders: false,
    urlQueryParams: false,
  },
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
