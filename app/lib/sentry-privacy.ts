import type { ErrorEvent } from "@sentry/nextjs";

export function filterErrorEvent(event: ErrorEvent): ErrorEvent | null {
  // Contact requests may contain free text. Drop their error events entirely.
  if (event.request?.url?.split("?")[0]?.endsWith("/api/enquiry")) return null;
  delete event.user;
  delete event.extra;
  delete event.contexts;
  delete event.breadcrumbs;
  delete event.tags;
  if (event.request) {
    const url = event.request.url;
    event.request = { method: event.request.method };
    if (url) event.request.url = url.split(/[?#]/)[0];
  }
  if (event.exception?.values) {
    for (const exception of event.exception.values) {
      // Error messages can interpolate user input. Retain type and stack only.
      exception.value = "Application error (message removed for privacy)";
      for (const frame of exception.stacktrace?.frames ?? []) {
        delete frame.vars;
        if (frame.filename) frame.filename = frame.filename.split(/[?#]/)[0];
        if (frame.abs_path) frame.abs_path = frame.abs_path.split(/[?#]/)[0];
      }
    }
  }
  delete event.message;
  delete event.logentry;
  return event;
}
