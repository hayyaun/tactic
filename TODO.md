# TACTIC launch checklist

Legend: 🟢 Codex can complete independently · 🟡 Codex implements; needs your setup, decisions, or access · 🔵 Needs your action · 🔴 Finish after assets and data arrive.
Checkboxes track completion; colors indicate responsibility and dependencies, not completed work.

## Content & pages

- [ ] 🔴 Finalize homepage copy, audience, and service offers.
- [ ] 🟢 Build reusable page layouts and define content fields for the asset handoff.
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
- [ ] 🟡 Set production metadataBase and canonical URL templates.
- [ ] 🔴 Add final Open Graph/Twitter metadata and sharing images.
- [ ] 🟢 Add robots.txt.
- [ ] 🟢 Generate XML sitemap with published pages.
- [ ] 🟢 Add blog RSS feed.
- [ ] 🟢 Prepare JSON-LD templates; populate with final data when available.
- [ ] 🔴 Review headings, alt text, internal links, and URL structure.
- [ ] 🔵 Google Search Console: verify domain and submit sitemap after deployment.
- [ ] 🟢 Prevent indexing of drafts and preview deployments.
- [ ] 🟢 Add redirects when existing URLs change.

## Contact & enquiries

- [ ] 🟡 Next.js Server Actions + Resend: implement enquiry delivery to your inbox.
- [ ] 🔵 Resend: create an account and verify the sending domain.
- [ ] 🟢 Server-side validation: validate and limit submitted fields.
- [ ] 🟢 Spam protection: add a honeypot and server-side rate limiting.
- [ ] 🟢 Add sending, success, error, and retry states.
- [ ] 🟡 Add a visible backup email address once supplied.
- [ ] 🔵 Email provider: choose the receiving inbox and configure branded email.
- [ ] 🔵 DNS: configure SPF, DKIM, and DMARC as appropriate.
- [ ] 🟡 Test delivery, reply-to behavior, and failure handling after account setup.
- [ ] 🔵 Spreadsheet or CRM: track enquiries and follow-ups.

## Analytics & monitoring

- [ ] 🔵 Plausible or Google Analytics 4: choose one and create the site/property.
- [ ] 🟡 Install the chosen analytics integration.
- [ ] 🟡 Track successful enquiries and important CTA interactions.
- [ ] 🟡 Exclude your own/test traffic where practical.
- [ ] 🔵 Use UTM links for campaigns.
- [ ] 🔵 Sentry: create a project and choose alert recipients.
- [ ] 🟡 Integrate Sentry error tracking and configure alerts.
- [ ] 🟡 Filter personal information from analytics and error reports.
- [ ] 🔵 Uptime monitor: configure downtime alerts.
- [ ] 🔵 Optional: Microsoft Clarity account for heatmaps and recordings.
- [ ] 🟡 Optional: integrate Microsoft Clarity with masking and consent support.

## Accessibility & performance

- [ ] 🔴 Check mobile, tablet, and desktop layouts with final content.
- [ ] 🔴 Check major browsers and real phones.
- [ ] 🟢 Verify keyboard navigation, focus, dialogs, and form labels.
- [ ] 🟢 Check contrast, text readability, and reduced motion.
- [ ] 🔴 Optimize final images, fonts, videos, and JavaScript.
- [ ] 🔴 Lighthouse/PageSpeed Insights: check final performance and accessibility.
- [ ] 🔵 Monitor Core Web Vitals after launch.
- [ ] 🟢 Verify 3D loading, fallback, recovery, and mobile performance.
- [ ] 🔴 Check final links and browser-console errors.

## Reliability, security & privacy

- [ ] 🟢 Add useful 404, error, and loading states.
- [ ] 🟢 Keep secrets server-side.
- [ ] 🟢 Review dependencies for security issues.
- [ ] 🟢 Review security headers.
- [ ] 🔵 Supply or approve a privacy notice matching actual data collection.
- [ ] 🟡 Publish the approved privacy notice.
- [ ] 🔵 Decide applicable tracking consent and data-collection settings.
- [ ] 🟡 Configure consent controls and recording masking.
- [ ] 🔵 Define enquiry-data retention and deletion.
- [ ] 🟢 Restrict production/debug controls as appropriate.

## Deployment & verification

- [ ] 🔵 Vercel or compatible hosting: choose provider and connect the Git repository.
- [ ] 🟡 Prepare production deployment configuration.
- [ ] 🔵 Connect domain, DNS, and HTTPS.
- [ ] 🔵 Choose a primary domain.
- [ ] 🟡 Configure redirects for alternate domains.
- [ ] 🔵 Configure production and preview environment variables and secrets.
- [ ] 🟡 Verify support for your installed Next.js features.
- [ ] 🟢 GitHub Actions: maintain automated deployment checks.
- [ ] 🔴 Run lint, formatting, build, and Playwright tests with final content.
- [ ] 🟢 Extend tests to cover new pages and actual form submission.
- [ ] 🔴 Test the deployed site's forms, metadata, sitemap, robots, and RSS.
- [ ] 🟡 Verify analytics, Sentry, and uptime alerts after account setup and deployment.
- [ ] 🟢 Document rollback and content-backup procedures.
- [ ] 🔵 Confirm access to rollback and backup tools.

## Audience & ongoing work

- [ ] 🔴 Publish initial case studies and useful articles.
- [ ] 🔵 Update social profiles and announce launch.
- [ ] 🔵 Start targeted outreach and referral partnerships.
- [ ] 🔵 Review traffic, enquiries, errors, and search visibility regularly.
- [ ] 🔵 Schedule content updates and dependency maintenance.
- [ ] 🔵 Optional later: Sanity CMS, newsletter, and booking integration.

Existing foundations: basic metadata, GitHub Actions, Playwright tests, and 3D fallbacks. Extend and verify these rather than rebuilding them.
