# Content and asset handoff

The types live in `app/content/types.ts`; approved entries go in `app/content/pages.ts`. `ContentPage` renders detail/about/contact pages; `ContentListing` renders listings. Explicit routes resolve published entries only. Drafts and unknown paths show the not-found UI and are excluded from feeds. No unfinished pages are added to navigation. Streaming detail routes can return HTTP 200 with a noindex not-found UI; unmatched URLs and unpublished static pages return HTTP 404.

## Fields for every page

- `path`: local URL such as `/services`, `/services/brand-design`, `/portfolio`, `/portfolio/project-name`, `/about`, `/contact`, `/blog`, `/blog/article-name`.
- `kind`: `listing`, `service`, `project`, `article`, `about`, or `contact`.
- `status`: `draft` until approved; then `published`.
- `title`: heading/title, without the automatic `| TACTIC` suffix.
- `description`: concise summary used for the introduction and metadata.
- `eyebrow`: optional section label.
- `blocks`: ordered paragraphs, headings, lists, and images. Plain text is escaped by React; do not supply HTML.
- `hero` and `socialImage`: optional local image path, meaningful alt text, and actual pixel width/height.
- `publishedAt`, `updatedAt`: actual ISO dates, not deployment timestamps. Articles need `publishedAt` for RSS.
- `author`: optional actual article author.

Images go in `public/studio/` or an organized subdirectory. Send originals, descriptive filenames, dimensions, rights confirmation, and intended crops. Social images should be checked in the target platforms' preview tools; 1200 × 630 is a practical initial export. Service cards need separate crops that fit the current homepage cards.

## Page-specific content

- Homepage: audience, promise, service summaries, CTAs, first-section card images.
- Services: scope, deliverables, process, timeline, relevant work, CTA.
- Portfolio: project title, concept/client classification, challenge, approach, work, image captions.
- About: studio story and approach.
- Contact: approved contact details and expectations; match the privacy notice.
- Blog: body, author if applicable, publication date, summary, cover image, social image.
- Listings: introduction; child entries are found by their URL prefix.

## Publishing procedure

1. Add the entry as a draft. Do not reuse reserved paths `/api`, `/rss.xml`, `/robots.txt`, `/sitemap.xml`, or `/studio`.
2. Add assets and check copy, alt text, dimensions, dates, and URL uniqueness.
3. Change to `published` only when ready. Rendering, metadata, sitemap, and RSS share this collection.
4. Run lint, formatting, build, and browser checks. Verify the rendered page and social previews.
5. Add approved navigation links. For changed URLs, add an explicit permanent redirect in `next.config.ts`; do not redirect arbitrary 404s to the homepage.

The collection is repository-owned static data. Publishing requires a deployment. Do not add private information to it.
