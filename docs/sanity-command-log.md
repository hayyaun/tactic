# Sanity setup command recap

This recap records the setup and verification commands and their effects.
Linux commands were run through `wsl.exe -d Ubuntu --cd <directory> --` from the
parent workspace. Repeated checks are listed once.

## Workspace and skill inspection

PowerShell commands from the parent workspace included:

```powershell
Get-Location; Get-ChildItem -Force | Select-Object Mode,Name
rg --files --hidden -g '*sanity*' -g 'SKILL.md' -g '!node_modules' -g '!.git' C:\Users\Hayyaun\.agents\skills C:\Users\Hayyaun\.codex\skills
rg --files --hidden -g '*sanity*' -g 'SKILL.md' -g '!node_modules' -g '!.git' C:\Users\Hayyaun\.codex\plugins\cache
Get-Content tacticforyou\AGENTS.md,tacticforyou\package.json,studio-tactic\package.json
rg --files '\\wsl.localhost\Ubuntu\home\garfield\.agents\skills\sanity-best-practices\references' -g '*start*' -g '*nextjs*' -g '*structure*' -g '*schema*' -g '*typegen*'
Get-ChildItem -Force -File tacticforyou\.env* | ForEach-Object { Select-String -Path $_.FullName -Pattern '^NEXT_PUBLIC_SANITY_(PROJECT_ID|DATASET)=' | Select-Object Path,Line }
Test-Path tacticforyou\.env.local
```

These confirmed the sibling app/Studio layout, located the installed WSL skill,
and checked public Sanity variables without exposing environment secrets. No
skill installation was necessary. `Get-Content` and `rg` also inspected the
skill's `SKILL.md`, `get-started.md`, `nextjs.md`, `schema.md`, `typegen.md`, and
`image.md`; app routes/content/rendering/SEO/tests; and installed Next.js and
Sanity package documentation. A few guessed file paths did not exist and were
resolved with file searches.

`git status --short` initially failed with the Windows Git ownership check.
The equivalent command through WSL succeeded for both repositories, which were
clean before setup. No Git ownership setting was changed.

## Authentication, Dependencies, and Schema

From the parent workspace:

```sh
node --version
npx sanity@latest debug
```

Node was v22.18.0. Sanity CLI identified the existing authenticated account;
tokens remained redacted. The preflight installed the requested CLI in npm's
temporary cache and did not create a project.

From `tacticforyou`:

```sh
npm install next-sanity @sanity/image-url
```

This added the official frontend toolkit and image URL builder and updated the
package manifest/lockfile. Installed versions were next-sanity 13.3.4 and image-url
2.1.1. npm reported 20 audit findings; no unrelated dependency upgrades or audit
fixes were performed.

From `studio-tactic`:

```sh
npm install
npm run typegen
npm run schema:validate
npm run schema:deploy
npm run typecheck
npm run lint
```

`npm install` refreshed the lockfile after declaring the directly imported icon
package; npm reported 18 audit findings. TypeGen extracted the schema and found
one frontend query and 18 schema types. Its initial formatting warning was
resolved with the supported `formatGeneratedCode: false` option; generated types
are excluded from authored-code lint/format checks. Schema validation had zero
errors and zero warnings. TypeScript and lint passed.

**Remote state change:** `npm run schema:deploy` registered one schema in
project `bpblgmmr`, dataset `production`. No documents were created or published;
the user chose to add content manually. No hosted Studio deployment was run.

## Build, Format, and Tests

From `studio-tactic`:

```sh
npm run build
npm run build -- --help
npm run build -- --no-auto-updates
npm run dev -- --help
git diff --check
git diff --stat
```

The default build received HTTP 403 from the auto-update CDN. The documented
per-invocation flag successfully built the installed Studio. The CLI emitted a
deprecation warning for that flag. The saved `deployment.autoUpdates: true`
setting was preserved. Diff whitespace checks passed.

From `tacticforyou`:

```sh
npx tsc --noEmit
npm run lint
npm run build
npm run format:check
npx prettier --write app/sanity app/content/load-pages.ts app/content/types.ts app/lib/content-image.ts app/lib/structured-data.ts app/components/published-content.tsx app/components/content-page.tsx app/sitemap.ts app/rss.xml/route.ts next.config.ts eslint.config.mjs docs/sanity-setup.md docs/content-handoff.md README.md
git diff --check
git diff --stat
env PLAYWRIGHT_BASE_URL=http://127.0.0.1:3100 npx playwright test tests/sanity.spec.ts
npx eslint tests/sanity.spec.ts
npx prettier --check tests/sanity.spec.ts
env CONTACT_LOCAL_RATE_LIMIT=true npm run test:e2e -- tests/sanity.spec.ts tests/foundations.spec.ts --grep 'publication|route kinds|editorial blocks|image|drafts|SEO|unpublished|content templates'
npx playwright install chromium --only-shell
```

