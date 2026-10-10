# Launch operations

## Domain and indexing

The canonical domain is `https://tacticforyou.com`, configured in `app/lib/site.ts`. Root metadata and the homepage canonical use it; content pages supply their own canonical URL. Social imagery remains an asset task.

Indexing is off by default. Vercel production (`VERCEL_ENV=production`) is indexable; Vercel previews are always noindex. For other hosts, set `SITE_INDEXABLE=true` at **build time** only for public production. Robots, sitemap, root metadata, and response headers share this policy. Rebuild after changing it. The sitemap contains the homepage plus published content without fabricated modification dates. RSS is valid with no items until articles are published.

This prevents accidental indexing; it is not access control. Use hosting deployment protection for confidential previews. Authenticate any future draft-preview endpoints; none are provided today.

## Enquiry preparation and delivery

`POST /api/enquiry` validates data and returns a prepared brief by default. A separate explicit `intent=send` request sends through Resend only when `CONTACT_DELIVERY_ENABLED=true` and server credentials are configured. The UI preserves the brief on failure and retries with the same UUID idempotency key; it confirms submission only after provider acceptance. It does not persist leads. Server guards enforce field limits, a service allowlist, request origin, content type, streamed body size, honeypot, and rate checks. Responses are `no-store`. Never cache, log, or send these fields to analytics.

