# Content and asset handoff

The types live in `app/content/types.ts`. Content can be authored in the standalone sibling `studio-tactic` Sanity Studio; approved repository entries can also live in `app/content/pages.ts`. `app/content/load-pages.ts` combines both sources. `ContentPage` renders detail/about/contact pages; `ContentListing` renders services and portfolio listings. The dedicated `BlogListing` renders `/blog`. These internal pages share `SiteHeader` and `SiteFooter`, the landing page's design tokens, and server-rendered content without added entrance delays. The landing page retains its own scene and section navigation. See `site-design.md` for the component handoff.

Explicit content routes resolve published entries only. Drafts and unknown paths show the not-found UI and are excluded from feeds. No unfinished content routes are added to navigation. The blog has a published repository default for its listing title and introduction, so `/blog` remains usable without a Sanity listing document. This default does not create any articles. Streaming detail routes can return HTTP 200 with a noindex not-found UI; unmatched URLs and unpublished static pages return HTTP 404. See `sanity-setup.md` for Studio setup and publishing.

## Fields for every page

- `path`: local URL such as `/services`, `/services/brand-design`, `/portfolio`, `/portfolio/project-name`, `/about`, `/contact`, `/blog`, `/blog/article-name`.
- `kind`: `listing`, `service`, `project`, `article`, `about`, or `contact`.
- `status`: `draft` until approved; then `published`.
- `title`: heading/title, without the automatic `| TACTIC` suffix.
- `description`: concise summary used for the introduction and metadata.
- `eyebrow`: optional section label.
- `blocks`: ordered Portable Text paragraphs, H2/H3 headings, quotes, bullet/numbered lists, inline formatting, links, and image objects. Legacy text objects are no longer supported; migrate existing data before deployment using `content-migration.md`. React escapes text; do not supply HTML. See `portable-text.md` for editing details.
- `hero` and `socialImage`: upload images with meaningful alt text and crop/hotspot in Sanity; repository entries use a local image path and actual pixel width/height.
- `publishedAt`, `updatedAt`: actual ISO dates, not deployment timestamps. Articles need `publishedAt` for RSS.
- `author`: optional actual article author.

Images go in `public/studio/` or an organized subdirectory. Send originals, descriptive filenames, dimensions, rights confirmation, and intended crops. Social images should be checked in the target platforms' preview tools; 1200 × 630 is a practical initial export. Service cards need separate crops that fit the current homepage cards.

## Page-specific content

- Homepage: audience, promise, service summaries, CTAs, first-section card images.
- Services: scope, deliverables, process, timeline, relevant work, CTA.
- Portfolio: project title, concept/client classification, challenge, approach, work, image captions.
- About: studio story and approach.
- Contact: approved contact details and expectations; match the privacy notice.
- Blog articles: body, author if applicable, publication date, summary, cover image, social image. Only approved, published articles at `/blog/<single-slug>` with a valid publication date appear in the listing, newest first. Reading time is estimated from the article's text at 220 words per minute, with a one-minute minimum.
- Blog listing: create a published `/blog` Section listing document to replace the default Journal title and introduction. Its optional image and blocks appear above the article collection. The newest article is featured; remaining articles use a flat archive. If no articles are published, an explicit empty state appears with an existing TACTIC brand image.
- Services and portfolio listings: introduction; child entries are found by their URL prefix.

## Publishing procedure

1. Add the entry as a draft. Do not reuse reserved paths `/api`, `/rss.xml`, `/robots.txt`, `/sitemap.xml`, or `/studio`.
2. Add assets and check copy, alt text, dimensions, dates, and URL uniqueness.
3. Change to `published` only when ready. Rendering, metadata, sitemap, and RSS share this collection.
4. Run lint, formatting, build, and browser checks. Verify the rendered page and social previews.
5. Add approved navigation links. For changed URLs, add an explicit permanent redirect in `next.config.ts`; do not redirect arbitrary 404s to the homepage.

Repository content changes require a deployment. Sanity pages appear after approval and Studio publishing, followed by the cache refresh; no website deployment is required for content edits. Do not add private information to either published collection.

Page design changes belong in the Next.js app. Change the Studio schema only when editors need new fields or content types. The shared page design did not require a Studio schema change. Page content now uses native Portable Text with image objects; old custom text types have been removed. Follow `content-migration.md` before deploying this cleanup. Dataset changes and Studio deployment are separate, deliberate operations.
