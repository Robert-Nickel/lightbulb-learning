create table if not exists public.open_answer_drafts (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    answer_text text not null,
    open_question uuid references public.open_questions on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE open_answer_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oad_insert_policy_for_authenticated_user" ON public.open_answer_drafts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "oad_select_policy_for_owner" ON public.open_answer_drafts FOR SELECT USING (auth.uid() = owner);
CREATE POLICY "oad_delete_policy_for_owner" ON public.open_answer_drafts FOR DELETE USING (auth.uid() = owner);