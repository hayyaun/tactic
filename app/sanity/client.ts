import "server-only";
import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.SANITY_USE_CDN !== "false",
  perspective: "published",
  stega: false,
  token: process.env.SANITY_API_READ_TOKEN,
});
