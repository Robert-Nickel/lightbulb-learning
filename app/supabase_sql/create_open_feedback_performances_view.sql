create view open_feedback_performances as
select
  challenge_pool_user.id,
  open_feedback.id as open_feedback_id,
  open_feedback.feedback_text,
  open_feedback.created_at,
  answers.answer_text,
  questions.question_text
from challenge_pool_user
inner join open_feedback on open_feedback.owner = challenge_pool_user.user_id
inner join answers on answers.id = open_feedback.answer
inner join questions on questions.id = answers.question;