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

## Hero blocking follow-up — 2026-10-11

The follow-up PageSpeed report still scored 60, with 30,550ms TBT and 33.5 seconds of main-thread work. The image warning disappeared; CSS offered only 50ms savings. The first warmup did not resolve the dominant rendering work.

### Result and rendering behavior

- Check WebGL2 with `failIfMajorPerformanceCaveat` before importing Three. Known software renderers (SwiftShader, llvmpipe, softpipe, lavapipe, software rasterizer) keep the existing static preview. This is a device-capability decision for every visitor, without user-agent or audit detection. If renderer information is unavailable, existing frame-rate adaptation remains the fallback.
- Hardware rendering uses the original 256-resolution studio lighting, prepared offline as a 768×1024 cubeUV half-float atlas. Lossless spatial/channel prediction and gzip reduce its download to 383,057 bytes. The loader validates its dimensions, encoding, and Three revision; loading/decoding failures use the preview. Each canvas owns its GPU texture, while cached CPU pixels survive context restoration.
- Warm the main shader programs and r186's linear-target, BackSide, untone-mapped glass-pass variants before drawing. Temporary renderer/material state is restored synchronously before awaiting completion. Production skips shader diagnostic queries; development diagnostics and shader-adapter anchor validation remain enabled.
- Shimmer keeps its 7.5-second sweep but repeats every 15 seconds. It sleeps with a timeout during the quiet period and stops when offscreen or hidden. Reduced motion stays static.

### Measurements and limits

The earlier `--enable-unsafe-swiftshader` launch still selected Intel UHD 620 hardware. Forced software rendering also requires `--use-angle=swiftshader`.

Sequential 20-second local production profiles used the same desktop viewport, JavaScript sampler, WebGL timing probe, and long-task observer. Summing each observed task's excess above 50ms gave 7,260ms before and 1,100ms after on forced SwiftShader (about 85% less). Software visits downloaded no hero 3D bundle/model/environment and issued no scene draw calls. Intel hardware profiles gave 1,533ms before and 390ms after (about 75% less); the longest task fell from 817ms to 192ms. These are local observer measurements, not Lighthouse TBT or a predicted PageSpeed score. Probe/context creation and some texture-upload work still remain. Hardware and network differences can change results.

Desktop 1440×1000 and mobile 390×844 reduced-motion captures before/after prepared lighting and final shader warmup had zero changed pixels. All 11 final browser checks passed in 53.2 seconds: loading preview, software/unsupported/caveat fallback, environment failure, context restoration idle/offscreen, mobile/desktop backdrop dimensions, reduced motion, shader anchors, and default shimmer quiet periods. A final production build and lint passed. Deployment and a fresh public PageSpeed run remain unverified.

### Commands and state changes

Commands below ran from the repository; `node` denotes the bundled Windows runtime at `C:/Users/Hayyaun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe` for browser/bake scripts. Linux npm commands used `wsl -d Ubuntu --cd /home/garfield/projects/tactic`.

```powershell
wsl -d Ubuntu --cd /home/garfield/projects/tactic git status --short
Get-Content package.json, next.config.ts, AGENTS.md
Get-Content app/components/hero-canvas.tsx
Get-Content app/components/hero-art.tsx, app/components/hero-performance.ts, app/components/hero-settings.ts
rg --files tests scripts docs
rg --files node_modules/next/dist/docs | rg 'lazy-loading|production-checklist|server-and-client|caching|cache-components'
Get-Content node_modules/next/dist/docs/01-app/02-guides/lazy-loading.md
Get-Content node_modules/next/dist/docs/01-app/02-guides/production-checklist.md
Get-Content playwright.config.ts
Get-Content tests/scene.spec.ts
Get-Content tests/rim-animation.spec.ts
Get-Content app/components/hero-debug-gate.tsx
Get-Content app/components/hero-webgl.ts
Get-Content app/components/hero-shader-warmup.ts
Get-Content app/components/studio-environment.ts
Get-Content eslint.config.mjs
Get-Content scripts/bake-studio-environment.mjs
Get-Content public/studio/studio-environment-r186.json
Get-Content docs/launch-operations.md
Get-Content TODO.md
rg -n 'compileAsync|KHR_parallel_shader_compile|renderTransmissionPass' node_modules/three/src/renderers/WebGLRenderer.js
Get-Content node_modules/three/src/renderers/WebGLRenderer.js
Get-Content node_modules/three/src/renderers/webgl/WebGLPrograms.js
Get-Content node_modules/three/src/renderers/webgl/WebGLProgram.js
Get-Content node_modules/three/src/extras/PMREMGenerator.js
Get-Content node_modules/three/src/renderers/webgl/WebGLEnvironments.js
Get-Content node_modules/three/src/textures/DataTexture.js
rg -n 'StudioEnvironment|failIfMajor|wake =|checkShader' app/components/hero-canvas.tsx app/components/hero-webgl.ts
Get-Command npm.cmd -ErrorAction SilentlyContinue | Select-Object Source
wsl -d Ubuntu --cd /home/garfield/projects/tactic git diff --stat
wsl -d Ubuntu --cd /home/garfield/projects/tactic git diff -- app/components/hero-canvas.tsx app/components/studio-environment.ts app/components/hero-art.tsx app/components/hero-webgl.ts
```

