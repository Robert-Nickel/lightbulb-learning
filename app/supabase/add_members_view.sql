create view members as
select
    challenge_pool_user.challenge_pool,
    challenge_pool_user.user_id,
    profiles.first_name,
    profiles.last_name
from challenge_pool_user
left join profiles on challenge_pool_user.user_id = profiles.user_id;
