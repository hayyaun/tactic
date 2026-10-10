"use client";

import Link from "next/link";

export default function GlobalError({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
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
