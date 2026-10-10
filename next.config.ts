import type { NextConfig } from "next";
import { isIndexable } from "./app/lib/site";

const permanentRedirects: {
  source: string;
  destination: string;
  permanent: true;
}[] = [];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  redirects: () => permanentRedirects,
  headers: () => [
    {
      source: "/:path*",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "X-Frame-Options", value: "DENY" },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        ...(!isIndexable()
          ? [{ key: "X-Robots-Tag", value: "noindex, nofollow" }]
          : []),
      ],
    },
  ],
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
