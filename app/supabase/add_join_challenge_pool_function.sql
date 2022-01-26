create or replace function join_challenge_pool(invite_code_input text, user_id_input uuid) returns boolean as $$
  declare
    challenge_pool_id uuid;
    invite_code_valid_until timestamp;
  begin
    select challenge_pool, valid_until
    into challenge_pool_id, invite_code_valid_until
    from invite_codes
    where code = invite_code_input;
    
    if invite_code_valid_until < now() then
      return false;
    end if;

    -- TODO: prevent duplicates in challenge_pool_user -> return false

    insert into challenge_pool_user(challenge_pool, user_id)
    values (challenge_pool_id, user_id_input);

    return true;
  end;
$$ language plpgsql SECURITY DEFINER;