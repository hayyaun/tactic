# Portable Text cleanup command log

## Scope and state

Manual `apply_patch` edits removed custom paragraph/heading/list schemas and
frontend compatibility code, converted the repository privacy content and test
fixtures to native text, and added a native migration with six tests. Images and
captions remain supported. Privacy wording, publication controls, cache settings,
environment variables, Studio application ID, and saved auto-updates are unchanged.

No production mutation, dataset export/import, schema deployment, hosted Studio
deployment, commit, or development-server start/restart was performed. The only
production operation was a read-only migration preview. Tests used the existing
server at `http://localhost:3000`.

## Inspection

`Get-Location` and `Get-ChildItem -Name` confirmed both sibling folders.
`Get-Content` inspected the skill's `SKILL.md`, Portable Text and migration
references, repository instructions, package/configuration files, current schema,
renderer, query, adapter, content, tests, and documents. `rg -n` searched for
legacy block usage; `rg --files` located installed Next.js documentation and
Sanity migration API declarations. Official Sanity migration documentation was
checked with the web tool. These actions were read-only.

`Test-NetConnection localhost -Port 3000 -InformationLevel Quiet` returned true.
Windows `git -C studio-tactic diff --stat` and
`git -C tacticforyou diff --stat` could not resolve the UNC Git worktrees; their
WSL equivalents below succeeded. No Git state was changed.

## Studio commands

Each command below ran using the prefix:

```powershell
wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic/studio-tactic --
```

```sh
npm run typegen
npm run typecheck
npm run lint
npm run schema:validate
npm run test:migration
npx sanity migrations run --help
npx sanity migrations run legacy-text-to-portable-text --dry-run --project bpblgmmr --dataset production --no-progress
npm run build
npm run build -- --no-auto-updates
git diff --stat
git diff --check
```

- TypeGen rewrote local `schema.json` and the sibling `sanity.types.ts`: one
  query and 15 schema types. This changes generated files, not the hosted schema.
- Type checking and lint passed. An initial lint run flagged `structuredClone`
  as an undeclared global in two tests; using `globalThis.structuredClone`
  resolved it, and lint passed on rerun.
- Schema validation: zero errors and zero warnings.
- Six migration tests passed, including draft/published/release document IDs,
  revision guards, preservation, malformed content, and repeat runs. Node printed
  a harmless module-type warning when importing the TypeScript migration.
- CLI help verified flags. Production dry run produced four revision-guarded
  `blocks` patches and wrote nothing.
- Default build failed with HTTP 403 from the auto-update CDN. The temporary
  `--no-auto-updates` build succeeded; the deprecated flag changes only that
  invocation, not `deployment.autoUpdates: true`.
- Git diff inspection and whitespace checks passed.

Formatting commands rewrote only the named local files:

```sh
npx prettier --write schemaTypes/contentBlocks.ts schemaTypes/index.ts migrations/legacy-text-to-portable-text/index.ts migrations/legacy-text-to-portable-text/convert-blocks.mjs migrations/legacy-text-to-portable-text/convert-blocks.test.mjs package.json
npx prettier --write migrations/legacy-text-to-portable-text/migration.test.mjs package.json
```

## Website commands

Each command below ran using the prefix:

```powershell
wsl.exe -d Ubuntu --cd /home/garfield/projects/tactic/tacticforyou --
```

```sh
npx tsc --noEmit
npm run lint
npm run format:check
npm run build
git diff --stat
git diff --check
git diff -- app/privacy/page.tsx app/content/blog.ts app/content/types.ts app/components/content-blocks.tsx tests/foundations.spec.ts
```

TypeScript, lint, formatting, and whitespace checks passed. Production compilation
and type checking passed, but prerendering failed intentionally on unsupported
stored blocks in `/portfolio`. Production still contains four legacy documents;
run the migration before building/deploying this cleanup. This is **not** a
successful production build, and live CMS-route checks remain pending migration.

Formatting commands rewrote only the named local files:

```sh
npx prettier --write app/components/content-blocks.tsx app/content/types.ts app/content/blog.ts app/content/text-block.ts app/sanity/queries.ts app/sanity/transform.ts app/privacy/page.tsx tests/blog.spec.ts tests/content-design.spec.ts tests/foundations.spec.ts tests/portable-text.spec.ts tests/sanity.spec.ts
npx prettier --write docs/portable-text.md docs/content-migration.md docs/content-handoff.md docs/sanity-setup.md
```

## Focused tests

From `tacticforyou`, with the bundled Windows Node runtime and existing server:

```powershell
$env:PLAYWRIGHT_BASE_URL='http://localhost:3000'
$env:PLAYWRIGHT_CHANNEL='msedge'
& 'C:\Users\Hayyaun\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/@playwright/test/cli.js test tests/portable-text.spec.ts tests/blog.spec.ts tests/content-design.spec.ts tests/sanity.spec.ts --grep-invert 'without JavaScript|every viewport|does not hide' --output=test-results/portable-cleanup
& 'C:\Users\Hayyaun\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/@playwright/test/cli.js test tests/portable-text.spec.ts --grep 'every viewport' --output=test-results/portable-cleanup-browser
& 'C:\Users\Hayyaun\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' node_modules/@playwright/test/cli.js test tests/foundations.spec.ts --grep 'content templates|drafts stay' --output=test-results/portable-cleanup-foundations
```

The first run passed 22 unit/server-rendering checks. The second passed one
browser fixture check covering 320, 390, 960, and 1440 pixel viewports, with
JavaScript disabled, visible content, semantic nested lists, loaded images, and
no horizontal overflow or entrance animations. Mobile and desktop screenshots
were also inspected using `view_image`. Both foundation checks passed, covering
rendering and draft exclusion without mutating CMS data. In total, 25 focused
website checks and six migration tests passed. Test environment overrides affect
only the test process, not app settings or `.env` files.
