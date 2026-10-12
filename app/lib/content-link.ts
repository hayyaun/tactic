export function safeContentLink(href: unknown): string | undefined {
  if (typeof href !== "string" || /[\u0000-\u0020\u007f\\]/.test(href))
    return undefined;
  if (href.startsWith("#")) return href;
  if (href.startsWith("/") && !href.startsWith("//")) return href;

  try {
    const url = new URL(href);
    if (
      ["https:", "http:", "mailto:", "tel:"].includes(url.protocol) &&
      !url.username &&
      !url.password
    )
      return href;
  } catch {
    return undefined;
  }
  return undefined;
}
