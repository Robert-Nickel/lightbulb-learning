DROP FUNCTION public.fetch_my_courses;

CREATE OR REPLACE FUNCTION public.fetch_my_courses(
	user_id_input uuid)
    RETURNS TABLE(id uuid, title text, owner uuid, created_ad timestamp without time zone) 
    LANGUAGE 'sql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
  select *
  from courses
  where owner = user_id_input
  or id in (
    select course
    from course_user
    where user_id = user_id_input
  );
$BODY$;