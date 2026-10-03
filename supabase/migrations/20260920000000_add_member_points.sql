begin;

alter table public.member_profiles
  add column points integer not null default 0
  constraint member_profiles_points_nonnegative check (points >= 0);

-- Owner-only RLS still applies. Remove table-wide UPDATE privileges so
-- members cannot change points; retain edits to the existing profile fields.
revoke update on table public.member_profiles from public, anon, authenticated;
grant update (full_name, email, phone, updated_at)
  on table public.member_profiles to authenticated;

-- The Auth sync trigger omits points, preserving balances on metadata updates
-- and using the default for newly created profiles. Service-role access stays intact.

commit;
