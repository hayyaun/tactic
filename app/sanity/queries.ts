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
    seoTitle,
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
    teamIntro,
    team[] {
      _key,
      name,
      role,
      bio,
      portrait {
        _type, alt, crop, hotspot,
        asset->{_id, metadata {dimensions {width, height}}}
      }
    },
    blocks[] {
      _key,
      _type,
      caption,
      _type == "block" => {
        style,
        listItem,
        level,
        children[] {_key, _type, text, marks},
        markDefs[] {_key, _type, href, openInNewTab}
      },
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
