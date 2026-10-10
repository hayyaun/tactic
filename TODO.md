# TACTIC launch checklist

Legend: 🟢 Codex can complete independently · 🟡 Codex implements; needs your setup, decisions, or access · 🔵 Needs your action · 🔴 Finish after assets and data arrive.
Checkboxes track completion; colors indicate responsibility and dependencies, not completed work.

## Content & pages

- [ ] 🔴 Finalize homepage copy, audience, and service offers.
- [x] 🟢 Build reusable page layouts and define content fields for the asset handoff.
- [ ] 🔴 Create services listing and individual service pages.
- [ ] 🔴 Create portfolio listing and individual case studies.
- [ ] 🔴 Create about and contact pages.
- [ ] 🔴 Create blog listing and individual articles.
- [ ] 🔴 Clearly label concept projects.
- [ ] 🔵 Confirm permissions for images, fonts, and content.
- [ ] 🔴 Apply service card images in the first section after the hero.
- [ ] 🔴 Update navigation, footer, and calls to action.

## SEO & sharing

- [ ] 🔴 Add unique page titles and meta descriptions.
- [x] 🟡 Set production metadataBase and canonical URL templates for tacticforyou.com.
- [ ] 🔴 Add final Open Graph/Twitter metadata and sharing images.
- [x] 🟢 Add robots.txt.
- [x] 🟢 Generate XML sitemap with published pages.
- [x] 🟢 Add blog RSS feed.
- [x] 🟢 Prepare JSON-LD templates; populate with final data when available.
- [ ] 🔴 Review headings, alt text, internal links, and URL structure.
- [x] 🔵 Google Search Console: verify domain, submit sitemap, and complete homepage inspection/indexing steps (confirmed by you).
- [x] 🟢 Prevent indexing of drafts and preview deployments.
- [x] 🟢 Prepare permanent-redirect configuration; no existing URLs changed.
- [ ] 🔴 Add redirect mappings if final content changes existing URLs.

## Contact & enquiries

- [x] 🟡 Next.js Route Handler + Resend: implement gated enquiry sending with idempotent retries; enabled after domain/inbox setup (confirmed by you).
- [x] 🔵 Resend: create an account and add the supplied DNS records (confirmed by you and the DNS export).
- [x] 🔵 Resend: confirm the sending domain shows Verified in the dashboard (confirmed by you).
- [x] 🟢 Server-side validation: validate and limit submitted fields.
- [x] 🟢 Spam protection: implement honeypot and server-side rate limiting.
- [x] 🟡 Support Upstash/Vercel KV variables and verify writable Redis credentials; Vercel environment setup and redeployment confirmed by you.
- [x] 🟢 Add pending, success, error, and retry states for brief preparation.
- [x] 🟡 Connect and test sending, confirmed-submission, failure, and retry states; sending enabled and contact-form issue resolved (confirmed by you).
- [ ] 🟡 Add a visible backup email address once supplied.
- [x] 🔵 Configure Cloudflare forwarding to Outlook, disable Resend Receiving, and confirm forwarding reaches Outlook (confirmed by you).
- [ ] 🔵 DNS: configure SPF, DKIM, and DMARC as appropriate.
- [x] 🟡 Test contact-form sending after account setup; issue resolved (confirmed by you).
- [ ] 🟡 Confirm a real enquiry's Reply action addresses the visitor; failure/retry handling already passed local checks.
- [x] 🟡 Confirm the pre-domain Resend test reached Outlook (confirmed by you).
- [ ] 🔵 Spreadsheet or CRM: track enquiries and follow-ups.

## Analytics & monitoring

- [x] 🔵 Decide visitor analytics: omit GA4/Plausible; keep Clarity with consent.
- [x] 🟡 Leave GA4/Plausible integration disabled, as requested.
- [x] 🟡 Leave visitor/enquiry/CTA analytics events disabled, as requested.
- [x] 🟡 Exclude development and previews from Clarity/Sentry unless explicitly configured for QA.
- [ ] 🔵 Use UTM links for campaigns.
- [x] 🔵 Sentry: create project tactic in organization hayyanhami using the wizard.
- [x] 🟡 Integrate Sentry error tracking; repair local placeholders and verify ingestion.
- [x] 🔵 Sentry: enable email alert rules in the dashboard (confirmed by you).
- [ ] 🟡 Verify Sentry alert delivery with a test notification or controlled event.
- [x] 🟡 Filter personal information from error reports; disable Sentry replay/tracing and drop logs/metrics.
- [ ] 🔵 Uptime monitor: configure downtime alerts.
- [x] 🔵 Microsoft Clarity: supply project ID yvn7ipejec.
- [x] 🟡 Integrate Microsoft Clarity with form masking, consent, and withdrawal support.
- [x] 🔵 Microsoft Clarity: select strict masking and review dashboard access (confirmed by you).
- [ ] 🔵 Microsoft Clarity: review provider retention settings/policy.

