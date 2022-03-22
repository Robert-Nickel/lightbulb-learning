-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.



CREATE TABLE IF NOT EXISTS public.universities
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    created_at timestamp with time zone DEFAULT now(),
    name text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT universities_pkey PRIMARY KEY (id),
    CONSTRAINT universities_name_key UNIQUE (name)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.universities
    OWNER to postgres;

ALTER TABLE IF EXISTS public.universities
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.universities TO anon;

GRANT ALL ON TABLE public.universities TO authenticated;

GRANT ALL ON TABLE public.universities TO postgres;

GRANT ALL ON TABLE public.universities TO service_role;
CREATE POLICY uni_insert_policy_for_authenticated_user
    ON public.universities
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY uni_select_policy_for_authenticated_user
    ON public.universities
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.role() = 'authenticated'::text));

CREATE TABLE IF NOT EXISTS public.evaluations
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    course_user uuid NOT NULL,
    percentage smallint NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT evaluations_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.evaluations
    OWNER to postgres;

GRANT ALL ON TABLE public.evaluations TO anon;

GRANT ALL ON TABLE public.evaluations TO authenticated;

GRANT ALL ON TABLE public.evaluations TO postgres;

GRANT ALL ON TABLE public.evaluations TO service_role;





CREATE TABLE IF NOT EXISTS public.profiles
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    first_name text COLLATE pg_catalog."default" NOT NULL,
    last_name text COLLATE pg_catalog."default" NOT NULL,
    university uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT profiles_pkey PRIMARY KEY (id),
    CONSTRAINT profiles_university_fkey FOREIGN KEY (university)
        REFERENCES public.universities (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT profiles_user_id_fkey1 FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.profiles
    OWNER to postgres;

ALTER TABLE IF EXISTS public.profiles
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.profiles TO authenticated;

GRANT ALL ON TABLE public.profiles TO postgres;

GRANT ALL ON TABLE public.profiles TO service_role;
CREATE POLICY p_insert_policy_for_authenticated_user
    ON public.profiles
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY p_select_policy_for_owner
    ON public.profiles
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = user_id));
CREATE POLICY p_update_policy_for_owner
    ON public.profiles
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = user_id));









CREATE TABLE IF NOT EXISTS public.test_tokens
(
    id bigint NOT NULL GENERATED BY DEFAULT AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    email text COLLATE pg_catalog."default" NOT NULL,
    refresh_token text COLLATE pg_catalog."default",
    created_at timestamp with time zone DEFAULT now(),
    CONSTRAINT test_tokens_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.test_tokens
    OWNER to supabase_admin;

GRANT ALL ON TABLE public.test_tokens TO anon;

GRANT ALL ON TABLE public.test_tokens TO authenticated;

GRANT ALL ON TABLE public.test_tokens TO postgres;

GRANT ALL ON TABLE public.test_tokens TO service_role;

GRANT ALL ON TABLE public.test_tokens TO supabase_admin;

COMMENT ON TABLE public.test_tokens
    IS 'Used to sync refresh_tokens for cypress tests';

CREATE TABLE IF NOT EXISTS public.correct_open_answers
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    answer_text text COLLATE pg_catalog."default" NOT NULL,
    open_question uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    owner uuid NOT NULL,
    CONSTRAINT correct_open_answers_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.correct_open_answers
    OWNER to postgres;

ALTER TABLE IF EXISTS public.correct_open_answers
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.correct_open_answers TO anon;

GRANT ALL ON TABLE public.correct_open_answers TO authenticated;

GRANT ALL ON TABLE public.correct_open_answers TO postgres;

GRANT ALL ON TABLE public.correct_open_answers TO service_role;
CREATE POLICY coa_insert_policy_for_authenticated_user
    ON public.correct_open_answers
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY coa_select_policy_for_owner
    ON public.correct_open_answers
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = owner));





CREATE TABLE IF NOT EXISTS public.courses
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    description text COLLATE pg_catalog."default" NOT NULL,
    owner uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT challenge_pools_pkey PRIMARY KEY (id),
    CONSTRAINT challenge_pools_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.courses
    OWNER to supabase_admin;

ALTER TABLE IF EXISTS public.courses
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.courses TO anon;

GRANT ALL ON TABLE public.courses TO authenticated;

GRANT ALL ON TABLE public.courses TO postgres;

