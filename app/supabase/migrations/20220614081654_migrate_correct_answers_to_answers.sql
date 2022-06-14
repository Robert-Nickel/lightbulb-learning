INSERT INTO open_answers (id, answer_text, version, created_at, owner, open_question)
SELECT id, answer_text, 1, created_at, owner, open_question
FROM correct_open_answers
WHERE EXISTS(SELECT 
                id
            FROM 
                open_questions 
            WHERE 
                id = correct_open_answers.open_question);

create view open_question_performances as
select
  course_user.id,
  open_questions.id as open_question_id,
  open_questions.question_text,
  correct_open_answers.answer_text,
  open_questions.created_at,
  (select count(*) from open_question_likes where open_question = open_questions.id) as likes
from course_user
inner join open_questions on open_questions.owner = course_user.user_id;

DROP TABLE correct_open_answers;