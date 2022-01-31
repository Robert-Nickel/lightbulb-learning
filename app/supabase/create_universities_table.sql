create table if not exists public.universities (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    name text not null,
    created_at timestamp with time zone default now() not null
);
ALTER TABLE universities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "u_insert_policy_for_authenticated_user" ON public.universities FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "u_select_policy_for_authenticated_user" ON public.universities FOR SELECT USING (auth.role() = 'authenticated');