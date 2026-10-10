"use client";

import Link from "next/link";
import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  retry,
  error,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);
  return (
    <html lang="en">
      <body>
        <main>
          <h1>TACTIC — Something went wrong.</h1>
          <p>Please try loading the page again.</p>
          <button onClick={retry}>Try again</button>
          <p>
            <Link href="/">Back to home</Link>
          </p>
        </main>
      </body>
    </html>
  );
}
