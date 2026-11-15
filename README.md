# AMACSS website

AMACSS's website uses Next.js, TypeScript, Payload CMS, PostgreSQL, and Supabase.
Payload manages events, resources, and registrations. Supabase provides member
accounts and points. Team content is maintained in code.

## Local development

1. Install dependencies with `pnpm install` (the project pins pnpm in `package.json`).
2. Copy `.env.example` to `.env` and fill in the database, Payload secret, and
   Supabase settings. See [Supabase setup](#supabase-setup) for account setup.
3. Start the local database with `docker compose up -d db`. Its connection string
   is `postgres://amacss_dev:amacss_dev@localhost:5555/amacss_dev`.
4. Run `pnpm dev` and open `http://localhost:3000`. Payload admin is at `/admin`;
   its accounts are separate from Supabase member accounts.

The development event preview reads production content from `www.amacss.org`.
Use a local database for development writes. Configure all `S3_*` variables when
using remote media storage; without them Payload uses local upload storage.

## Checks

```sh
pnpm lint
pnpm exec tsc --noEmit --incremental false
pnpm local-build
```

For a production build locally, run `pnpm local-build` followed by `pnpm start`.

## Deployment

- Configure production environment variables from `.env.example`. Keep server
  secrets out of `NEXT_PUBLIC_*` variables.
- Apply pending Payload migrations with `pnpm migrate`. Builds do not run them.
  Supabase SQL migrations in `supabase/migrations/` are applied separately.
- Set `CRON_SECRET` before deployment. `vercel.json` schedules authenticated
  requests to `/apiv2/events/unpin-past` daily at 10:00 UTC. Vercel cron runs on
  production deployments.
- Verify team photos, member login/logout, protected pages, and admin content edits
  after deploying to the configured production branch.

## Supabase setup

- Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  (or the anon key). Keep `SUPABASE_KEY` / `SUPABASE_SECRET_KEY` server-only.
- Enable email/password sign-in and disable Supabase's built-in email confirmation.
  This app verifies UofT email ownership separately before event registration.
- Configure the production Site URL and allow `/auth/callback` and `/auth/recovery`
  redirects on the production domain and `http://localhost:3000`. Configure
  Supabase email delivery for password resets.
- Apply pending SQL files in `supabase/migrations/` in order, once per database.
  They manage member profiles, access policies, points, and verification features.
  Run Payload's migrations separately with `pnpm migrate`; neither migration
  workflow executes the other.
- Existing Payload accounts are not automatically migrated into Supabase Auth.
  Member emails must use `utoronto.ca` or one of its subdomains.

## Content and caching

- Edit team members, roles, bios, links, and departments in `src/data/team.ts`.
  Photos belong in `public/static/images/team/`. Deploy to publish changes.
- Team collections are no longer registered in Payload. Their old database tables
  are empty and retained with the historical migrations.
- Public event lists, sidebar events, calendar queries, resources, tags, and the
  public leaderboard use a 24-hour cache. Refresh is triggered by a request after
  expiry, rather than at a fixed daily time.
- Payload creates, edits, and deletes invalidate the relevant content caches.
  Changes to event tags, ribbons, or media also invalidate cached events.
- Private account and registration data are not shared-cache entries. Signed-in
  members' personal leaderboard points and rank are read live.
- Events remain pinned through their final calendar day in Toronto. Display logic
  and daily database cleanup account for `endDate` and daylight saving changes.

## Team data cleanup

The cleanup script defaults to a read-only audit. `--retire-current` includes the
current backend roster only after verifying that production serves every local
photo and that the retired Payload collection APIs return 404.

```sh
node --env-file=.env scripts/cleanup-team-history.mjs
node --env-file=.env scripts/cleanup-team-history.mjs --retire-current
```

Add `--apply` to execute an audited plan. Deleted-row metadata and storage progress
are saved under `/tmp/amacss-team-cleanup-<timestamp>/`. Storage deletions are
permanent; the metadata backup does not contain the image files. Resume an
interrupted storage cleanup from its saved manifest:

```sh
node --env-file=.env scripts/cleanup-team-history.mjs --resume '/path/to/plan.json' --apply
```

Resume verifies the project, bucket, and current references, and skips completed
batches. These scripts require Node 20.12+ and installed project dependencies.

### Security maintenance

Use Node 24.x and the pinned pnpm 10.22.0. Before starting this upgrade in production, run `pnpm migrate` to add Payload's session tables, password-reset throttle columns, and internal key-value table. Existing Payload sessions will need a new login. Supabase accounts are unchanged; legacy Payload member records are now admin-only.

The follow-up Payload migration adds the optional `media._objectkey` column required by the upgraded S3 storage plugin. Existing files keep their filenames and need no backfill. CI enables S3 with dummy credentials to check this schema without uploading files. The Supabase SQL migration `20261112000000_restore_profile_reads.sql` restores schema access for the server and signed-in profile reads in environments missing those grants; it requires profile RLS and grants no member updates.

Run `pnpm test:security`, `pnpm lint`, and `pnpm audit --audit-level moderate`. Against a migrated, disposable local Postgres database, also run `pnpm test:security:integration`.

The lockfile upgrades Payload/Next/React together. Targeted pnpm overrides patch sanitizer, headless DOM, math, selector/glob parser, and migration-tool dependencies. The editor patches load Monaco locally (including its worker), and use the patched DOMPurify dependency instead of its bundled older copy or the CDN loader. The deepmerge patch uses own-property definitions to prevent prototype poisoning; its regression test exercises Payload's installed copy. Raw `pnpm audit` still reports that one low advisory because the registry cannot account for local patches. No advisories are globally suppressed; CI rejects moderate or higher findings. Remove these patches/overrides when upstream dependencies include the fixes.

Registration requests are capped at 4 MB, with at most three JPEG/PNG/WebP images up to 3 MB each; images are decoded and re-encoded as WebP before storage. Seminar uploads require an admin account and accept up to ten PDF, Markdown, text, or image files within the same request limit.

For Vercel, select **Project → Settings → Build and Deployment → Node.js Version → 24.x**, save, and redeploy. `engines.node` also pins `24.x`; an open-ended range can select a newer major on Vercel.

Payload and Supabase migrations target different parts of the same database. This upgrade adds session tables for CMS/legacy accounts, password-reset throttle columns, and Payload's internal key-value table. It also enables RLS and removes `anon`/`authenticated` Data API grants on private Payload tables. The server's `DATABASE_URI` must use the database owner or an appropriate privileged server role. It does not change Supabase `auth.users`, member profiles, points, or notification policies. Rollback retains the private-table protections.

Check each environment with `pnpm migrate:status`, then run `NODE_ENV=production pnpm migrate` with that environment's `DATABASE_URI` and `PAYLOAD_SECRET` configured securely. Apply once to production and once to the shared preview database; Vercel builds and Supabase do not automatically execute these TypeScript migrations. Check the dashboard Build Command for any existing override. For migrations, use Supabase's direct connection, or its session pooler if direct IPv6 is unavailable—not the transaction pooler. Do not run integration tests against either deployed database.

If `migrate:status` unexpectedly lists old migrations as pending, reconcile the database history before applying them. Do not assume that a populated database has already recorded every historical migration.
