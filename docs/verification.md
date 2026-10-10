# Green-task verification — 2026-10-10

## Completed scope

21 green implementation/review tasks are checked in `TODO.md`. The supplied domain also completed the canonical configuration and primary-domain decision. Final content/assets, live delivery, external accounts, deployment, and real-device testing remain open.

Implemented reusable content/detail/listing templates and explicit future routes; published-only content selection; robots, sitemap, RSS, safe structured data and metadata templates; guarded enquiry preparation with validation/honeypot/rate limits; pending/error/retry UI; fallback pages; production debug gating; security headers; CI checks; handoff and rollback documentation.

The redirect configuration is ready, but no existing URLs changed, so no invented redirect mappings were added. The form still prepares briefs rather than sending email. Production limiter setup is explicitly yellow, and production requests fail closed without it.

## Commands and outcomes

Linux commands were run through `wsl -d Ubuntu --cd /home/garfield/projects/tactic`.

- `git status --short`, `git diff --stat`, `git diff --numstat`: inspected local changes. The initial worktree was clean.
- `Get-Content TODO.md`, `Get-Content package.json`, `Get-Content next.config.ts`, `Get-Content .github/workflows/ci.yml`, `Get-Content README.md`: inspected scope, configuration, and existing validation.
- `rg --files node_modules/next/dist/docs` and targeted `Get-Content` reads: read installed metadata, robots, sitemap, route, forms, data-security, loading, error, caching, rendering, headers, redirects, JSON-LD, and production guides before implementation.
- `npm install server-only`: added the server-boundary marker dependency; no framework upgrades.
- `npm audit --omit=dev --json` and `npm audit --omit=dev --audit-level=high`: zero reported production vulnerabilities.
- `npm audit --json`: five high-severity development-tool findings through `braces`/ESLint. `npm view braces version` returned `3.0.3`, which remains affected. No forced downgrade was applied.
- `npx prettier --write app docs README.md tests/foundations.spec.ts`: formatted authored changes; existing unrelated application files remained unchanged.
- `npx prettier --write TODO.md README.md tests/foundations.spec.ts`: formatted checklist and final documentation/test updates.
- `npm run lint`: passed after fixing image alt annotations and the global-error navigation link.
- `npm run format:check`: passed after formatting `TODO.md`.
- `npm run build`: passed with the installed cacheComponents and partialPrefetching settings. Final build has production debug disabled.
- `env NEXT_PUBLIC_ENABLE_SCENE_DEBUG=true npm run build`: produced a separate test build for the existing debug/scene suite.
- `npx playwright install chromium`: failed with HTTP 403/location restriction. Used installed Windows Edge instead.
- `env CONTACT_LOCAL_RATE_LIMIT=true npm run start -- --port 3100`: started a local test server. This flag permits only a loopback process-local limiter.
- Windows `node node_modules/@playwright/test/cli.js test --timeout 120000 --trace off --output C:/Users/Hayyaun/AppData/Local/Temp/tactic-launch-checks-20261010` with `PLAYWRIGHT_BASE_URL=http://localhost:3100`, `PLAYWRIGHT_CHANNEL=msedge`, and the explicit debug test flag: 26 of 29 passed initially. Fixed the three identified issues; affected checks passed on focused reruns.
- Windows `node node_modules/@playwright/test/cli.js test tests/foundations.spec.ts tests/interactions.spec.ts --grep 'enquiry form|keyboard skip|background controls|unpublished routes' --timeout 120000 --trace off --output C:/Users/Hayyaun/AppData/Local/Temp/tactic-launch-recheck-20261010`: route, keyboard, and background checks passed. Scoped the form alert assertion to exclude Next.js's route announcer.
- Windows `node node_modules/@playwright/test/cli.js test tests/foundations.spec.ts --grep 'enquiry form' --timeout 120000 --trace off --output C:/Users/Hayyaun/AppData/Local/Temp/tactic-form-recheck-20261010`: form failure, retained input, retry, preview, and focus checks passed.
- Windows `node node_modules/@playwright/test/cli.js test tests/foundations.spec.ts --timeout 120000 --trace off --output C:/Users/Hayyaun/AppData/Local/Temp/tactic-final-production-checks-20261010` against the final default build: all nine passed, including production debug off, server guards, rate limits, SEO endpoints, and keyboard/form interaction.
- A Node/Playwright screenshot script inspected contact and not-found screens at 1440 × 1000 and 390 × 844: centered dialogs, no horizontal overflow. Screenshots were visually reviewed.
- A Node contrast calculation checked theme text against the background: foreground 16.56:1, muted 7.86:1, green 9.65:1, coral 7.32:1. This is a focused check, not a full accessibility certification.
- A Node fetch probe against `npm run start -- --port 3100` without local fallback/Redis configuration confirmed a 503 response rather than an unguarded submission.
- `ss -ltnp 'sport = :3100'`, `readlink /proc/1055711/cwd`, `ps -p 1055711 -o args=`: identified the test server before stopping/restarting it. Only test-server PIDs started in this session were stopped with `kill`.
- `git diff --check`: passed.

## Application configuration changes

- `next.config.ts`: security headers, removal of X-Powered-By, preview noindex headers, and an explicit empty redirect mapping for future URL changes.
- Root metadata: canonical domain configuration, robots policy, RSS discovery, and organization schema.
- Public indexing defaults off outside Vercel production unless explicitly enabled at build time; hosting details are documented in `launch-operations.md`.
- Production scene debug is disabled by default; CI deliberately enables it only for scene tests.
- GitHub Actions now audits production dependencies, checks both default and debug-enabled builds, cancels superseded runs, and retains failed artifacts for seven days.
- No website was deployed, no DNS/account settings were changed, and no real email was sent.

## Limits still requiring follow-up

Live Resend delivery, production Redis connectivity, hosting preview protection, final assets/metadata, social previews, external analytics/error tracking, and real-phone performance cannot be certified from these local tests. Published content is currently empty; new routes remain unavailable until approved entries arrive. The schema and feed templates are tested, but actual final content still needs review.
