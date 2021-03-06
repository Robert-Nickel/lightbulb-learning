create table if not exists public.feedback_drafts (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    feedback_text text not null,
    answer uuid references public.answers on delete cascade not null,
    owner uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE feedback_drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ofd_insert_policy_for_authenticated_user" ON public.feedback_drafts FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "ofd_select_policy_for_owner" ON public.feedback_drafts FOR SELECT USING (auth.uid() = owner);
CREATE POLICY "ofd_delete_policy_for_owner" ON public.feedback_drafts FOR DELETE USING (auth.uid() = owner);
