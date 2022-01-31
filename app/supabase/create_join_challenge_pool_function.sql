create or replace function join_challenge_pool(invite_code_input text, user_id_input uuid) returns text as $$
  declare
    challenge_pool_id uuid;
    invite_code_valid_until timestamp;
    challenge_pool_owner uuid;
  begin
    select challenge_pool, valid_until
    into challenge_pool_id, invite_code_valid_until
    from invite_codes
    where code = invite_code_input;

    select owner
    into challenge_pool_owner
    from challenge_pools
    where id = challenge_pool_id;
    
    if invite_code_valid_until < now() then
      -- TODO: raise an exception
      return 'false';
    end if;

    -- TODO: prevent duplicates in challenge_pool_user ->  raise an exception

    insert into challenge_pool_user(challenge_pool, user_id, challenge_pool_owner)
    values (challenge_pool_id, user_id_input, challenge_pool_owner);
    return challenge_pool_id::text;
  end;
$$ language plpgsql SECURITY DEFINER;