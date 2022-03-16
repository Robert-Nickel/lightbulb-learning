create view open_answer_performances as
select
  challenge_pool_user.id,
  open_answers.id as open_answer_id,
  open_answers.answer_text,
  open_answers.version,
  open_answers.created_at,
  open_questions.question_text
from challenge_pool_user
inner join open_answers on open_answers.owner = challenge_pool_user.user_id
inner join open_questions on open_questions.id = open_answers.open_question;