GRANT ALL ON TABLE public.courses TO service_role;

GRANT ALL ON TABLE public.courses TO supabase_admin;

--->

CREATE TABLE IF NOT EXISTS public.course_user
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    course uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT challenge_pool_user_pkey PRIMARY KEY (id),
    CONSTRAINT challenge_pool_user_user_id_fkey FOREIGN KEY (user_id)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT course_user_course_fkey FOREIGN KEY (course)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.course_user
    OWNER to supabase_admin;

ALTER TABLE IF EXISTS public.course_user
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.course_user TO anon;

GRANT ALL ON TABLE public.course_user TO authenticated;

GRANT ALL ON TABLE public.course_user TO postgres;

GRANT ALL ON TABLE public.course_user TO service_role;

GRANT ALL ON TABLE public.course_user TO supabase_admin;
CREATE POLICY cpu_delete_policy_for_user
    ON public.course_user
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = user_id));
CREATE POLICY cpu_insert_policy_for_authenticated_user
    ON public.course_user
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK (((auth.role() = 'authenticated'::text) AND (auth.uid() = user_id)));
CREATE POLICY cpu_select_policy_for_cp_member
    ON public.course_user
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = user_id));
CREATE POLICY cpu_select_policy_for_cp_owner
    ON public.course_user
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() IN ( SELECT courses.owner
   FROM courses
  WHERE (course_user.course = courses.id))));

CREATE OR REPLACE VIEW public.members
 AS
 SELECT course_user.id,
    course_user.course,
    course_user.user_id,
    profiles.first_name,
    profiles.last_name
   FROM course_user
     LEFT JOIN profiles ON course_user.user_id = profiles.user_id;

ALTER TABLE public.members
    OWNER TO postgres;

GRANT ALL ON TABLE public.members TO authenticated;
GRANT ALL ON TABLE public.members TO postgres;
GRANT ALL ON TABLE public.members TO anon;
GRANT ALL ON TABLE public.members TO service_role;

--->

CREATE POLICY c_select_policy_for_member
    ON public.courses
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() IN ( SELECT members.user_id
   FROM members
  WHERE (members.course = courses.id))));
CREATE POLICY cp_delete_policy_for_owner
    ON public.courses
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = owner));
CREATE POLICY cp_insert_policy_for_authenticated_user
    ON public.courses
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY cp_select_policy_for_owner
    ON public.courses
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = owner));



CREATE TABLE IF NOT EXISTS public.open_questions
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    course uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    question_text text COLLATE pg_catalog."default" NOT NULL,
    owner uuid NOT NULL,
    CONSTRAINT open_questions_new_pkey PRIMARY KEY (id),
    CONSTRAINT open_questions_course_fkey FOREIGN KEY (course)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT open_questions_new_challenge_pool_fkey FOREIGN KEY (course)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_questions_new_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT open_questions_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_questions
    OWNER to postgres;

ALTER TABLE IF EXISTS public.open_questions
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.open_questions TO authenticated;

GRANT ALL ON TABLE public.open_questions TO anon;

GRANT ALL ON TABLE public.open_questions TO service_role;

GRANT ALL ON TABLE public.open_questions TO postgres;
CREATE POLICY oq_insert_policy_for_authenticated_user
    ON public.open_questions
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY oq_select_policy_for_authenticated_user
    ON public.open_questions
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.role() = 'authenticated'::text));

CREATE TABLE IF NOT EXISTS public.open_answers
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    open_question uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    answer_text text COLLATE pg_catalog."default" NOT NULL,
    version bigint NOT NULL,
    owner uuid NOT NULL,
    CONSTRAINT open_answers_pkey1 PRIMARY KEY (id),
    CONSTRAINT open_answers_open_question_fkey FOREIGN KEY (open_question)
        REFERENCES public.open_questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT open_answers_open_question_fkey1 FOREIGN KEY (open_question)
        REFERENCES public.open_questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_answers_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_answers
    OWNER to postgres;

ALTER TABLE IF EXISTS public.open_answers
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.open_answers TO authenticated;

GRANT ALL ON TABLE public.open_answers TO anon;

GRANT ALL ON TABLE public.open_answers TO service_role;

GRANT ALL ON TABLE public.open_answers TO postgres;

COMMENT ON COLUMN public.open_answers.version
    IS 'Incremented for the new row if the user improves his answer.';
