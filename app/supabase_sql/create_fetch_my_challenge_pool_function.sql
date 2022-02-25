create or replace function fetch_my_challenge_pools(user_id_input uuid) 
  returns table(id uuid, description text, owner uuid, created_ad timestamp) 
as $$
  select *
  from challenge_pools
  where owner = user_id_input
  or id in (
    select challenge_pool
    from challenge_pool_user
    where user_id = user_id_input
  );
$$ language sql SECURITY DEFINER;