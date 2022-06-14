create view question_performances as
select
  challenge_pool_user.id,
  questions.id as question_id,
  questions.question_text,
  correct_answers.answer_text,
  questions.created_at,
  (select count(*) from question_likes where question = questions.id) as likes
from challenge_pool_user
inner join questions on questions.owner = challenge_pool_user.user_id 
inner join correct_answers on correct_answers.question = questions.id
