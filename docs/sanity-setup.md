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
- `/services`, `/portfolio`, or `/blog` with kind Section listing.
- `/services/<slug>` with kind Service.
- `/portfolio/<slug>` with kind Project.
- `/blog/<slug>` with kind Article and a publication date.

Slugs use lowercase letters, numbers, and single hyphens. Each path must be
unique. Create a section listing document to provide the title and introduction
for its index page; child entries are selected by their path prefix.

Pages have title, description, optional section label, hero/social images,
author/dates, and ordered paragraph, heading, list, and image blocks. Images
support alt text, crop, and hotspot. The homepage's existing scene and capability
content remain managed in the application.

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

The Next.js Cache Components helper revalidates after 30 seconds. On the first
request after that interval, the previous value can be served while the refresh
runs. The browser router and Sanity CDN can add a short delay. This initial setup
does not enable live draft preview or click-to-edit overlays.

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
host the Studio. Studio hosting is a separate `npm run deploy` action.

During setup, the default Studio build received HTTP 403 while checking Sanity's
auto-update CDN. The installed CLI supports a temporary validation command:

```sh
npm run build -- --no-auto-updates
```

That invocation successfully bundles the locally installed Studio version and
does not change `deployment.autoUpdates: true` in `sanity.cli.ts`. The CLI warns
that the flag is deprecated. Resolve CDN access before relying on the default
auto-updating production build; no Studio hosting deployment was performed.
The running local Studio also uses `npm run dev -- --no-auto-updates` for this
environment. The saved auto-update option remains enabled.

From `tacticforyou`, validate with `npm run lint`, `npm run build`, and the focused
Playwright tests in `tests/sanity.spec.ts` and `tests/foundations.spec.ts`.

See `sanity-command-log.md` for the setup commands, outcomes, and state changes.
