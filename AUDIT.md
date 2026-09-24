# Stress, redirect, SEO and accessibility audit

Completed 24 September 2026 against a production Next.js build with synthetic data in embedded PostgreSQL. No live registrations were created, modified or deleted by these tests.

## Results

- 180 route/identity combinations completed without redirect cycles, including anonymous, forged cookies, five participant roles, ordinary administrators and master administrators.
- 500 invalid registrations inserted no records. Another 100 competing valid registrations for one email created exactly one record; the remaining responses were controlled duplicate or rate-limit errors.
- 100 concurrent check-in attempts stored one entry and preserved the first timestamp.
- 600 authenticated reads completed without server errors at concurrency 10, 25 and 50.
- 12 desktop/mobile browser checks passed at 390px and 1440px: registration, staff login, privacy, programme, attendance and QR pass. No page JavaScript errors or axe WCAG A/AA violations remained. Private note editing passed in the browser.
- An additional browser test held attendance responses pending across 31 seconds of virtual time: no overlapping polling requests were issued.
- Eight security/database/SEO unit tests, lint, type checking and production build passed.
- npm audit reported zero known vulnerabilities, including the added browser test dependencies. This is an advisory check, not a guarantee that dependencies have no defects.

| Concurrency | Requests | Requests/second | 95th-percentile latency |
| --- | --- | --- | --- |
| 10 | 200 | 111 | 118 ms |
| 25 | 200 | 89 | 400 ms |
| 50 | 200 | 76 | 704 ms |

These timings measure the local Windows test system and its small synthetic database through a local PostgREST adapter. They do not establish Vercel or hosted Supabase capacity or an event-size service guarantee.

## Fixes from this audit

Attendance now waits for each request to finish before scheduling another and cancels stale requests on filter changes/unmount. Client requests have a 45-second timeout. Malformed Origin headers receive controlled 403 responses instead of service errors. Email validation trims surrounding whitespace. Registration mode changes are disabled during submission.

The QR canvas now has an accessible label. The skip link has a focusable target. Public metadata includes titles, descriptions and social-card text; canonical URLs and a public-only sitemap use SITE_URL. Root and registration share a canonical URL. Private pages default to noindex/nofollow, and APIs send X-Robots-Tag. Preview deployments remain noindex. The approved public origin now defaults to https://oak-project-2.vercel.app. Robots rules are not an authorization mechanism.

## Remaining environment checks

- The user subsequently confirmed https://oak-project-2.vercel.app; canonical links and the sitemap now use it by default. Set SITE_URL to override this when changing domains.
- Local RESEND_API_KEY/EMAIL_FROM and STAFF_ACCESS_CODE are unset. Check Vercel separately; local settings do not prove what is configured there. Actual email delivery and staff invitation setup need verification.
- Read-only live checks found one programme session, one partner and no resource records. Publish the real event content and resource files as required.
- Test a physical phone camera and printed QR pass. Automated browser checks do not verify optical scanning.
- Run any hosted capacity test against an agreed staging environment with representative data and traffic. This audit deliberately did not load-test production.
- Before the new audit changes were pushed, both Vercel integrations and GitHub CI for the previous release reported success.

Detailed synthetic output and screenshots are under ignored test-results/. CI now runs the browser audit and retains synthetic artifacts for seven days.

## Public deployment follow-up

Both Vercel production builds and GitHub CI for c626ef5 succeeded. The individual deployment URLs require Vercel SSO, while the user-confirmed public alias https://oak-project-2.vercel.app is publicly reachable. Read-only checks returned 200 for the home, robots and sitemap, 307 to registration for unauthenticated programme access, 401 for anonymous identity, 403 for attendance and 404 for an unknown path. Email delivery and physical-camera testing remain pending; sender credentials and approved resource files have not been supplied.
