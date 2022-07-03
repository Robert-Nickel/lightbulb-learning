-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

REVOKE ALL ON TABLE public.feedback FROM anon;
REVOKE ALL ON TABLE public.feedback FROM postgres;
REVOKE ALL ON TABLE public.feedback FROM service_role;
GRANT ALL ON TABLE public.feedback TO anon;

GRANT ALL ON TABLE public.feedback TO service_role;

GRANT ALL ON TABLE public.feedback TO postgres;

REVOKE ALL ON TABLE public.course_user FROM anon;
REVOKE ALL ON TABLE public.course_user FROM authenticated;
REVOKE ALL ON TABLE public.course_user FROM postgres;
REVOKE ALL ON TABLE public.course_user FROM service_role;
REVOKE ALL ON TABLE public.course_user FROM supabase_admin;
GRANT ALL ON TABLE public.course_user TO supabase_admin;

GRANT ALL ON TABLE public.course_user TO authenticated;

GRANT ALL ON TABLE public.course_user TO anon;

GRANT ALL ON TABLE public.course_user TO postgres;

GRANT ALL ON TABLE public.course_user TO service_role;

REVOKE ALL ON TABLE public.profiles FROM anon;
REVOKE ALL ON TABLE public.profiles FROM postgres;
REVOKE ALL ON TABLE public.profiles FROM service_role;
GRANT ALL ON TABLE public.profiles TO anon;

GRANT ALL ON TABLE public.profiles TO service_role;

GRANT ALL ON TABLE public.profiles TO postgres;

REVOKE ALL ON TABLE public.answer_likes FROM anon;
REVOKE ALL ON TABLE public.answer_likes FROM postgres;
REVOKE ALL ON TABLE public.answer_likes FROM service_role;
GRANT ALL ON TABLE public.answer_likes TO anon;

GRANT ALL ON TABLE public.answer_likes TO service_role;

GRANT ALL ON TABLE public.answer_likes TO postgres;

REVOKE ALL ON TABLE public.question_topic FROM anon;
REVOKE ALL ON TABLE public.question_topic FROM postgres;
REVOKE ALL ON TABLE public.question_topic FROM service_role;
GRANT ALL ON TABLE public.question_topic TO anon;

GRANT ALL ON TABLE public.question_topic TO service_role;

GRANT ALL ON TABLE public.question_topic TO postgres;

REVOKE ALL ON TABLE public.answers FROM anon;
REVOKE ALL ON TABLE public.answers FROM postgres;
REVOKE ALL ON TABLE public.answers FROM service_role;
GRANT ALL ON TABLE public.answers TO anon;

GRANT ALL ON TABLE public.answers TO service_role;

GRANT ALL ON TABLE public.answers TO postgres;

REVOKE ALL ON TABLE public.question_likes FROM anon;
REVOKE ALL ON TABLE public.question_likes FROM postgres;
REVOKE ALL ON TABLE public.question_likes FROM service_role;
GRANT ALL ON TABLE public.question_likes TO anon;

GRANT ALL ON TABLE public.question_likes TO service_role;

GRANT ALL ON TABLE public.question_likes TO postgres;