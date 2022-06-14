create view open_feedback_performances as
select
  challenge_pool_user.id,
  open_feedback.id as open_feedback_id,
  open_feedback.feedback_text,
  open_feedback.created_at,
  open_answers.answer_text,
  questions.question_text
from challenge_pool_user
inner join open_feedback on open_feedback.owner = challenge_pool_user.user_id
inner join open_answers on open_answers.id = open_feedback.open_answer
inner join questions on questions.id = open_answers.question;