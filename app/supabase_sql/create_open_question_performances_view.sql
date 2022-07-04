create view question_performances as
select
  course_user.id,
  questions.id as question_id,
  questions.question_text,
  questions.created_at,
  (select count(*) from question_likes where question = questions.id) as likes
from course_user
inner join questions on questions.owner = course_user.user_id 
