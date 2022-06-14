create table if not exists public.open_answers (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    answer_text text not null,
    version int8 not null,
    question uuid references public.questions on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE open_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "oa_insert_policy_for_authenticated_user" ON public.open_answers FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "oa_select_policy_for_authenticated_user" ON public.open_answers FOR SELECT USING (auth.role() = 'authenticated');