CREATE POLICY oa_insert_policy_for_authenticated_user
    ON public.open_answers
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY oa_select_policy_for_authenticated_user
    ON public.open_answers
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.role() = 'authenticated'::text));

CREATE TABLE IF NOT EXISTS public.open_feedback
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    open_answer uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    feedback_text text COLLATE pg_catalog."default" NOT NULL,
    owner uuid NOT NULL,
    CONSTRAINT open_feedback_pkey1 PRIMARY KEY (id),
    CONSTRAINT open_feedback_open_answer_fkey FOREIGN KEY (open_answer)
        REFERENCES public.open_answers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_feedback_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_feedback
    OWNER to postgres;

ALTER TABLE IF EXISTS public.open_feedback
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.open_feedback TO authenticated;

GRANT ALL ON TABLE public.open_feedback TO anon;

GRANT ALL ON TABLE public.open_feedback TO service_role;

GRANT ALL ON TABLE public.open_feedback TO postgres;
CREATE POLICY of_insert_policy_for_authenticated_user
    ON public.open_feedback
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY of_select_policy_for_authenticated_user
    ON public.open_feedback
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.role() = 'authenticated'::text));

CREATE TABLE IF NOT EXISTS public.open_feedback_drafts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    feedback_text text COLLATE pg_catalog."default" NOT NULL,
    open_answer uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    owner uuid NOT NULL,
    CONSTRAINT open_feedback_drafts_pkey1 PRIMARY KEY (id),
    CONSTRAINT open_feedback_drafts_open_answer_fkey FOREIGN KEY (open_answer)
        REFERENCES public.open_answers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT open_feedback_drafts_open_answer_fkey1 FOREIGN KEY (open_answer)
        REFERENCES public.open_answers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_feedback_drafts_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_feedback_drafts
    OWNER to postgres;

ALTER TABLE IF EXISTS public.open_feedback_drafts
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.open_feedback_drafts TO authenticated;

GRANT ALL ON TABLE public.open_feedback_drafts TO anon;

GRANT ALL ON TABLE public.open_feedback_drafts TO service_role;

GRANT ALL ON TABLE public.open_feedback_drafts TO postgres;
CREATE POLICY ofd_delete_policy_for_owner
    ON public.open_feedback_drafts
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = owner));
CREATE POLICY ofd_insert_policy_for_authenticated_user
    ON public.open_feedback_drafts
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY ofd_select_policy_for_owner
    ON public.open_feedback_drafts
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = owner));

CREATE TABLE IF NOT EXISTS public.topics
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    name text COLLATE pg_catalog."default" NOT NULL,
    course uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT topics_pkey PRIMARY KEY (id),
    CONSTRAINT topics_course_fkey FOREIGN KEY (course)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.topics
    OWNER to postgres;

GRANT ALL ON TABLE public.topics TO anon;

GRANT ALL ON TABLE public.topics TO authenticated;

GRANT ALL ON TABLE public.topics TO postgres;

GRANT ALL ON TABLE public.topics TO service_role;

CREATE TABLE IF NOT EXISTS public.open_question_topic
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    open_question uuid NOT NULL,
    topic uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT open_question_topic_pkey PRIMARY KEY (id),
    CONSTRAINT open_question_topic_open_question_fkey FOREIGN KEY (open_question)
        REFERENCES public.open_questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_question_topic_topic_fkey FOREIGN KEY (topic)
        REFERENCES public.topics (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_question_topic
    OWNER to postgres;

GRANT ALL ON TABLE public.open_question_topic TO anon;

GRANT ALL ON TABLE public.open_question_topic TO authenticated;

GRANT ALL ON TABLE public.open_question_topic TO postgres;

GRANT ALL ON TABLE public.open_question_topic TO service_role;

CREATE TABLE IF NOT EXISTS public.open_answer_drafts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    answer_text text COLLATE pg_catalog."default" NOT NULL,
    open_question uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    owner uuid NOT NULL,
    CONSTRAINT open_answer_drafts_pkey1 PRIMARY KEY (id),
    CONSTRAINT open_answer_drafts_open_question_fkey FOREIGN KEY (open_question)
        REFERENCES public.open_questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT open_answer_drafts_open_question_fkey1 FOREIGN KEY (open_question)
        REFERENCES public.open_questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_answer_drafts_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_answer_drafts
    OWNER to postgres;

ALTER TABLE IF EXISTS public.open_answer_drafts
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.open_answer_drafts TO authenticated;

GRANT ALL ON TABLE public.open_answer_drafts TO anon;

GRANT ALL ON TABLE public.open_answer_drafts TO service_role;

GRANT ALL ON TABLE public.open_answer_drafts TO postgres;
CREATE POLICY oad_delete_policy_for_owner
    ON public.open_answer_drafts
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = owner));
CREATE POLICY oad_insert_policy_for_authenticated_user
    ON public.open_answer_drafts
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY oad_select_policy_for_owner
    ON public.open_answer_drafts
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = owner));

