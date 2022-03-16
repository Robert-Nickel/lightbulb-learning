---
--- Cypress Test Data
---
Delete from auth.users;
INSERT INTO
    auth.users (
        instance_id,
        id,
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
        '00000000-0000-0000-0000-000000000000' :: uuid,
        '6e0887e2-97da-40d9-a8ee-dea3cdad54f9' :: uuid,
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
    ), (
        '11111111-0000-0000-0000-000000000000' :: uuid,
        '8e0887e2-97da-40d9-a8ee-dea3cdad54f9' :: uuid,
        'authenticated',
        'authenticated',
        'll-student2@discardmail.com',
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
Delete from public.universities;

INSERT INTO
    public.universities (id, created_at, name)
VALUES
    (
        'd6ff8454-6c6e-4712-ad66-c335b6b767d4' :: uuid,
        '2022-01-17 07:57:52.000',
        'Hochschule Konstanz'
    );

INSERT INTO
    public.profiles (
        id,
        first_name,
        last_name,
        university,
        user_id,
        created_at
    )
VALUES
    (
        'a077c312-8264-43c7-80ae-423f1a14e1c8' :: uuid,
        'Testo',
        'Studento',
        'd6ff8454-6c6e-4712-ad66-c335b6b767d4' :: uuid,
        '6e0887e2-97da-40d9-a8ee-dea3cdad54f9' :: uuid,
        '2022-01-26 16:09:30.000'
    ),(
        'b077c312-8264-43c7-80ae-423f1a14e1c8' :: uuid,
        'Testa',
        'Studenta',
        'd6ff8454-6c6e-4712-ad66-c335b6b767d4' :: uuid,
        '8e0887e2-97da-40d9-a8ee-dea3cdad54f9' :: uuid,
        '2022-01-26 16:09:30.000'
    );

DELETE FROM public.challenge_pools;

INSERT INTO public.challenge_pools (id,description,"owner",created_at) 
VALUES ('c2d07650-be2d-4e27-98fa-7d2a5d07deba'::uuid,'General Wisdom','6e0887e2-97da-40d9-a8ee-dea3cdad54f9'::uuid,'2022-01-28 21:04:33.009');
INSERT INTO public.open_questions(question_text, "owner", challenge_pool) VALUES ('Whats up?', '8e0887e2-97da-40d9-a8ee-dea3cdad54f9'::uuid, 'c2d07650-be2d-4e27-98fa-7d2a5d07deba'::uuid);
INSERT INTO public.challenge_pools (id,description,"owner",created_at) 
VALUES ('d2d07650-be2d-4e27-98fa-7d2a5d07deba'::uuid,'challenge pool for deletion','6e0887e2-97da-40d9-a8ee-dea3cdad54f9'::uuid,'2022-01-28 21:04:33.009');

INSERT INTO public.invite_codes(code, challenge_pool, "owner", valid_until) values ('GNRLWISDOM', 'c2d07650-be2d-4e27-98fa-7d2a5d07deba'::uuid, '6e0887e2-97da-40d9-a8ee-dea3cdad54f9' :: uuid,'2032-01-28 21:04:33.009');