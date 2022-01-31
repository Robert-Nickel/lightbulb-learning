create table if not exists public.open_questions (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    question_text text not null,
    challenge_pool uuid references public.challenge_pools on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE open_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oq_insert_policy_for_authenticated_user" ON public.open_questions FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "oq_select_policy_for_authenticated_user" ON public.open_questions FOR SELECT USING (auth.role() = 'authenticated');