CREATE TABLE IF NOT EXISTS public.open_question_likes
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    open_question uuid NOT NULL,
    owner uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT open_question_likes_pkey PRIMARY KEY (id),
    CONSTRAINT open_question_likes_open_question_fkey FOREIGN KEY (open_question)
        REFERENCES public.open_questions (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_question_likes_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_question_likes
    OWNER to postgres;

GRANT ALL ON TABLE public.open_question_likes TO anon;

GRANT ALL ON TABLE public.open_question_likes TO authenticated;

GRANT ALL ON TABLE public.open_question_likes TO postgres;

GRANT ALL ON TABLE public.open_question_likes TO service_role;

CREATE TABLE IF NOT EXISTS public.open_question_drafts
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    question_text text COLLATE pg_catalog."default" NOT NULL,
    answer_text text COLLATE pg_catalog."default",
    course uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    owner uuid NOT NULL,
    CONSTRAINT open_question_drafts_pkey1 PRIMARY KEY (id),
    CONSTRAINT open_question_drafts_challenge_pool_fkey1 FOREIGN KEY (course)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT open_question_drafts_course_fkey FOREIGN KEY (course)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT open_question_drafts_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.open_question_drafts
    OWNER to postgres;

ALTER TABLE IF EXISTS public.open_question_drafts
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.open_question_drafts TO authenticated;

GRANT ALL ON TABLE public.open_question_drafts TO anon;

GRANT ALL ON TABLE public.open_question_drafts TO service_role;

GRANT ALL ON TABLE public.open_question_drafts TO postgres;
CREATE POLICY oqd_delete_policy_for_owner
    ON public.open_question_drafts
    AS PERMISSIVE
    FOR DELETE
    TO public
    USING ((auth.uid() = owner));
CREATE POLICY oqd_insert_policy_for_authenticated_user
    ON public.open_question_drafts
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY oqd_select_policy_for_owner
    ON public.open_question_drafts
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = owner));
CREATE POLICY oqd_update_policy_for_owner
    ON public.open_question_drafts
    AS PERMISSIVE
    FOR UPDATE
    TO public
    USING ((auth.uid() = owner));

