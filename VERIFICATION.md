# Integration verification

## Branch selection

The original local main had unrelated Git history and a mixture of the local JSON backend and newer relational code. Remote main included every day commit and one additional commit, so remote main was the integration base. Neither original implementation was safe to ship unchanged.

The comparison found accepted invalid registrations, attendance percentages above 100%, replayable sessions, inactive local route protection, and forged-cookie access on day. The fixed integration replaces those paths with validated inputs, database-backed authorization, revocation and daily SQL reporting. Original local commits and uncommitted files were preserved in the `codex/local-before-integration-20260923` backup branch and the named pre-integration Git stash.

## Automated results

Validated on Windows using a production Next.js build and an isolated embedded PostgreSQL database:

- ESLint and production compilation/type checking passed.
- Security and database tests passed, including repeated migrations, legacy-record preservation, literal search, case-insensitive duplicate email rejection and pagination beyond 1,000 participants.
- 500 invalid registrations at concurrency 25 returned client errors and inserted zero participants.
- All five roles registered with the intended QR policy; 25 role/page authorization checks passed.
- 100 check-in requests at concurrency 25 produced one stored check-in and 99 successful repeat responses with the original timestamp.
- Attendance across three dates counted one person per date, not three check-ins as three people.
- Anonymous and forged-cookie requests were denied on protected pages and APIs.
- Private note isolation, recovery sign-in, logout, admin reset/removal, participant recovery, password changes and session expiry passed.
- Persistent login limits returned 429 after the allowed failed attempts.

The HTTP suite uses a small local PostgREST adapter over actual PostgreSQL; it is not a hosted Supabase load test. Its generated results and server logs live under ignored `test-results/`.

## Rollout checks

Live Supabase was reachable, but its old schema lacked the required session and credential columns when inspected. Apply migration 003 and verify its readiness before deploying. Database migration credentials are intentionally absent from source control.

Live email delivery, physical camera scanning, browser visual checks and hosted infrastructure capacity still require environment-specific verification. No finite automated suite guarantees that all defects have been eliminated.

The repository has Vercel production integrations (`oak-project` and `oak-project-2`). Remote branch synchronization is deferred until the live database migration succeeds, because a push can trigger production deployment. The tested integration can be committed and synchronized locally while the connection string is pending.
