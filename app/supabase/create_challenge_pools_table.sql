create table if not exists public.challenge_pools (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    description text not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE challenge_pools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cp_insert_policy_for_authenticated_user" ON public.challenge_pools FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "cp_select_policy_for_owner" ON public.challenge_pools FOR SELECT USING (auth.uid() = owner);
CREATE POLICY "cp_select_policy_for_member" ON public.challenge_pools FOR SELECT USING (auth.uid() IN ( SELECT members.user_id FROM members WHERE (members.challenge_pool = challenge_pools.id)));
CREATE POLICY "cp_delete_policy_for_owner" ON public.challenge_pools FOR DELETE USING (auth.uid() = owner);

