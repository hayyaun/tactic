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
- [ ] 🔵 Google Search Console: verify domain and submit sitemap after deployment.
- [x] 🟢 Prevent indexing of drafts and preview deployments.
- [x] 🟢 Prepare permanent-redirect configuration; no existing URLs changed.
- [ ] 🔴 Add redirect mappings if final content changes existing URLs.

## Contact & enquiries

- [x] 🟡 Next.js Route Handler + Resend: implement gated enquiry sending with idempotent retries; enable after domain/inbox setup.
- [ ] 🔵 Resend: create an account and verify the sending domain.
- [x] 🟢 Server-side validation: validate and limit submitted fields.
- [x] 🟢 Spam protection: implement honeypot and server-side rate limiting.
- [x] 🟡 Support Upstash/Vercel KV variables and verify writable Redis credentials; add them to Vercel before deployment.
- [x] 🟢 Add pending, success, error, and retry states for brief preparation.
- [x] 🟡 Connect and test sending, confirmed-submission, failure, and retry states; public delivery remains disabled.
- [ ] 🟡 Add a visible backup email address once supplied.
- [ ] 🔵 Email provider: choose the receiving inbox and configure branded email.
- [ ] 🔵 DNS: configure SPF, DKIM, and DMARC as appropriate.
- [ ] 🟡 Test delivery, reply-to behavior, and failure handling after account setup.
- [ ] 🔵 Spreadsheet or CRM: track enquiries and follow-ups.

## Analytics & monitoring

- [x] 🔵 Decide visitor analytics: omit GA4/Plausible; keep Clarity with consent.
- [x] 🟡 Leave GA4/Plausible integration disabled, as requested.
- [x] 🟡 Leave visitor/enquiry/CTA analytics events disabled, as requested.
- [x] 🟡 Exclude development and previews from Clarity/Sentry unless explicitly configured for QA.
- [ ] 🔵 Use UTM links for campaigns.
- [x] 🔵 Sentry: create project tactic in organization hayyanhami using the wizard.
- [x] 🟡 Integrate Sentry error tracking; repair local placeholders and verify ingestion.
- [ ] 🔵 Sentry: choose alert recipients and confirm alert rules in the dashboard.
- [x] 🟡 Filter personal information from error reports; disable Sentry replay/tracing and drop logs/metrics.
- [ ] 🔵 Uptime monitor: configure downtime alerts.
- [x] 🔵 Microsoft Clarity: supply project ID yvn7ipejec.
- [x] 🟡 Integrate Microsoft Clarity with form masking, consent, and withdrawal support.
- [ ] 🔵 Microsoft Clarity: review dashboard masking, retention, and access settings.

## Accessibility & performance

- [ ] 🔴 Check mobile, tablet, and desktop layouts with final content.
- [ ] 🔴 Check major browsers and real phones.
- [x] 🟢 Verify keyboard navigation, focus, dialogs, and form labels.
- [x] 🟢 Review current contrast, text readability, and reduced motion; improve the form notice.
- [ ] 🔴 Optimize final images, fonts, videos, and JavaScript.
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
- [ ] 🔵 Connect domain, DNS, and HTTPS.
- [x] 🔵 Choose a primary domain: tacticforyou.com.
- [x] 🟡 Configure and test www.tacticforyou.com redirects to the canonical domain, preserving paths and query strings.
- [ ] 🔵 Configure production and preview environment variables and secrets.
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

Implementation notes: see docs/content-handoff.md, docs/launch-operations.md, and docs/provider-setup.md. Production email sending remains disabled until domain verification and inbox forwarding work. Redis credentials and Resend/Sentry test acceptance are verified; inbox delivery, dashboard alerts, and deployed settings remain user/launch tasks. Development-tool audit findings are recorded in the operations guide.
