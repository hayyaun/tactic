import type { MetadataRoute } from "next";
import { isIndexable, site } from "./lib/site";

export default function robots(): MetadataRoute.Robots {
  return isIndexable()
    ? {
        rules: { userAgent: "*", allow: "/", disallow: "/api/" },
        sitemap: `${site.url}/sitemap.xml`,
      }
    : { rules: { userAgent: "*", disallow: "/" } };
}
