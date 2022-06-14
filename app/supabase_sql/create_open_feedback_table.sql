create table if not exists public.open_feedback (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    feedback_text text not null,
    answer uuid references public.answers on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE open_feedback ENABLE ROW LEVEL SECURITY;
CREATE POLICY "of_insert_policy_for_authenticated_user" ON public.open_feedback FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "of_select_policy_for_authenticated_user" ON public.open_feedback FOR SELECT USING (auth.role() = 'authenticated');