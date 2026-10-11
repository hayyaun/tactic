# Provider setup — 2026-10-10

## Confirmed choices

- Vercel hosting; canonical domain `tacticforyou.com`. Domain purchased, Cloudflare nameservers configured, and Vercel/Resend DNS records added (confirmed by you and the DNS export).
- TACTIC is based in Iran.
- Receiving address: `admin@tacticforyou.com`; Cloudflare forwarding to Outlook configured and Resend Receiving disabled (confirmed by you on 2026-10-11). A forwarding delivery test is still pending.
- Resend test recipient: `hayyanhami@outlook.com`.
- No GA4 or Plausible. Microsoft Clarity now defaults on with a saved opt-out, project `yvn7ipejec` (requested 2026-10-11).
- Sentry organization `hayyanhami`, project `tactic`.

## Email: what you do

1. Domain purchased; Cloudflare DNS and Vercel records added.
2. Enable your registrar's email-forwarding service, or choose an email provider with forwarding.
3. Create the `admin` alias and forward it to your Outlook inbox. Verify the destination if requested.
4. Add the forwarding provider's required MX/TXT records; test an email from another account.
5. Add Resend's verification records for the chosen sending domain. Follow its exact DNS instructions; do not replace receiving MX records with sending records.
6. Set `CONTACT_FROM_EMAIL` to an address on the verified sending domain and `CONTACT_TO_EMAIL=admin@tacticforyou.com`.
7. Set `CONTACT_DELIVERY_ENABLED=true` only after both sender and receiving inbox work. Deploy again so the server-rendered send button and backend agree.

The receiving address does not need to be a paid mailbox if forwarding works. Sending branded replies from Outlook is a separate email-provider feature; forwarding alone does not configure it.

For the pre-domain test we used `onboarding@resend.dev` to your Resend-account email. Resend accepted the test request (HTTP 200), and you confirmed receipt in Outlook. This does not verify branded-domain delivery or forwarding.

## Live domain follow-up — 2026-10-10

Update 2026-10-11: HTTPS checks now return HTTP 200 for the homepage, robots.txt, sitemap.xml, and rss.xml. The www hostname resolves to the apex successfully; the previously observed redirect loop is resolved. Cloudflare forwarding setup and disabling Resend Receiving are user-confirmed. Branded delivery, forwarding receipt, sending-domain verification, and production environment settings remain unconfirmed. Read-only commands: `Get-Content TODO.md`, `git status --short`, and `Invoke-WebRequest -Uri <URL> -NoProxy -TimeoutSec 10` for the five URLs. Only documentation was updated; no emails were sent and no provider settings changed.