## Accessibility & performance

- [ ] 🔴 Check mobile, tablet, and desktop layouts with final content.
- [ ] 🔴 Check major browsers and real phones.
- [x] 🟢 Verify keyboard navigation, focus, dialogs, and form labels.
- [x] 🟢 Review current contrast, text readability, and reduced motion; improve the form notice.
- [ ] 🔴 Optimize final images, fonts, videos, and JavaScript.
- [x] 🟢 Profile the current hero, add asynchronous shader warmup, and serve responsive preview images; production-compatible scene checks passed.
- [ ] 🔴 Lighthouse/PageSpeed Insights: check final performance and accessibility.
- [ ] 🔵 Monitor Core Web Vitals after launch.
- [x] 🟢 Verify 3D loading, fallback, recovery, and idle behavior in desktop/mobile browser emulation; real-phone checks remain below final-asset tasks.
- [ ] 🔴 Check final links and browser-console errors.

## Reliability, security & privacy

- [x] 🟢 Add useful 404, error, and loading states.
- [x] 🟢 Keep secrets server-side.
- [x] 🟢 Review dependencies for security issues.
- [x] 🟢 Review security headers.
- [x] 🔵 Supply business facts: TACTIC, based in Iran; authorize privacy implementation.
- [x] 🟡 Add /privacy with confirmed business facts and actual provider/consent behavior; review mailbox retention before launch.
- [x] 🔵 Choose consent-controlled Clarity and omit GA4/Plausible.
- [x] 🟡 Configure consent controls, withdrawal, and form/brief recording masking.
- [ ] 🔵 Define enquiry-data retention and deletion.
- [x] 🟢 Restrict production/debug controls as appropriate.

## Deployment & verification

- [x] 🔵 Vercel: choose provider and connect the project (confirmed by you).
- [x] 🟡 Prepare Vercel production configuration and an environment-variable template.
- [x] 🔵 Buy tacticforyou.com, move DNS to Cloudflare, and add Vercel domain records (confirmed by you and the DNS export).
- [x] 🟡 Verify public HTTPS and resolve the live redirect loop: apex serves HTTP 200 and www resolves to the apex (verified 2026-10-11).
- [x] 🔵 Choose a primary domain: tacticforyou.com.
- [x] 🟡 Configure and locally test www.tacticforyou.com redirects to the canonical domain, preserving paths and query strings; live www-to-apex routing also verified 2026-10-11.
- [x] 🔵 Configure production environment variables and secrets, enable contact delivery, and redeploy (confirmed by you).
- [ ] 🔵 Review preview environment variables and secrets separately.
- [x] 🟡 Verify installed Next.js features and Sentry compile together locally; deployed smoke checks remain below.
- [x] 🟢 GitHub Actions: maintain automated deployment checks.
- [ ] 🔴 Run lint, formatting, build, and Playwright tests with final content.
- [x] 🟢 Extend tests for unpublished routes, content templates, and real brief-preparation requests; email delivery tests remain dependent on Resend.
- [ ] 🔴 Test the deployed site's forms, metadata, sitemap, robots, and RSS.
- [ ] 🟡 Verify analytics, Sentry, and uptime alerts after account setup and deployment.
- [x] 🟢 Document rollback and content-backup procedures.
- [ ] 🔵 Confirm access to rollback and backup tools.

## Audience & ongoing work

- [ ] 🔴 Publish initial case studies and useful articles.
- [ ] 🔵 Update social profiles and announce launch.
- [ ] 🔵 Start targeted outreach and referral partnerships.
- [ ] 🔵 Review traffic, enquiries, errors, and search visibility regularly.
- [ ] 🔵 Schedule content updates and dependency maintenance.
- [ ] 🔵 Optional later: Sanity CMS, newsletter, and booking integration.

Existing foundations: basic metadata, GitHub Actions, Playwright tests, and 3D fallbacks. Extend and verify these rather than rebuilding them.

Implementation notes: see docs/content-handoff.md, docs/launch-operations.md, and docs/provider-setup.md. Updated 2026-10-11 with your confirmations: Resend domain verified, Cloudflare forwarding received in Outlook, production variables added and redeployed, delivery enabled, contact-form issue fixed, Search Console setup completed, and Sentry alerts enabled. Real-inbox reply-to and Sentry alert delivery remain unconfirmed. Redis credentials and Resend/Sentry test acceptance were verified earlier. The redirect loop was resolved and the homepage, robots.txt, sitemap.xml, and rss.xml returned HTTP 200; this does not complete final SEO or form validation. Development-tool audit findings are recorded in the operations guide.
