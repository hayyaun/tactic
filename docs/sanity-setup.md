# Sanity setup

The workspace contains two independent apps:

```text
tactic/
  studio-tactic/   Sanity Studio
  tacticforyou/    Next.js website
```

Both use project `bpblgmmr` (tactic) and dataset `production`. The Studio stays
standalone. There is no Studio route or Studio bundle in the website.

## Start locally

From `studio-tactic`, run `npm run dev` (normally http://localhost:3333).
From `tacticforyou`, run `npm run dev` (normally http://localhost:3000).
Use the port printed by each process if the default is already occupied.

## Content model

Create a **Content page** in the Studio. These are the website's supported paths:

- `/about` with kind About; `/contact` with kind Contact.
- `/privacy` with kind Privacy, available under **Main Pages → Privacy**.
- `/services`, `/portfolio`, or `/blog` with kind Section listing.
- `/services/<slug>` with kind Service.
- `/portfolio/<slug>` with kind Project.
- `/blog/<slug>` with kind Article and a publication date.

Slugs use lowercase letters, numbers, and single hyphens. Each path must be
unique. Create a section listing document to provide the title and introduction
for its index page; child entries are selected by their path prefix. The blog
also has a repository default titled Journal, so `/blog` renders even before a
listing document is created. A published `/blog` listing replaces that default.
The default contains no articles; the empty state is intentional.

The Privacy main page opens a single document at `/privacy`, starting with the
existing notice text when a new draft is created. Set Approval status to
Published and use Studio's Publish action to replace the website notice. Until
that document is published, `/privacy` retains the exact repository notice and
its existing metadata. Draft privacy changes do not appear publicly. Publishing
notice text does not change the footer's Privacy settings or recording controls.

Pages have title, description, optional section label, hero/social images,
author/dates, and ordered Page content blocks. Page content supports Portable
Text for normal paragraphs, H2/H3 headings, quotes, nested bullet/numbered lists,
bold, italic, inline code, underline, strikethrough, and safe links with an
optional new-tab setting. Image objects support alt text, crop, and hotspot.
Legacy paragraph, heading, and list objects have been removed from authoring
and rendering. Existing data must be migrated using `content-migration.md`. The
homepage's existing scene and capability content remain managed in the
application. See `portable-text.md` for the rich-text handoff.

The website owns the page designs. Blog, detail, about, contact, services,
portfolio, and privacy pages use shared internal-page navigation and footer
components styled to match the landing page. Their main content is visible
without entrance animations or the landing page's 3D scene. Changing layouts
requires a website deployment, not a Studio schema change. See `site-design.md`.

New documents start with Approval status Draft. Set that field to Published and
use the Studio's Publish action only when the content is approved. Sanity drafts
are excluded independently of the approval field. Unpublished routes keep the
existing not-found behavior; drafts do not appear in sitemap or RSS.

## Fetching and configuration

`app/sanity/client.ts` is server-only and uses the published perspective.
`app/content/load-pages.ts` combines approved repository entries with approved
Sanity documents, with Sanity taking precedence for matching paths. Rendering,
metadata, sitemap, and RSS use this same collection. Invalid paths and incomplete
articles are excluded. Fetch failures surface through the existing error handling.

The Next.js Cache Components content helper revalidates after 30 seconds. The
published-page renderer, page metadata, and dedicated blog route also have local
caches that revalidate after 30 seconds, with a five-minute client-router stale
window and a one-hour expiration.
On the first request after a revalidation interval, the previous value can be
served while the refresh runs. Browser navigation and the Sanity CDN can add a
delay; a full browser reload may be needed when checking newly published
content. This setup does not enable live draft preview or click-to-edit overlays.

The client defaults to the supplied project and dataset. These public overrides
are documented in `.env.example`:

```dotenv
NEXT_PUBLIC_SANITY_PROJECT_ID=bpblgmmr
NEXT_PUBLIC_SANITY_DATASET=production
```

Public published reads need no API token. If the dataset becomes private, set
`SANITY_API_READ_TOKEN` to a Viewer token on the server. Never prefix the token
with `NEXT_PUBLIC_`. Restart development after changing configuration and rebuild
and redeploy the website when changing public variables. No token is included
in the browser bundle. Image optimization permits only this project's dataset
on `cdn.sanity.io`. Server-side reads do not require adding website CORS origins.

This WSL environment receives HTTP 403 from the Content Lake CDN, while the
direct API succeeds. The gitignored `.env.local` therefore sets the server-only
`SANITY_USE_CDN=false` override. Published reads still use the Next.js cache;
this selects Sanity's direct API for its upstream requests. CDN reads remain
the default wherever that override is unset. Restart development or rebuild a
production preview after changing it.

## Types and schema updates

From `studio-tactic`:

```sh
npm run typegen
npm run schema:validate
npm run schema:deploy
npm run typecheck
npm run lint
npm run build
```

TypeGen scans `../tacticforyou/app/` and writes `../tacticforyou/sanity.types.ts`.
It is also enabled during Studio development/build. Regenerate types after
schema or GROQ query changes and commit the generated types with the code.
`schema:deploy` registers the model in Sanity; it does not publish documents or
host the Studio. The standalone Studio is built and hosted separately on Vercel.

The Studio now sets `deployment.autoUpdates: false` in `sanity.cli.ts`, using
Sanity's [documented opt-out](https://www.sanity.io/docs/studio/latest-version-of-sanity#opting-out).
Its production build bundles the locally installed Studio core and dashboard
together, avoiding the mixed-version Sanity UI CSS collision seen in the
auto-updating deployment. Build normally with `npm run build`; no deprecated
flags or dashboard inline-style overrides are needed. This is a fix for this
deployment's dependency mismatch, not a general requirement for dashboards.

Studio software updates now require deliberate dependency updates, checks, and
a Vercel rebuild/redeployment. Content editing and publishing remain unchanged.
Re-enable auto-updates only after the styling incompatibility is resolved and
an auto-updating production build has been verified.

## Hosted Studio

The Studio is hosted on Vercel at
[studio.tacticforyou.com](https://studio.tacticforyou.com). Its registered
application ID, `pox5j4a3sxe0k851s2duo72h`, is the default in `sanity.cli.ts`.
The optional `SANITY_STUDIO_APP_ID` build-time override still takes precedence;
any existing Vercel value should match this application ID. Build with
`npm run build` and use `dist` as the Studio's Vercel output directory.
`npm run deploy` targets Sanity hosting, not this Vercel deployment.
Rebuild and redeploy the Studio's Vercel project for the saved auto-update setting
to take effect. No new environment variables or Next.js deployment are required
for this Studio-only runtime change.
Team members use the Vercel-hosted editor and the existing production dataset;
your local development server does not need to run for them to publish. Manage
invitations and publishing permissions in Sanity Manage.

Normal text/image edits need only approval and publishing in Studio. Redeploy
Studio after schema or editor configuration changes. Redeploy the Next.js app
after website design or repository content changes. No Studio changes are
required for the shared internal-page design.

The Portable Text cleanup requires a content migration and a Studio deployment.
Follow `content-migration.md` before deploying the cleaned-up website or Studio:
back up, preview the migration, apply it deliberately, and deploy both apps with
the documented compatibility or maintenance-window precautions. Approval rules,
cache settings, environment variables, and saved application ID were unchanged
by that cleanup. The current Studio auto-update setting is documented above.
No production mutations or hosted deployments have
been performed by the agent for this cleanup.

From `tacticforyou`, validate with `npm run lint`, `npm run build`, and the focused
Playwright tests in `tests/sanity.spec.ts` and `tests/foundations.spec.ts`.

See `sanity-command-log.md` for the setup commands, outcomes, and state changes.
See `portable-text.md` for the subsequent editor update and its verification.
