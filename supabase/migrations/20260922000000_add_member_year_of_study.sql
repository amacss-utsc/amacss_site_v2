-- Existing members keep a null year unless valid Auth metadata is available.
-- The column remains nullable so this migration can safely run before the new
-- signup form is deployed and so legacy accounts continue to work.
alter table public.member_profiles
  add column if not exists year_of_study smallint
  check (year_of_study between 1 and 5);

update public.member_profiles as profile
set
  year_of_study = (auth_user.raw_user_meta_data ->> 'year_of_study')::smallint,
  updated_at = now()
from auth.users as auth_user
where profile.id = auth_user.id
  and profile.year_of_study is null
  and coalesce(auth_user.raw_user_meta_data ->> 'year_of_study', '') ~ '^[1-5]$';

create or replace function public.sync_member_profile()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  email_domain text;
  study_year smallint;
begin
  email_domain := split_part(lower(new.email), '@', 2);

  if email_domain <> 'utoronto.ca' and email_domain not like '%.utoronto.ca' then
    raise exception 'A University of Toronto email address is required.';
  end if;

  if coalesce(new.raw_user_meta_data ->> 'year_of_study', '') ~ '^[1-5]$' then
    study_year := (new.raw_user_meta_data ->> 'year_of_study')::smallint;
  end if;

  insert into public.member_profiles (
    id,
    full_name,
    email,
    phone,
    year_of_study,
    created_at,
    updated_at
  )
  values (
    new.id,
    trim(coalesce(new.raw_user_meta_data ->> 'full_name', '')),
    lower(new.email),
    trim(coalesce(new.raw_user_meta_data ->> 'phone', '')),
    study_year,
    coalesce(new.created_at, now()),
    now()
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    email = excluded.email,
    phone = excluded.phone,
    year_of_study = coalesce(
      excluded.year_of_study,
      public.member_profiles.year_of_study
    ),
    updated_at = now();

  return new;
end;
$$;
