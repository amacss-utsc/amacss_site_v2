-- Transactional event confirmations and reminders. Only the server key may read these jobs.
create table if not exists public.event_notification_jobs (
  id bigint generated always as identity primary key,
  registration_id integer not null,
  event_id integer not null,
  member_id uuid not null references auth.users(id) on delete cascade,
  kind text not null check (kind in ('confirmation', 'reminder')),
  channel text not null check (channel in ('email', 'sms')),
  due_at timestamptz not null,
  claimed_until timestamptz,
  sent_at timestamptz,
  skipped_at timestamptz,
  attempts integer not null default 0,
  consented_at timestamptz,
  consented_phone text,
  created_at timestamptz not null default now(),
  unique (registration_id, kind, channel),
  check (channel <> 'sms' or (consented_at is not null and consented_phone is not null))
);
create index if not exists event_notification_jobs_due_idx
  on public.event_notification_jobs (due_at, claimed_until)
  where sent_at is null and skipped_at is null;
alter table public.event_notification_jobs enable row level security;
revoke all on public.event_notification_jobs from anon, authenticated;
grant select, insert, update, delete on public.event_notification_jobs to service_role;

create or replace function public.claim_event_notification_jobs(p_limit integer, p_registration_id integer default null)
returns setof public.event_notification_jobs
language sql security definer set search_path = '' as $$
  update public.event_notification_jobs j
  set claimed_until = now() + interval '10 minutes', attempts = attempts + 1
  where j.id in (
    select id from public.event_notification_jobs
    where due_at <= now()
      and sent_at is null and skipped_at is null
      and (claimed_until is null or claimed_until <= now())
      and attempts < 5
      and (p_registration_id is null or registration_id = p_registration_id)
    order by due_at, id
    limit least(greatest(p_limit, 1), 25)
    for update skip locked
  )
  returning j.*;
$$;
revoke all on function public.claim_event_notification_jobs(integer, integer) from public, anon, authenticated;
grant execute on function public.claim_event_notification_jobs(integer, integer) to service_role;

create or replace function public.reserve_member_notification_email()
returns boolean language plpgsql security definer set search_path = '' as $$
declare current_count integer;
begin
  perform pg_catalog.pg_advisory_xact_lock(2919020);
  select sent_count into current_count from public.member_email_daily_quota
    where day = (now() at time zone 'UTC')::date;
  if coalesce(current_count, 0) >= 100 then return false; end if;
  insert into public.member_email_daily_quota (day, sent_count)
  values ((now() at time zone 'UTC')::date, 1)
  on conflict (day) do update set sent_count = public.member_email_daily_quota.sent_count + 1;
  return true;
end;
$$;
revoke all on function public.reserve_member_notification_email() from public, anon, authenticated;
grant execute on function public.reserve_member_notification_email() to service_role;
