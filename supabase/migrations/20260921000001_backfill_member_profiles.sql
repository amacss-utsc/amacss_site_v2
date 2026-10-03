-- Backfill Auth accounts that predate the member_profiles sync trigger.
-- Only accounts with the required U of T email, full name, and phone metadata
-- are inserted; incomplete accounts remain unchanged for manual review.
insert into public.member_profiles (
  id,
  full_name,
  email,
  phone,
  created_at,
  updated_at
)
select
  auth_user.id,
  trim(auth_user.raw_user_meta_data ->> 'full_name'),
  lower(auth_user.email),
  trim(auth_user.raw_user_meta_data ->> 'phone'),
  coalesce(auth_user.created_at, now()),
  now()
from auth.users as auth_user
where auth_user.email is not null
  and (
    split_part(lower(auth_user.email), '@', 2) = 'utoronto.ca'
    or split_part(lower(auth_user.email), '@', 2) like '%.utoronto.ca'
  )
  and char_length(trim(coalesce(auth_user.raw_user_meta_data ->> 'full_name', ''))) >= 2
  and char_length(trim(coalesce(auth_user.raw_user_meta_data ->> 'phone', ''))) >= 7
on conflict (id) do nothing;
