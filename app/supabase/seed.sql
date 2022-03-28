---
--- Test Data
---
DELETE FROM
    auth.users;

DELETE FROM
    public.universities;

DELETE FROM
    public.courses;

DELETE FROM
    public.course_user;

DELETE FROM
    public.evaluations;

DELETE FROM
    public.open_questions;

INSERT INTO
    auth.users (
        id,
        instance_id,
        aud,
        "role",
        email,
        encrypted_password,
        email_confirmed_at,
        invited_at,
        confirmation_token,
        confirmation_sent_at,
        recovery_token,
        recovery_sent_at,
        email_change_token_new,
        email_change,
        email_change_sent_at,
        last_sign_in_at,
        raw_app_meta_data,
        raw_user_meta_data,
        is_super_admin,
        created_at,
        updated_at,
        phone,
        phone_confirmed_at,
        phone_change,
        phone_change_token,
        phone_change_sent_at,
        email_change_token_current,
        email_change_confirm_status,
        banned_until
    )
VALUES
    (
        '6a4cb762-5ddd-46a0-9db1-46684fe04daa' :: uuid,
        '6e0887e2-97da-40d9-a8ee-dea3cdad54f9' :: uuid,
        'authenticated',
        'authenticated',
        'll-professor1@discardmail.com',
        '$2a$10$Jjn2zzqUIrDN4s2lSxoaJOBuEwYP2heOg1zApbGseox5e0xzbD86S',
        '2022-01-19 14:55:04.178',
        NULL,
        '',
        '2022-01-19 14:54:41.687',
        '',
        NULL,
        '',
        '',
        NULL,
        '2022-01-19 14:55:04.179',
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        false,
        '2022-01-19 14:54:41.682',
        '2022-01-19 14:54:41.682',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL
    ),
    (
        '55ce341c-1ee3-4984-a2fc-d27a52dc0cd8' :: uuid,
        '8e0887e2-97da-40d9-a8ee-dea3cdad54f9' :: uuid,
        'authenticated',
        'authenticated',
        'll-student1@discardmail.com',
        '$2a$10$Jjn2zzqUIrDN4s2lSxoaJOBuEwYP2heOg1zApbGseox5e0xzbD86S',
        '2022-01-19 14:55:04.178',
        NULL,
        '',
        '2022-01-19 14:54:41.687',
        '',
        NULL,
        '',
        '',
        NULL,
        '2022-01-19 14:55:04.179',
        '{"provider": "email", "providers": ["email"]}',
        '{}',
        false,
        '2022-01-19 14:54:41.682',
        '2022-01-19 14:54:41.682',
        NULL,
        NULL,
        '',
        '',
        NULL,
        '',
        0,
        NULL
    );

INSERT INTO
    public.universities (id, created_at, name)
VALUES
    (
        '06f6ab63-eeee-4707-9c90-34f33aa820fd' :: uuid,
        '2022-01-17 07:57:52.000',
        'Hochschule Konstanz'
    );

INSERT INTO
    public.profiles (
        first_name,
        last_name,
        university,
        user_id
    )
VALUES
    (
        'El',
        'Professor',
        '06f6ab63-eeee-4707-9c90-34f33aa820fd' :: uuid,
        '6a4cb762-5ddd-46a0-9db1-46684fe04daa' :: uuid
    ),
    (
        'El',
        'Studento',
        '06f6ab63-eeee-4707-9c90-34f33aa820fd' :: uuid,
        '55ce341c-1ee3-4984-a2fc-d27a52dc0cd8' :: uuid
    );

INSERT INTO
    public.courses (id, description, "owner")
VALUES
    (
        '57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958' :: uuid,
        'General Wisdom',
        '6a4cb762-5ddd-46a0-9db1-46684fe04daa' :: uuid
    ),
    (
        '2cd83fb1-2681-402c-8acf-10943eb5dbc6' :: uuid,
        'course for deletion',
        '6a4cb762-5ddd-46a0-9db1-46684fe04daa' :: uuid
    )
    ;

INSERT INTO
    public.course_user (id, course, user_id)
VALUES
    (
        '4e5e689a-a09c-4e20-858c-14d442251457' :: uuid,
        '57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958' :: uuid,
        '55ce341c-1ee3-4984-a2fc-d27a52dc0cd8' :: uuid
    ),
    (
        '655d862d-8a9d-4591-abeb-df58bbe21e69' :: uuid,
        '2cd83fb1-2681-402c-8acf-10943eb5dbc6' :: uuid,
        '6a4cb762-5ddd-46a0-9db1-46684fe04daa' :: uuid
    ),
    (
        '54d95b6f-e966-4551-9caa-f2f1bed7823f' :: uuid,
        '57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958' :: uuid,
        '6a4cb762-5ddd-46a0-9db1-46684fe04daa' :: uuid
    );


INSERT INTO
    public.open_questions(id, question_text, "owner", course)
VALUES
    (
        'f7143606-7831-4e4a-ae4c-936265bcbc73' :: uuid,
        'Whats up?',
        '55ce341c-1ee3-4984-a2fc-d27a52dc0cd8' :: uuid,
        '57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958' :: uuid
    );

INSERT INTO
    public.correct_open_answers (answer_text, open_question, "owner")
VALUES
    (
        'Not much, bro.',
        'f7143606-7831-4e4a-ae4c-936265bcbc73' :: uuid,
        '55ce341c-1ee3-4984-a2fc-d27a52dc0cd8' :: uuid
    );

INSERT INTO
    public.invite_codes(code, course, "owner", valid_until)
values
    (
        'GNRLWISDOM',
        '57d1c1f0-f1cb-4e3f-b3eb-5ce53b593958' :: uuid,
        '6a4cb762-5ddd-46a0-9db1-46684fe04daa' :: uuid,
        '2032-01-28 21:04:33.009'
    );