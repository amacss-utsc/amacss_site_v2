-- Apply in Supabase SQL Editor before enabling the verification UI in production.
alter table public.member_profiles
  add column if not exists email_verified_at timestamptz;

-- RLS cannot protect individual columns. The old whole-row update policy would let
-- a member set email_verified_at themselves, so profile updates stay server-only.
drop policy if exists "Members can update their own profile" on public.member_profiles;
revoke update on public.member_profiles from authenticated;
grant select, update on public.member_profiles to service_role;

create or replace function public.clear_member_email_verification()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if lower(new.email) is distinct from lower(old.email) then
    new.email_verified_at := null;
  end if;
  return new;
end;
$$;

drop trigger if exists clear_member_email_verification_on_change on public.member_profiles;
create trigger clear_member_email_verification_on_change
  before update of email on public.member_profiles
  for each row execute function public.clear_member_email_verification();

create table if not exists public.member_email_codes (
  member_id uuid primary key references auth.users(id) on delete cascade,
  code_hash text not null,
  expires_at timestamptz not null,
  last_sent_at timestamptz not null,
  send_window_start timestamptz not null,
  send_count integer not null default 0,
  failed_attempts integer not null default 0
);
alter table public.member_email_codes enable row level security;
revoke all on public.member_email_codes from anon, authenticated;
grant select, insert, update, delete on public.member_email_codes to service_role;

create table if not exists public.member_email_daily_quota (
  day date primary key,
  sent_count integer not null default 0
);
alter table public.member_email_daily_quota enable row level security;
revoke all on public.member_email_daily_quota from anon, authenticated;
grant select, insert, update, delete on public.member_email_daily_quota to service_role;

create or replace function public.reserve_member_email_code(p_member_id uuid, p_hash text)
returns text language plpgsql security definer set search_path = '' as $$
declare
  existing public.member_email_codes%rowtype;
  quota integer;
  current_email text;
begin
  -- Serialize quota reservations across serverless instances.
  perform pg_catalog.pg_advisory_xact_lock(2919020);
  select email into current_email from public.member_profiles where id = p_member_id and email_verified_at is null;
  if current_email is null then return 'unavailable'; end if;
  select * into existing from public.member_email_codes where member_id = p_member_id;
  if existing.last_sent_at > now() - interval '1 minute' then return 'cooldown'; end if;
  if existing.send_window_start > now() - interval '1 day' and existing.send_count >= 3 then return 'member_limit'; end if;
  select sent_count into quota from public.member_email_daily_quota where day = (now() at time zone 'UTC')::date;
  if coalesce(quota, 0) >= 80 then return 'daily_limit'; end if;

  insert into public.member_email_codes (member_id, code_hash, expires_at, last_sent_at, send_window_start, send_count, failed_attempts)
  values (p_member_id, p_hash, now() + interval '10 minutes', now(), now(), 1, 0)
  on conflict (member_id) do update set
    code_hash = excluded.code_hash,
    expires_at = excluded.expires_at,
    last_sent_at = excluded.last_sent_at,
    send_window_start = case when public.member_email_codes.send_window_start <= now() - interval '1 day' then now() else public.member_email_codes.send_window_start end,
    send_count = case when public.member_email_codes.send_window_start <= now() - interval '1 day' then 1 else public.member_email_codes.send_count + 1 end,
    failed_attempts = 0;
  insert into public.member_email_daily_quota (day, sent_count)
  values ((now() at time zone 'UTC')::date, 1)
  on conflict (day) do update set sent_count = public.member_email_daily_quota.sent_count + 1;
  return 'sent';
end;
$$;

create or replace function public.confirm_member_email_code(p_member_id uuid, p_hash text)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  challenge public.member_email_codes%rowtype;
begin
  perform pg_catalog.pg_advisory_xact_lock(2919020);
  select * into challenge from public.member_email_codes where member_id = p_member_id for update;
  if not found or challenge.expires_at <= now() or challenge.failed_attempts >= 5 then return false; end if;
  if challenge.code_hash <> p_hash then
    update public.member_email_codes set failed_attempts = failed_attempts + 1 where member_id = p_member_id;
    return false;
  end if;
  update public.member_profiles set email_verified_at = now(), updated_at = now() where id = p_member_id;
  delete from public.member_email_codes where member_id = p_member_id;
  return true;
end;
$$;

revoke all on function public.reserve_member_email_code(uuid, text) from public, anon, authenticated;
revoke all on function public.confirm_member_email_code(uuid, text) from public, anon, authenticated;
grant execute on function public.reserve_member_email_code(uuid, text) to service_role;
grant execute on function public.confirm_member_email_code(uuid, text) to service_role;
