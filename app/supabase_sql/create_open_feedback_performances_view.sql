create view feedback_performances as
select
  challenge_pool_user.id,
  feedback.id as feedback_id,
  feedback.feedback_text,
  feedback.created_at,
  answers.answer_text,
  questions.question_text
from challenge_pool_user
inner join feedback on feedback.owner = challenge_pool_user.user_id
inner join answers on answers.id = feedback.answer
inner join questions on questions.id = answers.question;