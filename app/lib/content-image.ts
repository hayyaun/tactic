import { dataset, projectId } from "../sanity/env";
import { absoluteUrl } from "./site";

export function contentImageUrl(src: string) {
  if (src.startsWith("/")) return absoluteUrl(src);
  const url = new URL(src);
  if (
    url.origin !== "https://cdn.sanity.io" ||
    !url.pathname.startsWith(`/images/${projectId}/${dataset}/`) ||
    url.username ||
    url.password
  )
    throw new Error("Expected a local image or this project's Sanity image");
  return url.href;
}
