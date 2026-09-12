create table if not exists public.member_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null check (char_length(trim(full_name)) >= 2),
  email text not null unique,
  phone text not null check (char_length(trim(phone)) >= 7),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.member_profiles enable row level security;

create policy "Members can view their own profile"
  on public.member_profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "Members can update their own profile"
  on public.member_profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create or replace function public.sync_member_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  email_domain text;
begin
  email_domain := split_part(lower(new.email), '@', 2);

  if email_domain <> 'utoronto.ca' and email_domain not like '%.utoronto.ca' then
    raise exception 'A University of Toronto email address is required.';
  end if;

  insert into public.member_profiles (id, full_name, email, phone, created_at, updated_at)
  values (
    new.id,
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    lower(new.email),
    trim(coalesce(new.raw_user_meta_data ->> 'phone', '')),
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    updated_at = now();

  return new;
end;
$$;

drop trigger if exists sync_member_profile_on_auth_change on auth.users;
create trigger sync_member_profile_on_auth_change
  after insert or update of email, raw_user_meta_data on auth.users
  for each row execute procedure public.sync_member_profile();

