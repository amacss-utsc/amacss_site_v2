# Backend maintenance

Team content is maintained in `src/data/team.ts`, with photos in
`public/static/images/team/`. The former Payload team collections are no longer
registered in the current code, so their admin screens and collection APIs will
be unavailable after deployment. Historical schema migrations are retained.

On October 31, 2026, historical Supabase cleanup removed two teams, 15 subteams,
88 member records, and 78 unshared photos (78,386,011 bytes). The live site still
uses Payload for the current 2026 roster, so its 36 members, subteams, types, and
photos were retained until the local team page is deployed. Media referenced by
events, registrations, rich text, resource links, or the live page was preserved.

`node --env-file=.env scripts/cleanup-team-history.mjs` audits historical data
without changes (Node 20.12+). Add `--apply` to perform the audited cleanup. The
script preserves the current team and verifies all local roster photos, scans
foreign keys and embedded media references, and saves deleted-row metadata under
`/tmp/amacss-team-cleanup-<timestamp>/` before writes. Storage deletions are permanent;
the metadata backup does not contain the image files.

If storage deletion fails after database cleanup, resume from that saved manifest:

```sh
node --env-file=.env scripts/cleanup-team-history.mjs --resume '/tmp/amacss-team-cleanup-<timestamp>/plan.json'
node --env-file=.env scripts/cleanup-team-history.mjs --resume '/tmp/amacss-team-cleanup-<timestamp>/plan.json' --apply
```

The first command audits without changes. Resume does not depend on deleted team
rows. It verifies the project and bucket, refuses files that now have media records
or content references, and checkpoints successful batches in `storage-progress.json`.
Retries skip completed batches; repeating a deletion after a lost response is safe.

Public events (including sidebar, calendar, and detail queries), resources, and
their tags use a 24-hour Next.js data cache. Cache keys include pagination and
filters. Payload creates, edits, and deletes invalidate the relevant tags; event
tag, ribbon, and media changes also invalidate cached events. Empty results are
cached, while failed database queries are thrown so outages do not replace valid
cached content. Time-sensitive pin visibility is calculated after reading cached
events. Account and registration reads are never stored in this shared cache.

Browser auth initializes from `onAuthStateChange`'s `INITIAL_SESSION` instead of
making an additional `getUser` call. Middleware skips anonymous visitors and
Payload/admin/API routes. For frontend requests with this project's session
cookie it calls `getClaims` to verify and refresh tokens; asymmetric signing keys
allow local JWT verification with cached public keys. Protected pages and API
handlers keep their server-side `getUser` checks.

The public leaderboard uses a 24-hour Next.js data cache. Refresh is triggered
by a request after the cache becomes stale, rather than by a fixed daily timer.
A signed-in member's own points and rank are still read live.

Past-event unpinning runs through `GET /apiv2/events/unpin-past`, scheduled in
`vercel.json` for once daily at 10:00 UTC (06:00 Toronto during daylight time,
05:00 during standard time). Set `CRON_SECRET` in the Vercel production
environment before deploying. Vercel supplies it in the Authorization bearer
header. Missing or incorrect credentials receive HTTP 401 before database access.
The schedule takes effect after deployment; other hosting providers need an
equivalent daily authenticated request.

The cleanup clears only events marked `PINNED` that ended before today's Toronto
calendar day. Both `date` and optional `endDate` must be before that day's midnight;
ongoing and current-day events stay pinned. The cutoff accounts for daylight saving
changes. The display helper and Past badge use the same end-day rule. Repeating
the job is safe because cleaned events no longer match. Failures return HTTP 500
and are logged. Page reads never perform cleanup writes.

Run `npm run test:backend-usage` for the cache, auth, and historical-cleanup
regression checks. These use the installed Next.js cache with an in-memory cache
adapter and mocked data sources; they do not change Supabase.

Local integration checks use a disposable database named `amacss_test`. Both
scripts refuse remote databases. Seed with:

```sh
DATABASE_URI=postgres://amacss_test@127.0.0.1:5556/amacss_test PAYLOAD_SECRET=amacss-local-payload-secret-not-for-production npm run payload -- run tests/local-payload-smoke.ts
```

After building, start the app and run its HTTP checks in another terminal:

```sh
DATABASE_URI=postgres://amacss_test@127.0.0.1:5556/amacss_test PAYLOAD_SECRET=amacss-local-payload-secret-not-for-production CRON_SECRET=amacss-local-cron-test npm run start -- --hostname 127.0.0.1 --port 3000
DATABASE_URI=postgres://amacss_test@127.0.0.1:5556/amacss_test PAYLOAD_SECRET=amacss-local-payload-secret-not-for-production CRON_SECRET=amacss-local-cron-test node tests/local-http-smoke.mjs
```

Use the same local-only Payload secret for both fixture seeding and the server;
never reuse a production signing secret with the disposable admin account.
These checks cover the real PostgreSQL filter, cron authentication and idempotency,
local team photos, removed collection APIs, anonymous profile redirects, cache hits,
and admin create/edit/delete invalidation. The temporary Payload admin is
`localadmin@example.test` / `amacss-local-testing-only`; this account exists only
in the disposable local database. The site member login still uses Supabase.
