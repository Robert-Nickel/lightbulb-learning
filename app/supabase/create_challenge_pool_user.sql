create table if not exists public.challenge_pool_user (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    challenge_pool uuid references public.challenge_pools on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE challenge_pool_user ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cpu_insert_policy_for_authenticated_user" ON public.challenge_pool_user FOR INSERT WITH CHECK ((auth.role() = 'authenticated') AND (auth.uid() = user_id));
CREATE POLICY "cpu_delete_policy_for_user" ON public.challenge_pool_user FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "cpu_select_policy_for_owner" ON public.challenge_pool_user FOR SELECT USING (auth.uid() = user_id);