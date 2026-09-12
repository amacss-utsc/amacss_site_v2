# Supabase authentication setup

1. In **Supabase → Project Settings → API**, copy the project URL and publishable/anon key into:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

2. In **Authentication → URL Configuration** (still required for password-reset links):
   - Set **Site URL** to the production site URL.
   - Add `http://localhost:3000/auth/callback` for local development.
   - Add `https://YOUR-DOMAIN/auth/callback` for production.

3. In **Authentication → Sign In / Providers → Email**, keep email/password enabled and turn **Confirm email off**. New accounts can sign in immediately. This means the domain is validated, but ownership of the entered UofT address is not proven. SMTP remains necessary if password-reset emails should work for students.

4. Open **SQL Editor** and run [`supabase/migrations/20260910000000_create_member_profiles.sql`](supabase/migrations/20260910000000_create_member_profiles.sql). This creates the `member_profiles` table, row-level security policies, and a trigger that both copies profile data from Supabase Auth and rejects non-UofT domains server-side.

5. Keep `SUPABASE_KEY` server-only. The existing event image upload route uses it for Supabase Storage; never expose the service-role key in a `NEXT_PUBLIC_` variable.

6. Run the normal Payload database migration during deployment. The included Payload migration adds a Supabase user ID to event registrations while preserving existing registration rows.

7. Existing accounts in Payload are not automatically copied into Supabase Auth. If the site already has active member accounts, plan a one-time account migration or ask those members to create a new account before switching this version into production.

Accepted email domains are `utoronto.ca` and any subdomain such as `mail.utoronto.ca`.
