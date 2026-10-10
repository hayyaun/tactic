// Public configuration only. Never put credentials in this module.
export const site = {
  name: "TACTIC",
  url: "https://tacticforyou.com",
  description:
    "TACTIC is an independent creative studio. Clear thinking, distinctive identities, and considered digital experiences.",
};

export function isIndexable() {
  // Self-hosted production must explicitly opt in; previews default to noindex.
  return process.env.VERCEL_ENV
    ? process.env.VERCEL_ENV === "production"
    : process.env.SITE_INDEXABLE === "true";
}

export function absoluteUrl(path: string) {
  if (!path.startsWith("/") || path.startsWith("//"))
    throw new Error("Expected a local absolute path");
  return new URL(path, site.url).href;
}