CREATE TABLE IF NOT EXISTS public.invite_codes
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    code text COLLATE pg_catalog."default" NOT NULL,
    course uuid NOT NULL,
    owner uuid NOT NULL,
    valid_until timestamp without time zone NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT invite_codes_pkey PRIMARY KEY (id),
    CONSTRAINT invite_codes_course_fkey FOREIGN KEY (course)
        REFERENCES public.courses (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT invite_codes_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.invite_codes
    OWNER to postgres;

ALTER TABLE IF EXISTS public.invite_codes
    ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.invite_codes TO authenticated;

GRANT ALL ON TABLE public.invite_codes TO anon;

GRANT ALL ON TABLE public.invite_codes TO service_role;

GRANT ALL ON TABLE public.invite_codes TO postgres;
CREATE POLICY ic_insert_policy_for_authenticated_user
    ON public.invite_codes
    AS PERMISSIVE
    FOR INSERT
    TO public
    WITH CHECK ((auth.role() = 'authenticated'::text));
CREATE POLICY ic_select_policy_for_owner
    ON public.invite_codes
    AS PERMISSIVE
    FOR SELECT
    TO public
    USING ((auth.uid() = owner));



CREATE OR REPLACE VIEW public.open_answer_performances
 AS
 SELECT course_user.id,
    open_answers.id AS open_answer_id,
    open_answers.answer_text,
    open_answers.version,
    open_answers.created_at,
    open_questions.question_text
   FROM course_user
     JOIN open_answers ON open_answers.owner = course_user.user_id
     JOIN open_questions ON open_questions.id = open_answers.open_question;

ALTER TABLE public.open_answer_performances
    OWNER TO supabase_admin;

GRANT ALL ON TABLE public.open_answer_performances TO anon;
GRANT ALL ON TABLE public.open_answer_performances TO postgres;
GRANT ALL ON TABLE public.open_answer_performances TO supabase_admin;
GRANT ALL ON TABLE public.open_answer_performances TO authenticated;
GRANT ALL ON TABLE public.open_answer_performances TO service_role;

CREATE OR REPLACE VIEW public.open_feedback_performances
 AS
 SELECT course_user.id,
    open_feedback.id AS open_feedback_id,
    open_feedback.feedback_text,
    open_feedback.created_at,
    open_answers.answer_text,
    open_questions.question_text
   FROM course_user
     JOIN open_feedback ON open_feedback.owner = course_user.user_id
     JOIN open_answers ON open_answers.id = open_feedback.open_answer
     JOIN open_questions ON open_questions.id = open_answers.open_question;

ALTER TABLE public.open_feedback_performances
    OWNER TO supabase_admin;

GRANT ALL ON TABLE public.open_feedback_performances TO anon;
GRANT ALL ON TABLE public.open_feedback_performances TO postgres;
GRANT ALL ON TABLE public.open_feedback_performances TO supabase_admin;
GRANT ALL ON TABLE public.open_feedback_performances TO authenticated;
GRANT ALL ON TABLE public.open_feedback_performances TO service_role;

CREATE OR REPLACE VIEW public.open_question_performances
 AS
 SELECT course_user.id,
    open_questions.id AS open_question_id,
    open_questions.question_text,
    correct_open_answers.answer_text,
    open_questions.created_at,
    ( SELECT count(*) AS count
           FROM open_question_likes
          WHERE open_question_likes.open_question = open_questions.id) AS likes
   FROM course_user
     JOIN open_questions ON open_questions.owner = course_user.user_id
     JOIN correct_open_answers ON correct_open_answers.open_question = open_questions.id;

ALTER TABLE public.open_question_performances
    OWNER TO supabase_admin;

GRANT ALL ON TABLE public.open_question_performances TO anon;
GRANT ALL ON TABLE public.open_question_performances TO postgres;
GRANT ALL ON TABLE public.open_question_performances TO supabase_admin;
GRANT ALL ON TABLE public.open_question_performances TO authenticated;
GRANT ALL ON TABLE public.open_question_performances TO service_role;

CREATE OR REPLACE FUNCTION public.join_course(
	invite_code_input text,
	user_id_input uuid)
    RETURNS text
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE SECURITY DEFINER PARALLEL UNSAFE
AS $BODY$
  declare
    course_id uuid;
    invite_code_valid_until timestamp;
  begin
    select course, valid_until
    into course_id, invite_code_valid_until
    from invite_codes
    where code = invite_code_input;
    
    if invite_code_valid_until < now() then
      -- TODO: raise an exception
      return 'false';
    end if;

    -- TODO: prevent duplicates in course_user ->  raise an exception

    insert into course_user(course, user_id)
    values (course_id, user_id_input);
    return course_id::text;
  end;
$BODY$;

ALTER FUNCTION public.join_course(text, uuid)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.join_course(text, uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.join_course(text, uuid) TO anon;

GRANT EXECUTE ON FUNCTION public.join_course(text, uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.join_course(text, uuid) TO postgres;

GRANT EXECUTE ON FUNCTION public.join_course(text, uuid) TO service_role;

CREATE OR REPLACE FUNCTION public.fetch_my_courses(
	user_id_input uuid)
    RETURNS TABLE(id uuid, description text, owner uuid, created_ad timestamp without time zone) 
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

ALTER FUNCTION public.fetch_my_courses(uuid)
    OWNER TO postgres;

GRANT EXECUTE ON FUNCTION public.fetch_my_courses(uuid) TO PUBLIC;

GRANT EXECUTE ON FUNCTION public.fetch_my_courses(uuid) TO anon;

GRANT EXECUTE ON FUNCTION public.fetch_my_courses(uuid) TO authenticated;

GRANT EXECUTE ON FUNCTION public.fetch_my_courses(uuid) TO postgres;

GRANT EXECUTE ON FUNCTION public.fetch_my_courses(uuid) TO service_role;