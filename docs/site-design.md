# Internal page design

The blog and internal content pages use the landing page's existing typefaces,
colors, `studio-container`, green accents, and thin dividers. Layouts are
server-rendered with no added entrance delays: no reveal animation, animation
library, or 3D scene is added to these routes. Fixed routes are pre-rendered.
Dynamic detail routes retain their existing runtime Suspense boundaries and
Next.js streaming behavior; on an unbuilt, cold detail request, JavaScript is
needed to reveal the streamed boundary. Static editorial images use
`next/image` with responsive sizes. The featured article image loads eagerly;
archive images remain lazy-loaded.

## Components

- `app/components/site-header.tsx` and `site-footer.tsx`: shared internal-page
  navigation and footer. The header links to `/#capabilities`, `/#studio`,
  `/blog`, and `/#contact`; the footer has the TACTIC mark, studio tagline, and
  RSS link. Keep their links usable even when a CMS page has not been published;
  landing-page section links do not depend on CMS documents.
- `app/components/blog-listing.tsx`: editorial heading, optional CMS introduction
  content, newest-article feature, flat archive, and honest empty state.
- `app/content/blog.ts`: repository listing default, approved single-slug article
  selection, newest-first ordering, and reading-time calculation.
- `app/components/content-page.tsx`: shared framing for published about/contact
  pages, service/project/article details, services/portfolio listings, and the
  repository-managed privacy page.
- `app/components/content-blocks.tsx`: readable paragraphs, headings, lists, and
  images. Preserve Sanity block keys and image alt text.
- `app/components/route-message.tsx`: shared framing for not-found and error
  messages, preserving retry and recovery actions.

The landing page keeps its existing `Header`, `HomeFooter`, 3D scene, and section
composition. Shared CSS tokens, rather than importing those landing components,
connect the internal designs to the established visual system.

## Content and new pages

Blog entries come from the same published collection as metadata, sitemap, and
RSS. The listing's default title is Journal. A published Sanity Section listing
at `/blog` overrides its title, introduction, optional hero, and blocks. The
default does not seed or fabricate articles. Publish an Article at a valid
`/blog/<slug>` path, provide its publication date, and set Approval status to
Published as well as using Studio's Publish action.

Existing supported CMS routes inherit the internal design through
`PublishedContent`, `ContentPage`, or `ContentListing`. For a custom layout,
reuse `SiteHeader`, `SiteFooter`, the content loader, and existing metadata
helpers. Keep the skip link and `page-content` target, semantic heading order,
local URLs, publication checks, and image dimensions. Do not add an unpublished
route to navigation. New editor fields or content types require a Studio schema
change; layout changes using current fields do not.

The shared data cache is unchanged: `loadPublishedPages` keeps
`stale: 30`, `revalidate: 30`, and `expire: 3600`. Fixed `/about`, `/contact`,
`/services`, and `/portfolio` page wrappers, the published-page renderer,
metadata helpers, and dedicated blog route use local Cache Components settings
with `stale: 300`, `revalidate: 30`, and `expire: 3600`: 30-second server
revalidation, a five-minute client-router stale window, and a one-hour
expiration. Content remains subject to the data cache and upstream refresh, so
publication is not an instant live-preview flow. A full browser reload may be
needed when checking recently published content after client-side navigation.

Dynamic `/blog/<slug>`, `/services/<slug>`, and `/portfolio/<slug>` routes do not
add `generateStaticParams`. With Cache Components, that hook requires a
nonempty result, while an empty CMS section is valid. The original runtime
Suspense/streaming contract remains unchanged.

## Development and checks

Use the development server the project owner already has running. Do not start,
restart, or background a server without an explicit request. If a server is not
running, ask the owner to run `npm run dev` in `tacticforyou` and use the URL it
prints (normally http://localhost:3000).

The focused blog and content-design tests cover selection, reading time,
server markup, no-JavaScript first-load visibility of live About, Blog, and
Privacy pages, responsive overflow, and loaded images for real,
populated-fixture, and empty states. Fixtures cover service/project listings
and detail templates without changing CMS content. Fixture articles exist only
in tests and are not published to Sanity.

## Command recap

Inspection used `Get-ChildItem -Force`,
`rg --files -g AGENTS.md -g !node_modules -g !.next -g !dist .`, and
`git status --short` through WSL. `Get-Content` read project instructions,
package settings, Tailwind guidance, installed Next.js documentation, existing
styles, components, routes, tests, and the content handoff documents. These were
read-only checks.

The implementation was formatted with targeted `npx prettier --write`
commands. These final checks passed after the shared components and all four
fixed-page cache wrappers were in place:

```powershell
wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic/tacticforyou -- npm run lint
wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic/tacticforyou -- npm run build
wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic/tacticforyou -- npm run format:check
wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic/tacticforyou -- git diff --check
```

The focused browser check set `PLAYWRIGHT_BASE_URL=http://localhost:3000` and
`PLAYWRIGHT_CHANNEL=msedge` for the test process, then used the bundled Windows
Node executable to run
`node_modules/@playwright/test/cli.js test tests/blog.spec.ts tests/content-design.spec.ts`.
All 14 tests passed against the existing localhost server, with desktop/mobile
screenshots inspected. These overrides did not change application settings.

Eight existing Sanity and foundation regressions also passed with the same
process overrides:

```powershell
node node_modules/@playwright/test/cli.js test tests/sanity.spec.ts tests/foundations.spec.ts --grep 'Sanity|article structured data|content templates|drafts stay|unpublished routes' --output=test-results/sanity-regressions
```

This selection excludes a separate SEO test that assumes an empty dataset.
A normal-JavaScript browser check also verified the published article at
desktop and mobile sizes: visible content, no horizontal overflow, and no
browser errors.

Documentation was formatted separately with
`wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic/tacticforyou -- npx prettier --write docs/site-design.md`.

Code and documentation edits change the website's design and blog listing
behavior. No Studio schemas, CMS documents, application environment settings,
or development-server processes are changed by this design work.