- HTTPS responds, but the public site has a redirect loop: `https://tacticforyou.com/` returns HTTP 308 to `https://www.tacticforyou.com/`, which returns HTTP 308 back to the apex. Page, robots, sitemap, RSS, and privacy checks could not complete.
- In Vercel → Settings → Domains, set `tacticforyou.com` to serve Production without a redirect. Keep `www.tacticforyou.com` redirecting to the apex. The application already implements the www-to-apex redirect.
- The supplied DNS export contains Resend sending records and an apex MX pointing to `inbound-smtp.eu-west-1.amazonaws.com`. That receiving record routes incoming mail to Resend; it does not alone forward `admin` to Outlook. Forwarding configuration is not yet confirmed. See [Resend receiving](https://resend.com/docs/dashboard/receiving/introduction).
- If using Cloudflare Email Routing for the inbox, add and verify Outlook as the destination and create the `admin` forwarding rule. Follow Cloudflare's receiving MX instructions instead of keeping competing apex receiving providers; preserve Resend's sending verification records. See [Cloudflare routing setup](https://developers.cloudflare.com/email-service/get-started/route-emails/).
- A read-only Resend domain API check with the local key returned HTTP 401. Check the dashboard for the domain's Verified status and update the local key privately if needed. This response does not establish whether the domain is verified.
- Vercel environment variables and redeployment are awaiting your confirmation. No dashboard settings or DNS records were changed by Codex.

Read-only commands: `Get-Content -LiteralPath 'D:/Downloads/Telegram Desktop/tacticforyou.com.txt'`, `Get-Content TODO.md, scripts/check-providers.mjs, app/lib/enquiry-delivery.ts`, `Get-Content package.json`, `Get-Content next.config.ts | Select-String -Pattern 'redirects|www.tactic|destination' -Context 2,3`, `Get-Content AGENTS.md -TotalCount 20`, and `wsl -d Ubuntu --cd /home/garfield/projects/tactic git status --short` inspected the DNS data and project. `Invoke-WebRequest -Uri <URL> -NoProxy -TimeoutSec 15` checked six public routes; redirect-following failed. `Invoke-WebRequest -Uri <URL> -NoProxy -MaximumRedirection 0 -SkipHttpErrorCheck -TimeoutSec 15` exposed both redirect destinations. A WSL `node -e` command loaded local environment configuration and issued authenticated GET requests to Resend's `/domains` API; only HTTP/domain status was printed, with credentials redacted. The DNS export was treated as data, not instructions.

## Environment variables

Copy the names in `.env.example` to Vercel's project environment settings. Never commit real `.env` files. Public IDs are embedded at build time and need a rebuild after changes.

- Server: `RESEND_API_KEY`, `CONTACT_FROM_EMAIL`, `CONTACT_TO_EMAIL`, `CONTACT_DELIVERY_ENABLED`.
- Server: `KV_REST_API_URL` and **writable** `KV_REST_API_TOKEN`; or the `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` pair. The code supports either pair. It does not use the read-only token or TCP Redis URL.
- Public: `NEXT_PUBLIC_CLARITY_PROJECT_ID`, `NEXT_PUBLIC_SENTRY_DSN`.
- Build: `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`.
- Vercel supplies `VERCEL_ENV` and `NEXT_PUBLIC_VERCEL_ENV`; ensure system environment variables are exposed in the project's settings. Keep local rate-limit, tracking-preview, and scene-debug overrides unset on public production. Sentry is enabled only for Vercel production. Source-map uploads require the build token and a CI/production Vercel build.
- `NEXT_PUBLIC_GA4_DOMAIN` is unused; no Google Analytics or Plausible variables are required.

The Sentry wizard created a valid build token in ignored `.env.sentry-build-plugin`. Placeholder DSN/token entries in `.env` were replaced with the wizard's values, without printing the token. The build token cannot read project settings (HTTP 403); that scope is not required for ingestion. A harmless `setup-verification` event was accepted by Sentry (HTTP 200). Check that event and choose alert recipients in Sentry's dashboard.

## Clarity and privacy

Clarity is off on development/preview deployments unless explicitly enabled for QA. On production it loads by default after browser preferences are checked, unless a saved rejection prevents it. Browser privacy signals do not override this default. Visitors can reject recordings and later enable them again with Allow recordings; advertising storage stays denied. **Reject recordings** saves an opt-out for 180 days, deletes accessible first-party Clarity cookies, and reloads to stop the recorder. Existing rejections remain respected. Default activation sends analytics storage denied; only an explicit **Allow recordings** sends granted, and advertising storage remains denied. Provider region/consent restrictions still apply; this implementation does not certify compliance with US or other laws. The whole contact dialog, including its brief preview, has explicit masking. In Clarity settings, select strict masking and review retention/access settings; dashboard configuration has not been changed by Codex.

Sentry replay, performance tracing, and logs/metrics are disabled or dropped. Request bodies, headers, cookies, URL queries, user information, breadcrumbs, contexts, and error message text are excluded from error events. Enquiry-route events are dropped entirely. Technical stacks remain useful for debugging.

`/privacy` describes the confirmed business and actual integrations without claiming jurisdiction-specific legal certification. It does not promise an unconfirmed fixed enquiry-retention period. Choose and follow a deletion schedule for the receiving mailbox, and review provider terms/retention settings before public launch.

## Verification commands and state changes

Commands ran from `/home/garfield/projects/tactic` through `wsl -d Ubuntu --cd /home/garfield/projects/tactic ...` unless noted:

- `git status --short`, `cat package.json`, `cat next.config.ts`, and PowerShell `Get-Content`/`rg` reads inspected the project, wizard files, installed guides, and components. WSL lacks `rg`, so file searches used Windows `rg`. Environment inspection printed names and populated/valid booleans only.
- `node scripts/check-providers.mjs --check-redis`: wrote an isolated expiring counter; HTTP 200 and writable counter verified. It expires after 60 seconds, and contains no personal data.
- `node scripts/check-providers.mjs --send-email`: **sent the authorized test email** to Outlook; Resend accepted it, HTTP 200.
- `node scripts/check-providers.mjs --check-sentry`: initial placeholder returned 401; repaired build token returned 403 because project-read is unavailable.
- `node -e '…'`: inspected configuration shape and **replaced placeholder local Sentry DSN/token values** with wizard values. No credentials were printed.
- `node scripts/check-providers.mjs --check-sentry-ingestion`: **submitted one harmless setup event**; HTTP 200.
- `npx prettier --write <changed files>` formatted the changed source; `npm run lint` and `npm run build` verify it. Initial checks caught React consent-state issues and obsolete Sentry v11 options; these were corrected.

Local application changes add optional Clarity consent/withdrawal controls, a privacy page, Redis variable aliases, and gated Resend delivery with idempotent retries. Sentry wizard example endpoints return not-found in production. No DNS, Vercel settings, Sentry alert rules, or Clarity dashboard settings were changed. Nothing was deployed or pushed.

### Application checks

- `env SENTRY_AUTH_TOKEN= NEXT_PUBLIC_VERCEL_ENV=preview NEXT_PUBLIC_ENABLE_TRACKING_PREVIEW=true npm run build`: consent QA build passed, using installed Next.js/Sentry types. Initial failures were repaired without dependency upgrades.
- `env SENTRY_AUTH_TOKEN= NEXT_PUBLIC_VERCEL_ENV=preview NEXT_PUBLIC_ENABLE_TRACKING_PREVIEW=true CONTACT_DELIVERY_ENABLED=true npm run build`: separate delivery QA build passed. Email requests were intercepted in the browser test; this build was not deployed.
- `env CONTACT_LOCAL_RATE_LIMIT=true NEXT_PUBLIC_VERCEL_ENV=preview npm run start -- --port 3100`: started a temporary test server. A Windows Node TCP proxy exposed it on loopback port 3101 because Windows-to-WSL localhost forwarding was unavailable. Interrupted runs before that proxy failed on connection errors.
- With `PLAYWRIGHT_BASE_URL=http://127.0.0.1:3101` and `PLAYWRIGHT_CHANNEL=msedge`: `node node_modules/@playwright/test/cli.js test tests/foundations.spec.ts tests/integrations.spec.ts` passed 12 checks; the disabled-delivery check encountered the preceding stress test's exhausted rate bucket. It was moved before that stress test, and its focused rerun passed.
- `node node_modules/@playwright/test/cli.js test tests/foundations.spec.ts -g 'email delivery cannot'`: passed after restarting the test server. An interrupted earlier rerun hit a server-restart connection reset.
- With `CONTACT_DELIVERY_ENABLED=true`: `node node_modules/@playwright/test/cli.js test tests/foundations.spec.ts tests/enquiry-send.spec.ts -g 'public SEO|sending retries'`: both passed, verifying retry idempotency, truthful success/failure states, and the 308 canonical-domain redirect with preserved query strings. No email was sent by these browser tests.
- `env CONTACT_DELIVERY_ENABLED=true NEXT_PUBLIC_VERCEL_ENV=preview npm run start -- --port 3100` plus a Node fetch of `intent=prepare`: the actual application returned HTTP 200 using live Redis credentials with no local-rate override. This updates only the expiring global counter; no email is sent.
- Windows `node <temporary directory>/verify.cjs`: inspected consent and privacy pages at 390×844 and 1440×1000, with Clarity requests intercepted. Both had no horizontal overflow. Screenshots were visually reviewed.
- `git check-ignore .env .env.sentry-build-plugin`: confirmed both real environment files are ignored. Only the credential-free `.env.example` is eligible for version control.
- `npm audit --omit=dev --audit-level=high`: zero production vulnerabilities after the Sentry wizard installation.

The 14 relevant checks passed across the main and focused runs. Sender-domain delivery, reply-to in a real inbox, alert rules, Clarity dashboard configuration, and deployed end-to-end verification remain pending. The default build is restored with delivery/recording-preview overrides unset before handing back the project.

Final `npm run lint`, `npm run format:check`, `npm run build`, and `git diff --check` passed. Temporary test servers and the loopback proxy were stopped with Ctrl+C; the existing development server was preserved. `.env.example` was queued to open in Codex for the remaining Vercel setup.
