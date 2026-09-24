# OAK Partner Convening 2026

Next.js application for registration, Partner QR passes, daily check-in, attendance, programme, private notes and administrator management. The unified implementation uses the relational Supabase backend from the remote branches.

## Setup

1. Install Node.js 24 (minimum 22) and run `npm ci`.
2. Copy `.env.example` to `.env.local` and configure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Keep service keys and database credentials server-only and out of source control. Existing `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SECRET_KEY` aliases are supported.
3. Set `SUPABASE_DB_URL` (or `DATABASE_URL`) to the PostgreSQL connection string and run `npm run db:migrate -- --apply`. Alternatively execute **supabase/migrations/003_unified_backend.sql** in Supabase SQL Editor. `supabase/schema.sql` contains the same complete, idempotent migration; use either one. Run `npm run db:migrate -- --check` to inspect readiness.
4. If no master administrator exists, set `OAK_ADMIN_PASSWORD` in your shell, run `npm run admin:create -- --username your-admin-name`, then clear the password environment variable. Passwords require at least 12 characters and at most 72 UTF-8 bytes. Existing administrators keep their passwords.
5. Run `npm run dev`, or `npm run build` and `npm start` for production. Production requires HTTPS for secure session cookies.

On Windows, use `npm.cmd` if PowerShell blocks the npm script wrapper.

## Migration and existing data

Apply the migration before deploying this application. It is transactional: an error rolls back its changes. It retains relational records and moves legacy JSON tables into the private `oak_legacy` schema before converting supported records. Unmapped legacy notes remain archived. Duplicate normalized participant emails stop migration for review; records are never automatically deleted to resolve conflicts. Take a normal database backup before a production rollout.

The migration adds database-backed sessions, credential versions, rate limits, consent fields, private admin notes, daily attendance reporting and atomic registration. Historical consent is preserved where recorded; missing consent is not fabricated. Existing browser cookies must sign in again. Participants without recovery codes need an administrator to verify their identity and issue a replacement through My Account. Old registration IDs alone no longer grant access.

`supabase/seed.sql` is optional illustrative partner/programme content. Review it before explicitly applying it; migrations never insert sample event content automatically. Data stored only in the original local `.data` directory or backup files is preserved outside the new application and is not automatically imported into Supabase.

## Access and event operations

| User | Access |
| --- | --- |
| Partner | Personal entry QR pass and partner directory |
| OAK Staff, Presenter, Observer | Programme, private notes, resources and partner directory |
| Coordination Team | Programme, private notes, resources, partners, check-in and attendance |
| Administrator | Staff tools, account settings and participant recovery |
| Master administrator | Administrator access plus administrator creation, removal and password reset |

OAK Staff and Coordination Team registration require `STAFF_ACCESS_CODE`; there is no fallback code. Each participant receives a private recovery code, shown once in the registration receipt with a download option. Entry QR codes are issued only to Partners. Sessions expire after 8 hours for administrators and 14 days for participants. Logout, password changes and recovery replacement revoke the affected sessions. Only token hashes are stored.

Check-in uses the Africa/Harare calendar date and is idempotent per participant per day. Repeat scans preserve the first timestamp. Attendance is paginated, with date, name, organization, role and status filters; daily totals use all registered participants as their denominator. The camera requires HTTPS or localhost and browser permission; manual code entry is available.

## Email and resources

Set `RESEND_API_KEY` and `EMAIL_FROM` to enable confirmation emails from a verified sender. Partner emails include a QR attachment. Registration still succeeds when email is unavailable and prompts the participant to save their recovery details.

Upload event documents to the private `event-resources` Supabase Storage bucket. Add records to `public.resources` with `id`, `name` and `storage_path`. Authorized programme users receive signed links valid for 60 seconds. Empty paths appear unavailable. The migration keeps this bucket private.

## Verification

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- `npm run test:integration` (requires a completed production build)

Database tests execute the production SQL in embedded PostgreSQL. Integration tests run the production Next.js server against that database through a local PostgREST test adapter, with synthetic users and no live emails or database writes. They cover all roles, forged cookies, registration validation, concurrent check-ins, private notes, recovery, session revocation and rate limits. Reports are written to ignored `test-results/`. GitHub Actions runs lint, tests, build and HTTP integration checks on pushes and pull requests.

These checks do not establish hosted capacity, real email delivery, phone-camera compatibility or deployed Supabase configuration. See `VERIFICATION.md` for the branch comparison and measured results.

## SEO and recurring audits

Set `SITE_URL` to the final public origin (for example, `https://event.example.org`) in production before building. Public home/registration pages share a canonical URL; the privacy page has its own canonical. The sitemap contains only public canonical pages. Private pages inherit `noindex, nofollow`, and APIs send `X-Robots-Tag`. Without a configured origin, and on Vercel preview deployments, public indexing stays disabled. Robots instructions complement authentication; they do not replace it.

The HTTP suite follows 20 routes across anonymous, forged-cookie, participant and administrator identities, exercises competing registrations, and records response-time percentiles at concurrency 10, 25 and 50. These measurements use local embedded PostgreSQL and do not represent hosted Supabase capacity.

For browser and accessibility checks, install Chromium with `npx playwright install chromium`, set `BROWSER_AUDIT=1`, then run `npm run test:integration` after a production build. Windows can use installed Edge by also setting `AUDIT_BROWSER_CHANNEL=msedge`. Synthetic screenshots and accessibility findings are saved under `test-results/browser/`. CI runs these checks and retains synthetic audit artifacts for seven days. Physical camera scanning and actual email delivery still require their configured services and devices.
