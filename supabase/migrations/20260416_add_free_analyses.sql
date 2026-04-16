-- Add free trial analysis tracking
alter table user_settings
  add column if not exists free_analyses_used integer default 0;

-- Atomically claim a free analysis slot (returns false if quota exceeded)
create or replace function claim_free_analysis(user_id uuid)
returns boolean
language plpgsql
security definer set search_path = ''
as $$
declare
  current_count integer;
begin
  -- Ensure user_settings row exists (handles edge case where trigger didn't fire)
  insert into public.user_settings (id)
  values (user_id)
  on conflict (id) do nothing;

  select free_analyses_used into current_count
  from public.user_settings
  where id = user_id
  for update;

  if current_count is null or current_count >= 5 then
    return false;
  end if;

  update public.user_settings
  set free_analyses_used = current_count + 1,
      updated_at = now()
  where id = user_id;

  return true;
end;
$$;