Production rate limiting uses Upstash Redis REST with an atomic, expiring shared bucket (30 requests per minute). It stores only a counter, not IP addresses or form contents. Set server-only `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, or Vercel integration aliases `KV_REST_API_URL` and writable `KV_REST_API_TOKEN`. Missing/broken configuration fails closed. Provider requests time out after three seconds. Local credentials passed a live write check; add them to Vercel before deployment.

Development uses a process-local bucket. For production-server tests on your computer, set `CONTACT_LOCAL_RATE_LIMIT=true`; this fallback is restricted to loopback request hosts. Never enable this on public hosting.

Sender-domain verification and forwarding for `admin@tacticforyou.com` are still pending, so keep delivery disabled on public hosting. See `docs/provider-setup.md` and `.env.example` for setup, privacy, and integration verification. Resend acceptance is distinct from confirmed inbox delivery.

## Security and debug behavior

- `server-only` prevents enquiry server modules entering client bundles. Shared configuration contains no secrets.
- Secrets belong in server environment variables; `.gitignore` ignores environment files. Never prefix secret keys with `NEXT_PUBLIC_`.
- Responses include `nosniff`, a restrictive referrer policy, frame denial, and disabled camera/microphone/geolocation permissions. `X-Powered-By` is removed.
- No broad Content Security Policy was enabled without integration testing. Next.js streaming, inline hydration, WebGL, and future analytics need a deliberate policy; nonces can affect prerendering. Review this when integrations are chosen.
- HSTS belongs to HTTPS deployment configuration. Verify HTTPS and subdomains before enabling an `includeSubDomains` policy.
- Production scene controls ignore `?debug` unless explicitly built with `NEXT_PUBLIC_ENABLE_SCENE_DEBUG=true`. Keep this unset for public deployments. Development enables the controls. The flag contains no secrets.
- The dependency review found no reported production vulnerabilities. The full audit reports five high-severity development-tool findings stemming from `braces` via ESLint. No forced framework downgrade was applied; reassess when a compatible patch is available.

## Verification and CI

```sh
npm run lint
npm run format:check
npm audit --omit=dev --audit-level=high
npm run build
CONTACT_LOCAL_RATE_LIMIT=true npm run test:e2e -- tests/foundations.spec.ts
```

Use a separate explicit debug build for the complete scene regression suite:

```sh
NEXT_PUBLIC_ENABLE_SCENE_DEBUG=true npm run build
NEXT_PUBLIC_ENABLE_SCENE_DEBUG=true CONTACT_LOCAL_RATE_LIMIT=true npm run test:e2e
```

Rebuild without debug enabled before deployment. CI checks the default build first and an explicitly enabled debug build second. The latter is only a CI artifact; hosting must run its own default build. CI cancels superseded runs, audits production dependencies, and retains failed browser artifacts for seven days. No external deployment account is configured here.

## Production checks

After account setup and final content, verify domain/HTTPS and domain redirects; actual enquiry delivery; robots, sitemap, RSS, canonicals and sharing previews; navigation and 404s; accessibility and mobile WebGL fallback; analytics exclusions/events; Sentry and uptime alerts; privacy and consent. Submit the sitemap to Search Console once production is public.

## Rollback and backup

1. Record the deployment URL and commit before release; retain the previous verified deployment.
2. Use the provider's rollback/redeploy tool to restore it. Otherwise deploy the known-good commit from a separate checkout. Do not reset a checkout containing unrelated local work.
3. Smoke-test homepage, enquiries, key pages, and feeds after rollback. Code rollback does not restore databases, DNS, or account settings.
4. Keep content/assets versioned and pushed; separately back up original assets and export any future CMS/CRM data. Configure Redis backups if needed.
5. Store secrets in a password manager or hosting secret store. Document recovery access for domain, hosting, email, and monitoring accounts.
6. Confirm the user can access rollback tools and rehearse restoration on a non-public deployment.

## Performance work — 2026-10-11

- Read the desktop PageSpeed report and profiled the public site in headless Edge with JavaScript sampling, long-task observation, and WebGL timing probes. The local machine did not reproduce the full reported 27-second TBT. Synchronous program-info queries and texture uploads were measurable contributors; CSS was not the main concern.
- The hero now warms scene shaders with `compileAsync` while keeping the preview visible and frame loop paused. Context restoration repeats warmup; inactive scenes remain paused. Existing shader error diagnostics are preserved.
- Preview images now use Next.js responsive image optimization and picture sources, preserving framing and eager/high-priority loading. The desktop size hint follows the hero's height constraints; mobile uses viewport width.
- `Get-Content`, `rg --files`, `rg -n`, and `git status --short` inspected components, settings, tests, framework configuration, and installed Next/Three source documentation. Official Fiber and Three documentation was checked without upgrading dependencies.
- `node C:/Users/Hayyaun/AppData/Local/Temp/tactic-profile.cjs <URL>` used the bundled Windows Node runtime and installed Playwright to profile public/local pages read-only. Probe timings are hardware-dependent and are not Lighthouse score predictions. An initial local profile ran alongside tests, so its timings were not used to claim a gain; the profile was repeated independently.
- `npx prettier --write app/components/hero-canvas.tsx app/components/hero-preview.tsx`, `npm run lint`, and `npm run build` passed. A second build verifies the refined desktop image-size hint.
- `npm run start -- --port 3100` launched a temporary production server. `node C:/Users/Hayyaun/AppData/Local/Temp/tactic-perf-proxy.cjs` exposed WSL port 3100 on Windows loopback port 3101 for browser checks.
- With `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101` and `PLAYWRIGHT_CHANNEL=msedge`, `node node_modules/@playwright/test/cli.js test tests/scene.spec.ts tests/rim-animation.spec.ts -g 'shader adapter|loading preview|WebGL restores|unsupported WebGL|one loaded backdrop|reduced motion keeps'` passed seven production-compatible checks. The initial unrestricted run expected disabled production debug controls and was interrupted; it was not a scene failure.
- `node C:/Users/Hayyaun/AppData/Local/Temp/tactic-perf-verify.cjs` checked desktop/mobile pages and selected image URLs, captured screenshots, and found no page errors. Screenshots were reviewed. Existing geometry, colors, animation defaults, and interaction behavior remain unchanged.
- `git diff --check` checks patch whitespace. Only local source/documentation changed; no deployment, DNS, provider settings, or emails were triggered. A fresh deployed PageSpeed run is still needed to quantify the result; remaining rendering stalls are not claimed resolved.

Final verification: the rebuilt desktop page selected width 828 for an approximately 820px image; its optimized response was 25,526 bytes versus the original 167,506 bytes (about 85% smaller). Mobile selected width 640; both pages had no JavaScript errors. The refined-size build and lint passed. Temporary production servers and the loopback proxy were stopped with Ctrl+C; the user's existing development server was preserved.
