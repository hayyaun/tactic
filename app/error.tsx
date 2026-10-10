"use client";

import { RouteMessage } from "./components/route-message";

export default function Error({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <RouteMessage
      title="Something interrupted this page."
      action={
        <button
          onClick={retry}
          className="rounded-full bg-foreground px-6 py-3 text-sm text-background"
        >
          Try again
        </button>
      }
    >
      <p>Please try again. If the problem continues, return to the homepage.</p>
    </RouteMessage>
  );
}
