create table if not exists public.question_drafts (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    question_text text not null,
    answer_text text,
    challenge_pool uuid references public.challenge_pools on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE question_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oqd_insert_policy_for_authenticated_user" ON public.question_drafts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "oqd_select_policy_for_owner" ON public.question_drafts FOR SELECT USING (auth.uid() = owner);
CREATE POLICY "oqd_delete_policy_for_owner" ON public.question_drafts FOR DELETE USING (auth.uid() = owner);
CREATE POLICY "oqd_update_policy_for_owner" ON public.question_drafts FOR UPDATE USING (auth.uid() = owner);