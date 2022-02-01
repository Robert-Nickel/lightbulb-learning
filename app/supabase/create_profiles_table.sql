create table if not exists public.profiles (
    id uuid not null primary key DEFAULT uuid_generate_v4(),
    first_name text not null,
    last_name text not null,
    university uuid references public.universities on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    created_at timestamp with time zone default now() not null
);

ALTER TABLE
    profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "p_insert_policy_for_authenticated_user" ON public.profiles FOR
INSERT
    WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "p_select_policy_for_owner" ON public.profiles FOR
SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "p_update_policy_for_owner" ON public.profiles FOR
UPDATE
    USING (auth.uid() = user_id);

INSERT INTO
    profiles(first_name, last_name, university, user_id)
VALUES
    (
        'Student 1',
        'Test',
        (
            select
                id
            from
                universities
            where
                name = 'Hochschule Konstanz'
        ),
        (
            select
                id
            from
                auth.users
            where
                email = 'll-student1@discardmail.com'
        )
    );