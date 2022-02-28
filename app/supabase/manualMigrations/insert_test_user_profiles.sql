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
    ),(
        'Student 2',
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
                email = 'll-student2@discardmail.com'
        )
    );