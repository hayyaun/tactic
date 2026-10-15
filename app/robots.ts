import type { MetadataRoute } from "next";
import { isIndexable, site } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return isIndexable()
    ? {
        rules: {
          userAgent: "*",
          allow: "/",
          disallow: ["/api/", "/blog", "/portfolio"],
        },
        sitemap: `${site.url}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
