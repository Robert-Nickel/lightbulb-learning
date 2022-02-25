create table if not exists public.correct_open_answers (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    answer_text text not null,
    open_question uuid references public.open_questions on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE correct_open_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "coa_insert_policy_for_authenticated_user" ON public.correct_open_answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "coa_select_policy_for_owner" ON public.correct_open_answers FOR SELECT USING (auth.uid() = owner);