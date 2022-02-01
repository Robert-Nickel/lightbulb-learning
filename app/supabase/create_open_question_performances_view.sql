create view open_question_performances as
select
  challenge_pool_user.id,
  open_questions.id as open_question_id,
  open_questions.question_text,
  correct_open_answers.answer_text,
  open_questions.created_at
from challenge_pool_user
inner join open_questions on open_questions.owner = challenge_pool_user.user_id 
inner join correct_open_answers on correct_open_answers.open_question = open_questions.id;