Initial TypeScript/lint checks identified a generated type-name mismatch and a
generated empty interface. The imports were corrected and generated code excluded
from lint. The final application build, lint, formatting, and whitespace checks
passed. The first build's content-CDN 403 was resolved through the client override
described below. The API version was pinned to the current UTC date to remove a
future-version warning.

All five pure Sanity tests passed. The initial mixed suite passed seven tests
but could not launch its one browser test because the matching Chromium binary
was absent. The attempted browser download was denied by the CDN for this
network location. The installed Windows Edge browser was then used instead.

## Network and Local Configuration

Read-only checks included:

```powershell
Invoke-RestMethod -Uri 'https://bpblgmmr.api.sanity.io/v2026-10-12/data/query/production?query=count(*)' | Select-Object result
Invoke-RestMethod -Uri 'https://bpblgmmr.apicdn.sanity.io/v2026-10-12/data/query/production?query=count(*)' | Select-Object result
wsl.exe -d Ubuntu --exec curl --silent --show-error --max-time 20 --get --data-urlencode 'query=count(*)' https://bpblgmmr.api.sanity.io/v2026-10-12/data/query/production
wsl.exe -d Ubuntu --exec curl --silent --show-error --max-time 20 --get --data-urlencode 'query=count(*)' https://bpblgmmr.apicdn.sanity.io/v2026-10-12/data/query/production
wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic -- ss -ltnp
Get-Command node | Select-Object Source
Test-Path 'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe'
```

The dataset contained zero documents. The direct API worked from WSL; its content
CDN returned HTTP 403 from WSL, although the Windows request succeeded. One curl
attempt through the default shell rejected the query wildcard; the explicit
`--exec` invocation above bypassed shell expansion.

**Local configuration change:** a new gitignored `.env.local` records the supplied
public project/dataset and `SANITY_USE_CDN=false`. This selects the direct API in
this environment. The default remains CDN reads when the override is unset.
No existing credentials, environment files, authentication controls, CORS origins,
indexing controls, or Studio auto-update configuration were removed.

Manual code edits used `apply_patch` to add registered Studio models, TypeGen
configuration and scripts, the frontend client/query/adapter/cache helper,
shared content/SEO/feed integration, the restricted image host configuration,
generated-file ignore entries, five tests, and setup documentation. Prettier and
TypeGen subsequently generated/formatted their own output.

## Running Local Apps

Hidden Windows background processes were started with `Start-Process wsl.exe`,
redirecting stdout/stderr to `tactic-studio.*.log` and `tactic-next.*.log` in the
Windows temporary directory. The actual server arguments were:

```sh
# studio-tactic
npm run dev -- --host 0.0.0.0 --port 3333 --no-auto-updates
# tacticforyou
npm run dev -- --hostname 0.0.0.0 --port 3000
```

**Application state change:** both local development servers were started. The
Studio command uses the temporary auto-update override for this invocation.
Logs were inspected with `Get-Content` to confirm startup and TypeGen watch mode.

Final browser tests run from PowerShell in `tacticforyou` used the existing Edge:

```powershell
$env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:3000'
$env:PLAYWRIGHT_CHANNEL='msedge'
node node_modules/@playwright/test/cli.js test tests/sanity.spec.ts tests/foundations.spec.ts --grep 'Sanity|article structured|content templates|drafts|SEO|unpublished'
```

These environment overrides apply only to the test process. Playwright writes
its ignored test outputs; it does not modify the dataset or publish content.

The first Windows run against the development server at `127.0.0.1:3000`
passed seven tests but timed out on its HTTP and unpublished-route checks. A
temporary production preview was started with:

```sh
npm run start -- --hostname 0.0.0.0 --port 3100
```

The same Windows test command was rerun with
`$env:PLAYWRIGHT_BASE_URL='http://localhost:3100'`. All nine tests passed,
including the browser recovery flow for unpublished routes. Development uses
the URL `http://localhost:3000`, which matches the dev server's trusted origin;
no `allowedDevOrigins` restriction was changed.

Final service checks used `Invoke-WebRequest -Uri 'http://localhost:3000/rss.xml'
-TimeoutSec 15 | Select-Object StatusCode` and the same command for
`http://localhost:3333`; both returned HTTP 200. A WSL curl request also verified
the empty RSS response. The development route was checked separately with:

```powershell
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
$env:PLAYWRIGHT_CHANNEL='msedge'
node node_modules/@playwright/test/cli.js test tests/foundations.spec.ts --grep 'unpublished routes'
```

That development browser check passed with `localhost:3000`. The temporary
production preview was then stopped after `wsl.exe -d Ubuntu --exec ss -ltnp
'sport = :3100'` verified its listening process; the stop command was
`wsl.exe -d Ubuntu --exec kill 62918`. The app and Studio development servers
remain running on ports 3000 and 3333. Final `git status --short`,
`git check-ignore .env.local`, and `git diff --check` checks confirmed the
intended changes, the local environment file's ignored status, and clean
whitespace. The setup guide was queued to open in the Codex file panel.
