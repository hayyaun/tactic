import { defineQuery } from "next-sanity";

export const PUBLISHED_CONTENT_QUERY = defineQuery(`
  *[_type == "contentPage" && status == "published" && defined(path)
    && !(_id in path("drafts.**"))]
  | order(_updatedAt desc) {
    _id,
    path,
    kind,
    status,
    title,
    description,
    eyebrow,
    hero {
      _type, alt, crop, hotspot,
      asset->{_id, metadata {dimensions {width, height}}}
    },
    socialImage {
      _type, alt, crop, hotspot,
      asset->{_id, metadata {dimensions {width, height}}}
    },
    blocks[] {
      _key,
      _type,
      text,
      items,
      caption,
      image {
        _type, alt, crop, hotspot,
        asset->{_id, metadata {dimensions {width, height}}}
      }
    },
    publishedAt,
    "updatedAt": coalesce(updatedAt, _updatedAt),
    author
  }
`);
