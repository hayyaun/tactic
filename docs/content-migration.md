# Migrate old page content

The legacy text schemas and website renderers have been removed. Page content
uses native Portable Text `block` entries plus the existing `imageBlock` object
for images and captions. The field is still named `blocks` and remains one
ordered rich-text editor, not multiple editors.

## What the migration does

`studio-tactic/migrations/legacy-text-to-portable-text` changes only the `blocks`
field of existing `contentPage` documents containing old text:

- `paragraphBlock` becomes a normal Portable Text block.
- `headingBlock` becomes an H2 block, matching the previous website rendering.
- `listBlock` becomes one bullet-list block per item, in the same order.
- Existing images, captions, crop/hotspot, rich text, and other document fields
  remain intact. Text is copied literally, not interpreted as Markdown or HTML.
- Existing keys are retained; added list-item keys are deterministic and avoid
  collisions. A second run makes no changes to converted documents.
- Draft and published IDs stay the same. The migration does not publish drafts,
  change approval status, or alter editorial publication/update date fields.
  Sanity updates its system `_rev` and `_updatedAt` when a document is patched.
- Revision guards reject concurrent edits. Malformed old text or list data
  causes an error rather than silently discarding content.

A read-only production dry run on 2026-10-12 found four affected documents.
No production mutations, backup export, or deployment were performed by the
agent for this cleanup.

## Run it

Run these commands in `studio-tactic` using your existing Sanity login. Login
with `npx sanity login` if necessary. You need dataset write permissions for
the apply step. Do not commit backups; the `backups` directory is gitignored.
Use a new backup filename if this one already exists.
The optional `npm run test:migration` check uses Node.js 22.18 or newer to run
the migration's TypeScript integration tests; the CLI migration itself uses
Sanity's installed loader.

1. Pause editing in Studio, including any old locally running Studio. Export a
   backup **before** changing data:

   ```sh
   mkdir -p backups
   npx sanity dataset export production backups/production-before-portable-text-2026-10-12.tar.gz
   ```

   Confirm the command targets project `bpblgmmr` and completes successfully.
   Keep the export until you've checked all migrated pages.

2. Preview the proposed mutations; this command does not write anything:

   ```sh
   npx sanity migrations run legacy-text-to-portable-text --dry-run --project bpblgmmr --dataset production --no-progress
   ```

   Review the text, ordering, and targeted IDs. If a malformed block fails,
   repair it in the old Studio and repeat the backup and dry run. A dry run is
   not an approval to apply its output automatically.

3. When ready, apply the same migration to production:

   ```sh
   npx sanity migrations run legacy-text-to-portable-text --no-dry-run --project bpblgmmr --dataset production
   ```

   **This command writes production content.** Confirm the CLI prompt only
   after reviewing the preview. If a revision conflict occurs, keep editing
   paused and repeat the dry run and apply; already-converted documents are
   skipped. Migrations are atomic per document, not across the whole dataset.

4. Repeat the dry run. No patches should remain. Deploy the cleaned-up Next.js
   website and then run `npm run deploy` in `studio-tactic`. Reload Studio and
   check `/about`, the article, services, and portfolio content before allowing
   editing again. Ordinary future edits need only Studio approval and publishing.

## Deployment timing

Do not deploy the cleaned-up Studio or website while old blocks remain. The
website explicitly errors on unsupported stored block types rather than
silently removing writing. Because published pages share one cached collection,
one unmigrated published document can affect other content routes and builds.
Local development connected to production has the same restriction.

For uninterrupted rollout, the **currently deployed** website must support both
old objects and Portable Text before step 3. The prior additive Portable Text
implementation supported both; verify that version was deployed before removing
compatibility. Do not assume a website that only understands old blocks can
display migrated rich text.

If that compatible version is not deployed, schedule a short maintenance window
for migration and website deployment together. Then deploy the new Studio before
resuming edits. Do not deploy a legacy-only website against the converted data.
Existing cache refresh behavior is unchanged; reload and allow time for refresh.

## Recovery

Keep editors paused if anything fails. Do not blindly replace the entire
production dataset: doing so could overwrite unrelated or newer edits.
Restore the backup into a separate recovery dataset, compare the affected
documents, and selectively restore their `blocks` fields if needed. A rollback
to old block data also needs a compatible website and Studio version. Keep the
backup private because it may include drafts.

## Reference

The migration uses Sanity's native CLI and `sanity/migrate` patch helpers. See
[Sanity migration commands](https://www.sanity.io/docs/cli-reference/cli-migrations)
and [migration patterns](https://www.sanity.io/docs/content-lake/content-migration-cheatsheet).
