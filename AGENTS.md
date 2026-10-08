# Agent instructions

## Command transparency

- After running commands, recap the actual commands, their purpose, and their outcome. Redact secrets.
- Explicitly call out commands or tool actions that change application settings or state.
- Apply this communication preference across projects and future chats when these instructions are available.

## Documentation and project conventions

- Inspect `package.json`, framework configuration, and existing components before making changes. This project uses the Next.js App Router, TypeScript, and Tailwind CSS v4.
- Read the relevant installed Next.js guides in `node_modules/next/dist/docs/` before writing code. These version-matched docs take precedence when online documentation differs.
- Use official [Next.js documentation](https://nextjs.org/docs/app) and [Tailwind documentation](https://tailwindcss.com/docs) for additional guidance. Check that APIs and syntax apply to the installed versions; do not upgrade dependencies just to match a guide.
- Follow the `tailwind-v4` skill when available for styling work. The rules below apply even when the skill is unavailable.

## Tailwind CSS rules

- Use utilities for ordinary layout, spacing, typography, colors, and interaction states. Reuse existing design tokens and components before adding new abstractions.
- Keep the v4 `@import "tailwindcss"` entrypoint and existing Turbopack integration. Avoid introducing v3 `@tailwind` directives or JavaScript configuration recipes without a demonstrated need.
- Define utility-generating tokens in top-level `@theme`; use `@theme inline` for references to other variables, including `next/font` variables. Use ordinary CSS variables for values that do not need utilities. See [theme variables](https://tailwindcss.com/docs/theme).
- Write complete, statically detectable class names. Map variants to literal class strings rather than constructing names such as `bg-${color}-500`. See [source detection](https://tailwindcss.com/docs/detecting-classes-in-source-files).
- Use base styles for element defaults and the components layer for reusable patterns that utilities can override. Use `@utility` for custom utilities; reserve `@apply` for cases where composing utilities in CSS improves clarity. Separately processed stylesheets using Tailwind-aware directives should use `@reference` rather than duplicate the Tailwind import. See [custom styles](https://tailwindcss.com/docs/adding-custom-styles) and [directives](https://tailwindcss.com/docs/functions-and-directives).
- Keep the theme/base/components/utilities layer order. Avoid conflicting utilities, broad `!important`, and unlayered rules that unexpectedly override utilities.
- Build responsive layouts mobile-first and preserve established breakpoints, dark-mode behavior, focus visibility, and reduced-motion support. See [responsive design](https://tailwindcss.com/docs/responsive-design).
- Extract shared React components when markup and behavior recur; do not create abstractions solely to shorten class lists. Plain CSS is appropriate for complex selectors and bespoke visual effects.

## Next.js best practices

- Keep pages and layouts as Server Components by default. Add `"use client"` at the smallest practical boundary for state, event handlers, effects, or browser APIs; pass serializable props across that boundary. See [Server and Client Components](https://nextjs.org/docs/app/getting-started/server-and-client-components).
- Fetch server-owned data close to its source in Server Components or server modules. Keep secrets and privileged logic on the server, and mark server-only modules with `import 'server-only'` where appropriate.
- Follow App Router file conventions for layouts, pages, loading, error, and not-found UI. Provide useful loading and failure states for asynchronous routes.
- Check the installed API signatures for request APIs and route props; await asynchronous APIs such as `cookies()`, `headers()`, `params`, and `searchParams` where required.
- This project enables `cacheComponents` and `partialPrefetching`. Read the installed caching and rendering guides before changing data access or route behavior. Choose caching and invalidation deliberately; do not assume legacy fetch defaults or apply unsupported route-segment settings.
- Validate input and enforce authentication and authorization inside Server Actions and Route Handlers. Treat them as externally callable endpoints, and never place request-specific or private data in a shared cache without checking the documented isolation rules.
- Prefer `next/link` for internal navigation, `next/image` for suitable images, `next/font` for fonts, and the Metadata API for page metadata. Supply meaningful image alt text and correct sizing.
- Preserve semantic HTML, accessible form labels, keyboard interaction, and stable server/client rendering. Avoid suppressing hydration errors instead of fixing their cause.
- Use the official [production checklist](https://nextjs.org/docs/app/guides/production-checklist) when reviewing performance, accessibility, and deployment readiness.

## Validation

- For application code changes, run the repository's `npm run lint` and `npm run build` scripts, plus focused checks appropriate to the change. Report failures and any checks you could not run.
- For styling changes, inspect affected pages at mobile and desktop sizes and relevant interaction states; a passing build does not verify visual correctness.
- For documentation-only changes, review the diff and run `git diff --check`; a full application build is unnecessary.
- Preserve unrelated local changes and keep the generated Next.js notice below intact.

---

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