Read-only inspection checked installed Next/Fiber/Three guidance, dependencies, renderer internals, and tests. Some reads selected relevant line windows with `Select-Object -Skip/-First/-Last`; `rg` located matching definitions. Initial guesses for `tests/helpers.ts`, `tests/scene-probe.ts`, and obsolete Three source filenames were absent; correct files were subsequently located. No Windows `npm.cmd` was available. Official Fiber introduction/installation/scaling and Three renderer/PMREM/DataTexture documentation were also read.

```powershell
node C:/Users/Hayyaun/AppData/Local/Temp/tactic-gpu-admission.cjs
wsl -d Ubuntu --cd /home/garfield/projects/tactic npm run start -- --port 3100
node C:/Users/Hayyaun/AppData/Local/Temp/tactic-perf-proxy.cjs
node C:/Users/Hayyaun/AppData/Local/Temp/tactic-profile.cjs http://127.0.0.1:3101
node C:/Users/Hayyaun/AppData/Local/Temp/tactic-profile-software.cjs http://127.0.0.1:3101
node C:/Users/Hayyaun/AppData/Local/Temp/tactic-perf-verify.cjs
Copy-Item -LiteralPath $env:TEMP/tactic-perf-1440.png -Destination $env:TEMP/tactic-perf-before-1440.png
Copy-Item -LiteralPath $env:TEMP/tactic-perf-390.png -Destination $env:TEMP/tactic-perf-before-390.png
node scripts/bake-studio-environment.mjs
node --check scripts/bake-studio-environment.mjs
node node_modules/prettier/bin/prettier.cjs scripts/bake-studio-environment.mjs --write
wsl -d Ubuntu --cd /home/garfield/projects/tactic npx prettier --write app/components/hero-webgl.ts app/components/hero-art.tsx app/components/hero-settings.ts app/components/hero-canvas.tsx app/components/studio-environment.ts
wsl -d Ubuntu --cd /home/garfield/projects/tactic npx prettier --write app/components/hero-shader-warmup.ts
wsl -d Ubuntu --cd /home/garfield/projects/tactic npx prettier --write TODO.md docs/launch-operations.md
wsl -d Ubuntu --cd /home/garfield/projects/tactic node node_modules/prettier/bin/prettier.cjs --write tests/scene.spec.ts tests/rim-animation.spec.ts
wsl -d Ubuntu --cd /home/garfield/projects/tactic node node_modules/eslint/bin/eslint.js tests/scene.spec.ts tests/rim-animation.spec.ts
wsl -d Ubuntu --cd /home/garfield/projects/tactic npm run lint
wsl -d Ubuntu --cd /home/garfield/projects/tactic npm run build
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:3101'
$env:PLAYWRIGHT_CHANNEL = 'msedge'
node node_modules/@playwright/test/cli.js test tests/scene.spec.ts tests/rim-animation.spec.ts -g 'shader adapter|loading preview|WebGL restores|unsupported WebGL|software WebGL|major WebGL|studio environment|one loaded backdrop|reduced motion keeps|default rim'
wsl -d Ubuntu --cd /home/garfield/projects/tactic git diff --check
```

