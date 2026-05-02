-- Increase free trial bonus from 10 → 40 minutes.
-- Reasons: 10 min was too tight to even try a single meeting.
-- 40 min = ~one full meeting / lecture / interview.

-- Update default for any future row creations
alter table public.user_credits
  alter column free_minutes_remaining set default 40;

-- Update the trigger function to grant 40 to new signups going forward
create or replace function public.handle_new_user_credits()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_credits (user_id, free_minutes_remaining)
  values (new.id, 40)
  on conflict (user_id) do nothing;
  return new;
end;
$$;

-- Top up existing users who haven't used any minutes yet
-- (i.e., still on initial 10-minute bonus and haven't transcribed anything)
update public.user_credits
set free_minutes_remaining = 40
where total_minutes_used = 0
  and free_minutes_remaining = 10;
