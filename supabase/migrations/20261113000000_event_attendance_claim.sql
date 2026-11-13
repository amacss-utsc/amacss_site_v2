begin;

create table public.event_attendance (
  event_id integer not null references public.events(id) on delete restrict,
  member_id uuid not null references auth.users(id) on delete cascade,
  points_awarded integer not null check (points_awarded >= 0),
  checked_in_at timestamptz not null default clock_timestamp(),
  constraint event_attendance_event_member_unique unique (event_id, member_id)
);

create index event_attendance_member_id_idx on public.event_attendance (member_id);

alter table public.event_attendance enable row level security;
revoke all on table public.event_attendance from public, anon, authenticated;
grant select on table public.event_attendance to service_role;

-- Only the server's service-role client may call this function. The caller's
-- member ID comes from a verified Supabase session in the check-in API.
create function public.claim_event_attendance(
  p_event_id integer,
  p_member_id uuid,
  p_attendance_code text
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  event_record public.events%rowtype;
  profile_record public.member_profiles%rowtype;
  auth_email text;
  email_domain text;
  previous_award integer;
  awarded integer;
  new_balance integer;
  check_in_time timestamptz;
begin
  if p_event_id is null or p_member_id is null or p_attendance_code is null then
    return pg_catalog.jsonb_build_object('status', 'invalid_request');
  end if;

  -- A shared lock prevents staff edits midway through a claim while allowing
  -- students to claim the same event concurrently. The profile lock serializes
  -- balance updates for each member.
  select * into event_record
  from public.events
  where id = p_event_id
  for share;
  if not found then
    return pg_catalog.jsonb_build_object('status', 'event_not_found');
  end if;

  select email into auth_email from auth.users where id = p_member_id;
  if not found then
    return pg_catalog.jsonb_build_object('status', 'account_not_found');
  end if;

  select * into profile_record
  from public.member_profiles
  where id = p_member_id
  for update;
  if not found then
    return pg_catalog.jsonb_build_object('status', 'profile_missing');
  end if;

  email_domain := pg_catalog.split_part(pg_catalog.lower(pg_catalog.btrim(auth_email)), '@', 2);
  if profile_record.email_verified_at is null
     or pg_catalog.lower(pg_catalog.btrim(profile_record.email))
        is distinct from pg_catalog.lower(pg_catalog.btrim(auth_email))
     or (email_domain <> 'utoronto.ca' and email_domain not like '%.utoronto.ca') then
    return pg_catalog.jsonb_build_object('status', 'email_unverified');
  end if;

  -- A repeat visit reports the original claim even after check-in closes.
  select points_awarded into previous_award
  from public.event_attendance
  where event_id = p_event_id and member_id = p_member_id;
  if found then
    return pg_catalog.jsonb_build_object(
      'status', 'already_claimed',
      'pointsAwarded', previous_award,
      'pointsBalance', profile_record.points
    );
  end if;

  check_in_time := pg_catalog.clock_timestamp();
  if event_record.check_in_opens_at is null
     or event_record.check_in_closes_at is null
     or check_in_time < event_record.check_in_opens_at
     or check_in_time >= event_record.check_in_closes_at then
    return pg_catalog.jsonb_build_object('status', 'checkin_closed');
  end if;

  if event_record.attendance_code is null
     or event_record.attendance_code <> p_attendance_code then
    return pg_catalog.jsonb_build_object('status', 'invalid_code');
  end if;

  -- events.points is numeric; member_profiles.points is a 32-bit integer.
  if event_record.points > 2147483647 - profile_record.points then
    return pg_catalog.jsonb_build_object('status', 'points_unavailable');
  end if;

  insert into public.event_attendance (event_id, member_id, points_awarded, checked_in_at)
  values (p_event_id, p_member_id, event_record.points::integer, check_in_time)
  on conflict (event_id, member_id) do nothing
  returning points_awarded into awarded;

  if not found then
    return pg_catalog.jsonb_build_object('status', 'already_claimed');
  end if;

  update public.member_profiles
  set points = points + awarded, updated_at = check_in_time
  where id = p_member_id
  returning points into new_balance;

  return pg_catalog.jsonb_build_object(
    'status', 'claimed',
    'pointsAwarded', awarded,
    'pointsBalance', new_balance
  );
end;
$$;

revoke all on function public.claim_event_attendance(integer, uuid, text)
  from public, anon, authenticated;
grant execute on function public.claim_event_attendance(integer, uuid, text)
  to service_role;

commit;
