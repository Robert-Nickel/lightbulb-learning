create view answer_performances as
select
  challenge_pool_user.id,
  answers.id as answer_id,
  answers.answer_text,
  answers.version,
  answers.created_at,
  questions.question_text
from challenge_pool_user
inner join answers on answers.owner = challenge_pool_user.user_id
inner join questions on questions.id = answers.question;