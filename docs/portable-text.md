# Portable Text content

Page content now supports Sanity's Portable Text rich-text editor. The standard
`block` type is the first member of the existing `contentPage.blocks` array in
`studio-tactic/schemaTypes/contentPage.ts`. Native text blocks and `imageBlock`
are its only members; the custom paragraph, heading, and list types are removed.

## Editing

In an existing or new Content page, write in Page content and use its inline
toolbar to format selected text. Supported styles are Normal, Heading 2,
Heading 3, and Quote. Supported formatting is bold, italic, inline code,
underline, and strikethrough. Bullet and numbered lists support nesting.

The editor's built-in Markdown shortcuts remain enabled: `## ` and `### ` for
the supported headings, `- ` or `1. ` for lists, `> ` for quotes, `**bold**`,
`_italic_`, and backticks for inline code. These create structured rich text;
the website does not parse raw Markdown. See the
[Sanity editor reference](https://www.sanity.io/docs/studio/portable-text-editor-configuration).

Links accept a root-relative website path such as `/about`, an anchor such as
`#page-content`, `http:`/`https:` web URLs, `mailto:`, or `tel:`. Bare relative
paths, protocol-relative URLs, credential-bearing URLs, control characters, and
unsafe schemes are not rendered as links. New-tab links include
`rel="noopener noreferrer"`. Link validation in Studio and the website's
`safeContentLink` helper provide separate checks; invalid stored links render
their text without a clickable URL.

Images remain image objects within the same ordered array, with alt text and
optional captions. The existing image schema remains useful for crop/hotspot,
alt text, and caption editing; it is not a separate text editor.

Existing custom text data needs a one-time migration. Follow
[the migration guide](content-migration.md) before deploying this cleanup.

Approval and publishing work as before: set Approval status to Published, then
use Studio's Publish action. Article publication dates remain required. Rich
text does not bypass draft filtering or make publication an instant preview.

## Website integration

- `app/sanity/queries.ts` projects text styles, list metadata, span text and
  marks, and link definitions alongside image fields.
- `app/sanity/transform.ts` adapts the generated query result into typed
  `ContentTextBlock` values without flattening rich text; block/span keys and
  ordering are retained.
- `app/components/content-blocks.tsx` uses the `@portabletext/react`
  Portable Text renderer as a server component. Adjacent text blocks are
  rendered together so nested lists retain their structure. Images remain in
  their original positions. No legacy text renderer remains.
- `app/lib/content-link.ts` permits only supported safe link destinations.
- `app/content/blog.ts` includes Portable Text span text when estimating article
  reading time, without counting formatting or link destinations as words.

The website imports `@sanity/client`, `groq`, and the Portable Text packages
directly. The Studio and its CLI stay in the sibling `studio-tactic` application.

The renderer uses the existing internal-page typography and colors without a
client-side editor or animation dependency.
Existing metadata, feeds, publication checks, image constraints, cache windows,
and environment settings are unchanged.

## Deployment order

See [content-migration.md](content-migration.md) for backup, dry-run, apply,
compatibility, and deployment instructions. The cleaned-up app rejects
unsupported stored blocks instead of silently dropping content. Do not deploy
this Studio schema or website until old data is converted.

The agent has not applied production mutations or deployed either app. The
saved application ID, enabled auto-updates, and environment settings remain
unchanged. See [cleanup-command-log.md](cleanup-command-log.md) for verification.
