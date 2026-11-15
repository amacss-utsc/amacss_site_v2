-- Schema access is separate from table grants and row-level policies.
-- Members retain only their existing own-profile SELECT policy; server-only
-- verification and points updates continue to use service_role.
begin;
do $$
begin
  if not exists (
    select 1 from pg_class
    where oid = 'public.member_profiles'::regclass and relrowsecurity
  ) then
    raise exception 'Enable member_profiles RLS before restoring profile reads';
  end if;
end;
$$;
grant usage on schema public to service_role, authenticated;
grant select on public.member_profiles to authenticated;
commit;