The profiling script was copied to a temporary software version by replacing its launch flags with `--use-angle=swiftshader --enable-unsafe-swiftshader` via `Get-Content -Raw`, `.Replace`, and `Set-Content`. Temporary Node comparison snippets measured compression alternatives; only the final 256-resolution lossless atlas is included. The first bake's favicon 404, initial CommonJS lint errors, and test mock's TypeScript overload error were corrected before final validation. The first all-main-program warmup still left a transmission query stall; the final variant warmup removed it in the local profile.

State changes: `apply_patch` edited local components, tests, TODO, and these notes; Prettier formatted them; the bake wrote local lighting assets; builds regenerated `.next`. Temporary production servers, test browser processes, and a loopback proxy were launched for validation and stopped afterward. No dependencies were upgraded, and no live deployment, provider settings, DNS, email, or environment secrets were changed.

## Compact privacy control (2026-10-11)

The consent panel now starts collapsed behind a small shield-and-label Privacy button at the bottom left. The panel opens on request and closes with its close button or Escape, restoring focus to its opener. Opening or closing it does not grant consent; Clarity still requires an explicit Allow recordings choice. The existing footer privacy settings link and consent withdrawal behavior remain available.

Validation: lint passed; the tracking-enabled QA build passed; all three integration tests passed, including initial collapse, no tracking before consent, keyboard close/focus, consent, and withdrawal. Browser screenshots were inspected at 1440×1000 and 390×844, and viewport bounds plus close/focus were checked at those sizes and 320×667. The normal build was run again after stopping the temporary test servers. The user separately confirmed deployed PageSpeed performance reached 100 before this change; that score was not rerun for this change.

Command recap (PowerShell; repository commands use the WSL directory `/home/garfield/projects/tactic`):

```powershell
wsl -d Ubuntu --cd /home/garfield/projects/tactic git status --short
Get-Content package.json
Get-Content C:/Users/Hayyaun/.codex/skills/tailwind-v4/SKILL.md
Get-Content node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md | Select-Object -First 100
Get-Content app/components/privacy-controls.tsx
Get-Content tests/integrations.spec.ts
Get-Content app/globals.css | Select-Object -First 180
Get-Content next.config.ts | Select-Object -First 90
rg -n 'consent|Consent|Clarity' app/components app/lib tests/integrations.spec.ts
rg -n 'PrivacyControls|privacy-controls' app
Get-Content app/components/dialog.tsx
Get-Content playwright.config.ts
Get-Content docs/launch-operations.md -Tail 65
Get-Content TODO.md -Tail 60
Get-Content C:/Users/Hayyaun/AppData/Local/Temp/tactic-perf-proxy.cjs
wsl -d Ubuntu --cd /home/garfield/projects/tactic npx prettier --write app/components/privacy-controls.tsx tests/integrations.spec.ts
wsl -d Ubuntu --cd /home/garfield/projects/tactic npm run lint
wsl -d Ubuntu --cd /home/garfield/projects/tactic env NEXT_PUBLIC_ENABLE_TRACKING_PREVIEW=true npm run build
wsl -d Ubuntu --cd /home/garfield/projects/tactic npm run start -- --port 3100
& 'C:/Users/Hayyaun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' C:/Users/Hayyaun/AppData/Local/Temp/tactic-perf-proxy.cjs
$env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:3101'
$env:PLAYWRIGHT_CHANNEL='msedge'
& 'C:/Users/Hayyaun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' node_modules/@playwright/test/cli.js test tests/integrations.spec.ts
& 'C:/Users/Hayyaun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe' C:/Users/Hayyaun/AppData/Local/Temp/tactic-privacy-visual.cjs
wsl -d Ubuntu --cd /home/garfield/projects/tactic npm run build
wsl -d Ubuntu --cd /home/garfield/projects/tactic git diff --stat
wsl -d Ubuntu --cd /home/garfield/projects/tactic git diff --check
```

