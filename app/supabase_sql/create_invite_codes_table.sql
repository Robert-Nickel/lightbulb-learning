create table if not exists public.invite_codes (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    code text not null,
    challenge_pool uuid references public.challenge_pools on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    valid_until timestamp not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE invite_codes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ic_insert_policy_for_authenticated_user" ON public.invite_codes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ic_select_policy_for_owner" ON public.invite_codes FOR SELECT USING (auth.uid() = owner);