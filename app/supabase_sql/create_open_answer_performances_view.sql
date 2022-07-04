create view answer_performances as
select
  course_user.id,
  answers.id as answer_id,
  answers.answer_text,
  answers.version,
  answers.created_at,
  questions.question_text
from course_user
inner join answers on answers.owner = course_user.user_id
inner join questions on questions.id = answers.question;