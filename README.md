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
pnpm test:backend-usage
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

## Local integration tests

`tests/local-payload-smoke.ts` seeds fixtures and checks real PostgreSQL queries;
`tests/local-http-smoke.mjs` checks the running app's cache, admin invalidation,
cleanup endpoint, local team photos, and anonymous profile redirect. Both refuse
remote databases and require a disposable local database named `amacss_test`.

With that database running, set `DATABASE_URI`, a separate `PAYLOAD_SECRET`
starting with `amacss-local-`, and a local `CRON_SECRET`. Then run:

```sh
pnpm payload run tests/local-payload-smoke.ts
pnpm local-build
pnpm start
# In another terminal with the same environment:
node tests/local-http-smoke.mjs
```

The disposable Payload admin is `localadmin@example.test` with password
`amacss-local-testing-only`. Never reuse a production signing secret for this test
account. Member sign-in still uses the configured Supabase project.