Read-only commands inspected source, configuration, installed guidance, and existing tests; the guessed `app/components/dialog.tsx` path was absent. A temporary Playwright visual script was written with a PowerShell literal here-string piped to `Set-Content -LiteralPath C:/Users/Hayyaun/AppData/Local/Temp/tactic-privacy-visual.cjs`. It intercepted tracking-provider requests, captured collapsed/open views, and checked viewport bounds and focus restoration. `view_image` inspected the screenshots. Official Tailwind documentation was also consulted.

State changes: `apply_patch` edited the privacy component, integration test, TODO, and operations notes; Prettier formatted source/test files; builds regenerated `.next`. The tracking-preview flag applied only to the QA build command; no `.env` or provider setting was changed. The temporary server and loopback proxy were stopped with Ctrl+C before the normal build. No deployment or account setting was changed.

## Default-on Clarity with opt-out (2026-10-11)

At the user's request, this supersedes the opt-in activation described above. Production loads Clarity after browser preferences are checked, unless an unexpired saved rejection or Global Privacy Control prevents it. Rejecting saves the choice for 180 days and reloads to stop the recorder; prior rejections remain valid. Default activation does not assert consent: analytics storage is denied until an explicit Allow recordings choice, and advertising storage remains denied. Microsoft regional restrictions still apply. This change is not a certification of US legal compliance. The compact button remains, and the public privacy notice and provider guide describe the new behavior.

Validation: `npm run lint` and the tracking-enabled QA build passed. Four integration tests passed: default activation without a fabricated granted signal, rejection persistence and re-enabling, Global Privacy Control, privacy/error monitoring checks. Tracking requests were intercepted in browser QA. The updated panel fit 1440×1000, 390×844, and 320×667; mobile screenshots were inspected. The normal build was restored after stopping the temporary test server/proxy.

Commands run (repository command prefix: `wsl -d Ubuntu --cd /home/garfield/projects/tactic`):

- `git status --short`, `git diff --check`: inspect local changes and whitespace; existing compact-button changes preserved.
- `Get-Content app/components/privacy-controls.tsx`, `Get-Content app/privacy/page.tsx`, `Get-Content tests/integrations.spec.ts`, `Get-Content package.json`, `Get-Content next.config.ts`, `Get-Content node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md -TotalCount 65`: inspected implementation, framework config, and installed guidance.
- `rg -n 'until|consent|opt-in|permission|recording' app/privacy docs/provider-setup.md TODO.md`: found outdated behavior descriptions.
- `$taskPath='app/privacy/page.tsx'; Get-Content $taskPath -Tail 20; Get-Content docs/provider-setup.md -TotalCount 60`: inspected related notice and provider instructions.
- `npx prettier --write app/components/privacy-controls.tsx app/privacy/page.tsx tests/integrations.spec.ts`: formatted edits.
- `npm run lint`, `env NEXT_PUBLIC_ENABLE_TRACKING_PREVIEW=true npm run build`: lint and production-mode QA build passed.
- `npm run start -- --port 3100`: started temporary QA server, later stopped with Ctrl+C.
- Windows bundled Node (`C:/Users/Hayyaun/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe`) ran `C:/Users/Hayyaun/AppData/Local/Temp/tactic-perf-proxy.cjs`: temporary loopback proxy, later stopped with Ctrl+C.
- `$env:PLAYWRIGHT_BASE_URL='http://127.0.0.1:3101'; $env:PLAYWRIGHT_CHANNEL='msedge'`; bundled Node ran `node_modules/@playwright/test/cli.js test tests/integrations.spec.ts`: four checks passed.
- Bundled Node ran `C:/Users/Hayyaun/AppData/Local/Temp/tactic-privacy-visual.cjs`: verified three viewport sizes and close/focus behavior.
- `npm run build`: restored normal build with QA override unset.
- `npx prettier --write TODO.md docs/provider-setup.md docs/launch-operations.md`, `git diff --check`: final documentation formatting and whitespace validation.

Tool actions: `apply_patch` changed local privacy behavior, tests, and TODO/provider documentation; this note was appended with a literal PowerShell here-string through `Add-Content -LiteralPath docs/launch-operations.md`. `view_image` inspected browser screenshots. Official Microsoft Consent Mode documentation was read. Builds regenerated `.next`; no `.env`, provider dashboard settings, DNS, dependencies, or deployment was changed.
