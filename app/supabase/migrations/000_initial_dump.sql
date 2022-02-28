--
-- PostgreSQL database dump
--
-- Dumped from database version 14.1
-- Dumped by pg_dump version 14.1
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--
ALTER SCHEMA public OWNER TO postgres;
--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--
COMMENT ON SCHEMA public IS 'standard public schema';
--
-- Name: fetch_my_challenge_pools(uuid); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION public.fetch_my_challenge_pools(user_id_input uuid) RETURNS TABLE(id uuid, description text, owner uuid, created_ad timestamp without time zone)
    LANGUAGE sql SECURITY DEFINER
    AS $$
  select *
  from challenge_pools
  where owner = user_id_input
  or id in (
    select challenge_pool
    from challenge_pool_user
    where user_id = user_id_input
  );
$$;
ALTER FUNCTION public.fetch_my_challenge_pools(user_id_input uuid) OWNER TO postgres;
--
-- Name: join_challenge_pool(text, uuid); Type: FUNCTION; Schema: public; Owner: postgres
--
CREATE FUNCTION public.join_challenge_pool(invite_code_input text, user_id_input uuid) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
  declare
    challenge_pool_id uuid;
    invite_code_valid_until timestamp;
  begin
    select challenge_pool, valid_until
    into challenge_pool_id, invite_code_valid_until
    from invite_codes
    where code = invite_code_input;
    if invite_code_valid_until < now() then
      -- TODO: raise an exception
      return 'false';
    end if;
    -- TODO: prevent duplicates in challenge_pool_user ->  raise an exception
    insert into challenge_pool_user(challenge_pool, user_id)
    values (challenge_pool_id, user_id_input);
    return challenge_pool_id::text;
  end;
$$;
ALTER FUNCTION public.join_challenge_pool(invite_code_input text, user_id_input uuid) OWNER TO postgres;
SET default_tablespace = '';
SET default_table_access_method = heap;
--
-- Name: challenge_pool_user; Type: TABLE; Schema: public; Owner: supabase_admin
--
CREATE TABLE public.challenge_pool_user (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    challenge_pool uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.challenge_pool_user OWNER TO supabase_admin;
--
-- Name: challenge_pools; Type: TABLE; Schema: public; Owner: supabase_admin
--
CREATE TABLE public.challenge_pools (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    description text NOT NULL,
    owner uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.challenge_pools OWNER TO supabase_admin;
--
-- Name: correct_open_answers; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.correct_open_answers (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    answer_text text NOT NULL,
    open_question uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL
);
ALTER TABLE public.correct_open_answers OWNER TO postgres;
--
-- Name: invite_codes; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.invite_codes (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    code text NOT NULL,
    challenge_pool uuid NOT NULL,
    owner uuid NOT NULL,
    valid_until timestamp without time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.invite_codes OWNER TO postgres;
--
-- Name: profiles; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.profiles (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    university uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
ALTER TABLE public.profiles OWNER TO postgres;
--
-- Name: members; Type: VIEW; Schema: public; Owner: supabase_admin
--
CREATE VIEW public.members AS
 SELECT challenge_pool_user.id,
    challenge_pool_user.challenge_pool,
    challenge_pool_user.user_id,
    profiles.first_name,
    profiles.last_name
   FROM (public.challenge_pool_user
     LEFT JOIN public.profiles ON ((challenge_pool_user.user_id = profiles.user_id)));
ALTER TABLE public.members OWNER TO supabase_admin;
--
-- Name: open_answer_drafts; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.open_answer_drafts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    answer_text text NOT NULL,
    open_question uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL
);
ALTER TABLE public.open_answer_drafts OWNER TO postgres;
--
-- Name: open_answers; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.open_answers (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    open_question uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    answer_text text NOT NULL,
    version bigint NOT NULL,
    owner uuid NOT NULL
);
ALTER TABLE public.open_answers OWNER TO postgres;
--
-- Name: COLUMN open_answers.version; Type: COMMENT; Schema: public; Owner: postgres
--
COMMENT ON COLUMN public.open_answers.version IS 'Incremented for the new row if the user improves his answer.';
--
-- Name: open_questions; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.open_questions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    challenge_pool uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    question_text text NOT NULL,
    owner uuid NOT NULL
);
ALTER TABLE public.open_questions OWNER TO postgres;
--
-- Name: open_answer_performances; Type: VIEW; Schema: public; Owner: supabase_admin
--
CREATE VIEW public.open_answer_performances AS
 SELECT challenge_pool_user.id,
    open_answers.id AS open_answer_id,
    open_answers.answer_text,
    open_answers.version,
    open_answers.created_at,
    open_questions.question_text
   FROM ((public.challenge_pool_user
     JOIN public.open_answers ON ((open_answers.owner = challenge_pool_user.user_id)))
     JOIN public.open_questions ON ((open_questions.id = open_answers.open_question)));
ALTER TABLE public.open_answer_performances OWNER TO supabase_admin;
--
-- Name: open_feedback; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.open_feedback (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    open_answer uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    feedback_text text NOT NULL,
    owner uuid NOT NULL
);
ALTER TABLE public.open_feedback OWNER TO postgres;
--
-- Name: open_feedback_drafts; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.open_feedback_drafts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    feedback_text text NOT NULL,
    open_answer uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL
);
ALTER TABLE public.open_feedback_drafts OWNER TO postgres;
--
-- Name: open_feedback_performances; Type: VIEW; Schema: public; Owner: supabase_admin
--
CREATE VIEW public.open_feedback_performances AS
 SELECT challenge_pool_user.id,
    open_feedback.id AS open_feedback_id,
    open_feedback.feedback_text,
    open_feedback.created_at,
    open_answers.answer_text,
    open_questions.question_text
   FROM (((public.challenge_pool_user
     JOIN public.open_feedback ON ((open_feedback.owner = challenge_pool_user.user_id)))
     JOIN public.open_answers ON ((open_answers.id = open_feedback.open_answer)))
     JOIN public.open_questions ON ((open_questions.id = open_answers.open_question)));
ALTER TABLE public.open_feedback_performances OWNER TO supabase_admin;
--
-- Name: open_question_drafts; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.open_question_drafts (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    question_text text NOT NULL,
    answer_text text,
    challenge_pool uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    owner uuid NOT NULL
);
ALTER TABLE public.open_question_drafts OWNER TO postgres;
--
-- Name: open_question_performances; Type: VIEW; Schema: public; Owner: supabase_admin
--
CREATE VIEW public.open_question_performances AS
 SELECT challenge_pool_user.id,
    open_questions.id AS open_question_id,
    open_questions.question_text,
    correct_open_answers.answer_text,
    open_questions.created_at
   FROM ((public.challenge_pool_user
     JOIN public.open_questions ON ((open_questions.owner = challenge_pool_user.user_id)))
     JOIN public.correct_open_answers ON ((correct_open_answers.open_question = open_questions.id)));
ALTER TABLE public.open_question_performances OWNER TO supabase_admin;
--
-- Name: test_tokens; Type: TABLE; Schema: public; Owner: supabase_admin
--
CREATE TABLE public.test_tokens (
    id bigint NOT NULL,
    email text NOT NULL,
    refresh_token text,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.test_tokens OWNER TO supabase_admin;
--
-- Name: TABLE test_tokens; Type: COMMENT; Schema: public; Owner: supabase_admin
--
COMMENT ON TABLE public.test_tokens IS 'Used to sync refresh_tokens for cypress tests';
--
-- Name: test_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: supabase_admin
--
ALTER TABLE public.test_tokens ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.test_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);
--
-- Name: universities; Type: TABLE; Schema: public; Owner: postgres
--
CREATE TABLE public.universities (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    name text NOT NULL
);
ALTER TABLE public.universities OWNER TO postgres;
--
-- Name: challenge_pool_user challenge_pool_user_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--
ALTER TABLE ONLY public.challenge_pool_user
    ADD CONSTRAINT challenge_pool_user_pkey PRIMARY KEY (id);
--
-- Name: challenge_pools challenge_pools_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--
ALTER TABLE ONLY public.challenge_pools
    ADD CONSTRAINT challenge_pools_pkey PRIMARY KEY (id);
--
-- Name: correct_open_answers correct_open_answers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.correct_open_answers
    ADD CONSTRAINT correct_open_answers_pkey PRIMARY KEY (id);
--
-- Name: invite_codes invite_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_pkey PRIMARY KEY (id);
--
-- Name: open_answer_drafts open_answer_drafts_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answer_drafts
    ADD CONSTRAINT open_answer_drafts_pkey1 PRIMARY KEY (id);
--
-- Name: open_answers open_answers_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answers
    ADD CONSTRAINT open_answers_pkey1 PRIMARY KEY (id);
--
-- Name: open_feedback_drafts open_feedback_drafts_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_feedback_drafts
    ADD CONSTRAINT open_feedback_drafts_pkey1 PRIMARY KEY (id);
--
-- Name: open_feedback open_feedback_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_feedback
    ADD CONSTRAINT open_feedback_pkey1 PRIMARY KEY (id);
--
-- Name: open_question_drafts open_question_drafts_pkey1; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_question_drafts
    ADD CONSTRAINT open_question_drafts_pkey1 PRIMARY KEY (id);
--
-- Name: open_questions open_questions_new_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_questions
    ADD CONSTRAINT open_questions_new_pkey PRIMARY KEY (id);
--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);
--
-- Name: test_tokens test_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: supabase_admin
--
ALTER TABLE ONLY public.test_tokens
    ADD CONSTRAINT test_tokens_pkey PRIMARY KEY (id);
--
-- Name: universities universities_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_name_key UNIQUE (name);
--
-- Name: universities universities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.universities
    ADD CONSTRAINT universities_pkey PRIMARY KEY (id);
--
-- Name: challenge_pool_user challenge_pool_user_challenge_pool_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--
ALTER TABLE ONLY public.challenge_pool_user
    ADD CONSTRAINT challenge_pool_user_challenge_pool_fkey FOREIGN KEY (challenge_pool) REFERENCES public.challenge_pools(id) ON DELETE CASCADE;
--
-- Name: challenge_pool_user challenge_pool_user_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--
ALTER TABLE ONLY public.challenge_pool_user
    ADD CONSTRAINT challenge_pool_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
--
-- Name: challenge_pools challenge_pools_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: supabase_admin
--
ALTER TABLE ONLY public.challenge_pools
    ADD CONSTRAINT challenge_pools_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: invite_codes invite_codes_challenge_pool_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_challenge_pool_fkey FOREIGN KEY (challenge_pool) REFERENCES public.challenge_pools(id) ON DELETE CASCADE;
--
-- Name: invite_codes invite_codes_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.invite_codes
    ADD CONSTRAINT invite_codes_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id) ON DELETE CASCADE;
--
-- Name: open_answer_drafts open_answer_drafts_open_question_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answer_drafts
    ADD CONSTRAINT open_answer_drafts_open_question_fkey FOREIGN KEY (open_question) REFERENCES public.open_questions(id);
--
-- Name: open_answer_drafts open_answer_drafts_open_question_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answer_drafts
    ADD CONSTRAINT open_answer_drafts_open_question_fkey1 FOREIGN KEY (open_question) REFERENCES public.open_questions(id) ON DELETE CASCADE;
--
-- Name: open_answer_drafts open_answer_drafts_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answer_drafts
    ADD CONSTRAINT open_answer_drafts_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: open_answers open_answers_open_question_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answers
    ADD CONSTRAINT open_answers_open_question_fkey FOREIGN KEY (open_question) REFERENCES public.open_questions(id);
--
-- Name: open_answers open_answers_open_question_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answers
    ADD CONSTRAINT open_answers_open_question_fkey1 FOREIGN KEY (open_question) REFERENCES public.open_questions(id) ON DELETE CASCADE;
--
-- Name: open_answers open_answers_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_answers
    ADD CONSTRAINT open_answers_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: open_feedback_drafts open_feedback_drafts_open_answer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_feedback_drafts
    ADD CONSTRAINT open_feedback_drafts_open_answer_fkey FOREIGN KEY (open_answer) REFERENCES public.open_answers(id);
--
-- Name: open_feedback_drafts open_feedback_drafts_open_answer_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_feedback_drafts
    ADD CONSTRAINT open_feedback_drafts_open_answer_fkey1 FOREIGN KEY (open_answer) REFERENCES public.open_answers(id) ON DELETE CASCADE;
--
-- Name: open_feedback_drafts open_feedback_drafts_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_feedback_drafts
    ADD CONSTRAINT open_feedback_drafts_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: open_feedback open_feedback_open_answer_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_feedback
    ADD CONSTRAINT open_feedback_open_answer_fkey FOREIGN KEY (open_answer) REFERENCES public.open_answers(id) ON DELETE CASCADE;
--
-- Name: open_feedback open_feedback_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_feedback
    ADD CONSTRAINT open_feedback_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: open_question_drafts open_question_drafts_challenge_pool_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_question_drafts
    ADD CONSTRAINT open_question_drafts_challenge_pool_fkey FOREIGN KEY (challenge_pool) REFERENCES public.challenge_pools(id);
--
-- Name: open_question_drafts open_question_drafts_challenge_pool_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_question_drafts
    ADD CONSTRAINT open_question_drafts_challenge_pool_fkey1 FOREIGN KEY (challenge_pool) REFERENCES public.challenge_pools(id) ON DELETE CASCADE;
--
-- Name: open_question_drafts open_question_drafts_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_question_drafts
    ADD CONSTRAINT open_question_drafts_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: open_questions open_questions_challenge_pool_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_questions
    ADD CONSTRAINT open_questions_challenge_pool_fkey FOREIGN KEY (challenge_pool) REFERENCES public.challenge_pools(id);
--
-- Name: open_questions open_questions_new_challenge_pool_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_questions
    ADD CONSTRAINT open_questions_new_challenge_pool_fkey FOREIGN KEY (challenge_pool) REFERENCES public.challenge_pools(id) ON DELETE CASCADE;
--
-- Name: open_questions open_questions_new_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_questions
    ADD CONSTRAINT open_questions_new_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: open_questions open_questions_owner_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.open_questions
    ADD CONSTRAINT open_questions_owner_fkey FOREIGN KEY (owner) REFERENCES auth.users(id);
--
-- Name: profiles profiles_university_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_university_fkey FOREIGN KEY (university) REFERENCES public.universities(id) ON DELETE CASCADE;
--
-- Name: profiles profiles_user_id_fkey1; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--
ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_user_id_fkey1 FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
--
-- Name: challenge_pool_user; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--
ALTER TABLE public.challenge_pool_user ENABLE ROW LEVEL SECURITY;
--
-- Name: challenge_pools; Type: ROW SECURITY; Schema: public; Owner: supabase_admin
--
ALTER TABLE public.challenge_pools ENABLE ROW LEVEL SECURITY;
--
-- Name: correct_open_answers coa_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY coa_insert_policy_for_authenticated_user ON public.correct_open_answers FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: correct_open_answers coa_select_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY coa_select_policy_for_owner ON public.correct_open_answers FOR SELECT USING ((auth.uid() = owner));
--
-- Name: correct_open_answers; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.correct_open_answers ENABLE ROW LEVEL SECURITY;
--
-- Name: challenge_pools cp_delete_policy_for_owner; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cp_delete_policy_for_owner ON public.challenge_pools FOR DELETE USING ((auth.uid() = owner));
--
-- Name: challenge_pools cp_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cp_insert_policy_for_authenticated_user ON public.challenge_pools FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: challenge_pools cp_select_policy_for_member; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cp_select_policy_for_member ON public.challenge_pools FOR SELECT USING ((auth.uid() IN ( SELECT members.user_id
   FROM public.members
  WHERE (members.challenge_pool = challenge_pools.id))));
--
-- Name: challenge_pools cp_select_policy_for_owner; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cp_select_policy_for_owner ON public.challenge_pools FOR SELECT USING ((auth.uid() = owner));
--
-- Name: challenge_pool_user cpu_delete_policy_for_user; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cpu_delete_policy_for_user ON public.challenge_pool_user FOR DELETE USING ((auth.uid() = user_id));
--
-- Name: challenge_pool_user cpu_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cpu_insert_policy_for_authenticated_user ON public.challenge_pool_user FOR INSERT WITH CHECK (((auth.role() = 'authenticated'::text) AND (auth.uid() = user_id)));
--
-- Name: challenge_pool_user cpu_select_policy_for_cp_member; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cpu_select_policy_for_cp_member ON public.challenge_pool_user FOR SELECT USING ((auth.uid() = user_id));
--
-- Name: challenge_pool_user cpu_select_policy_for_cp_owner; Type: POLICY; Schema: public; Owner: supabase_admin
--
CREATE POLICY cpu_select_policy_for_cp_owner ON public.challenge_pool_user FOR SELECT USING ((auth.uid() IN ( SELECT challenge_pools.owner
   FROM public.challenge_pools
  WHERE (challenge_pool_user.challenge_pool = challenge_pools.id))));
--
-- Name: invite_codes ic_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY ic_insert_policy_for_authenticated_user ON public.invite_codes FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: invite_codes ic_select_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY ic_select_policy_for_owner ON public.invite_codes FOR SELECT USING ((auth.uid() = owner));
--
-- Name: invite_codes; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.invite_codes ENABLE ROW LEVEL SECURITY;
--
-- Name: open_answers oa_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oa_insert_policy_for_authenticated_user ON public.open_answers FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: open_answers oa_select_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oa_select_policy_for_authenticated_user ON public.open_answers FOR SELECT USING ((auth.role() = 'authenticated'::text));
--
-- Name: open_answer_drafts oad_delete_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oad_delete_policy_for_owner ON public.open_answer_drafts FOR DELETE USING ((auth.uid() = owner));
--
-- Name: open_answer_drafts oad_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oad_insert_policy_for_authenticated_user ON public.open_answer_drafts FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: open_answer_drafts oad_select_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oad_select_policy_for_owner ON public.open_answer_drafts FOR SELECT USING ((auth.uid() = owner));
--
-- Name: open_feedback of_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY of_insert_policy_for_authenticated_user ON public.open_feedback FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: open_feedback of_select_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY of_select_policy_for_authenticated_user ON public.open_feedback FOR SELECT USING ((auth.role() = 'authenticated'::text));
--
-- Name: open_feedback_drafts ofd_delete_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY ofd_delete_policy_for_owner ON public.open_feedback_drafts FOR DELETE USING ((auth.uid() = owner));
--
-- Name: open_feedback_drafts ofd_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY ofd_insert_policy_for_authenticated_user ON public.open_feedback_drafts FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: open_feedback_drafts ofd_select_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY ofd_select_policy_for_owner ON public.open_feedback_drafts FOR SELECT USING ((auth.uid() = owner));
--
-- Name: open_answer_drafts; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.open_answer_drafts ENABLE ROW LEVEL SECURITY;
--
-- Name: open_answers; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.open_answers ENABLE ROW LEVEL SECURITY;
--
-- Name: open_feedback; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.open_feedback ENABLE ROW LEVEL SECURITY;
--
-- Name: open_feedback_drafts; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.open_feedback_drafts ENABLE ROW LEVEL SECURITY;
--
-- Name: open_question_drafts; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.open_question_drafts ENABLE ROW LEVEL SECURITY;
--
-- Name: open_questions; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.open_questions ENABLE ROW LEVEL SECURITY;
--
-- Name: open_questions oq_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oq_insert_policy_for_authenticated_user ON public.open_questions FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: open_questions oq_select_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oq_select_policy_for_authenticated_user ON public.open_questions FOR SELECT USING ((auth.role() = 'authenticated'::text));
--
-- Name: open_question_drafts oqd_delete_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oqd_delete_policy_for_owner ON public.open_question_drafts FOR DELETE USING ((auth.uid() = owner));
--
-- Name: open_question_drafts oqd_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oqd_insert_policy_for_authenticated_user ON public.open_question_drafts FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: open_question_drafts oqd_select_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oqd_select_policy_for_owner ON public.open_question_drafts FOR SELECT USING ((auth.uid() = owner));
--
-- Name: open_question_drafts oqd_update_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY oqd_update_policy_for_owner ON public.open_question_drafts FOR UPDATE USING ((auth.uid() = owner));
--
-- Name: profiles p_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY p_insert_policy_for_authenticated_user ON public.profiles FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: profiles p_select_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY p_select_policy_for_owner ON public.profiles FOR SELECT USING ((auth.uid() = user_id));
--
-- Name: profiles p_update_policy_for_owner; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY p_update_policy_for_owner ON public.profiles FOR UPDATE USING ((auth.uid() = user_id));
--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
--
-- Name: universities uni_insert_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY uni_insert_policy_for_authenticated_user ON public.universities FOR INSERT WITH CHECK ((auth.role() = 'authenticated'::text));
--
-- Name: universities uni_select_policy_for_authenticated_user; Type: POLICY; Schema: public; Owner: postgres
--
CREATE POLICY uni_select_policy_for_authenticated_user ON public.universities FOR SELECT USING ((auth.role() = 'authenticated'::text));
--
-- Name: universities; Type: ROW SECURITY; Schema: public; Owner: postgres
--
ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;
--
-- Name: FUNCTION fetch_my_challenge_pools(user_id_input uuid); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION public.fetch_my_challenge_pools(user_id_input uuid) TO anon;
GRANT ALL ON FUNCTION public.fetch_my_challenge_pools(user_id_input uuid) TO authenticated;
GRANT ALL ON FUNCTION public.fetch_my_challenge_pools(user_id_input uuid) TO service_role;
--
-- Name: FUNCTION join_challenge_pool(invite_code_input text, user_id_input uuid); Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON FUNCTION public.join_challenge_pool(invite_code_input text, user_id_input uuid) TO anon;
GRANT ALL ON FUNCTION public.join_challenge_pool(invite_code_input text, user_id_input uuid) TO authenticated;
GRANT ALL ON FUNCTION public.join_challenge_pool(invite_code_input text, user_id_input uuid) TO service_role;
--
-- Name: TABLE challenge_pool_user; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON TABLE public.challenge_pool_user TO postgres;
GRANT ALL ON TABLE public.challenge_pool_user TO anon;
GRANT ALL ON TABLE public.challenge_pool_user TO authenticated;
GRANT ALL ON TABLE public.challenge_pool_user TO service_role;
--
-- Name: TABLE challenge_pools; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON TABLE public.challenge_pools TO postgres;
GRANT ALL ON TABLE public.challenge_pools TO anon;
GRANT ALL ON TABLE public.challenge_pools TO authenticated;
GRANT ALL ON TABLE public.challenge_pools TO service_role;
--
-- Name: TABLE correct_open_answers; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.correct_open_answers TO anon;
GRANT ALL ON TABLE public.correct_open_answers TO authenticated;
GRANT ALL ON TABLE public.correct_open_answers TO service_role;
--
-- Name: TABLE invite_codes; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.invite_codes TO anon;
GRANT ALL ON TABLE public.invite_codes TO authenticated;
GRANT ALL ON TABLE public.invite_codes TO service_role;
--
-- Name: TABLE profiles; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.profiles TO anon;
GRANT ALL ON TABLE public.profiles TO authenticated;
GRANT ALL ON TABLE public.profiles TO service_role;
--
-- Name: TABLE members; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON TABLE public.members TO postgres;
GRANT ALL ON TABLE public.members TO anon;
GRANT ALL ON TABLE public.members TO authenticated;
GRANT ALL ON TABLE public.members TO service_role;
--
-- Name: TABLE open_answer_drafts; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.open_answer_drafts TO anon;
GRANT ALL ON TABLE public.open_answer_drafts TO authenticated;
GRANT ALL ON TABLE public.open_answer_drafts TO service_role;
--
-- Name: TABLE open_answers; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.open_answers TO anon;
GRANT ALL ON TABLE public.open_answers TO authenticated;
GRANT ALL ON TABLE public.open_answers TO service_role;
--
-- Name: TABLE open_questions; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.open_questions TO anon;
GRANT ALL ON TABLE public.open_questions TO authenticated;
GRANT ALL ON TABLE public.open_questions TO service_role;
--
-- Name: TABLE open_answer_performances; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON TABLE public.open_answer_performances TO postgres;
GRANT ALL ON TABLE public.open_answer_performances TO anon;
GRANT ALL ON TABLE public.open_answer_performances TO authenticated;
GRANT ALL ON TABLE public.open_answer_performances TO service_role;
--
-- Name: TABLE open_feedback; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.open_feedback TO anon;
GRANT ALL ON TABLE public.open_feedback TO authenticated;
GRANT ALL ON TABLE public.open_feedback TO service_role;
--
-- Name: TABLE open_feedback_drafts; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.open_feedback_drafts TO anon;
GRANT ALL ON TABLE public.open_feedback_drafts TO authenticated;
GRANT ALL ON TABLE public.open_feedback_drafts TO service_role;
--
-- Name: TABLE open_feedback_performances; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON TABLE public.open_feedback_performances TO postgres;
GRANT ALL ON TABLE public.open_feedback_performances TO anon;
GRANT ALL ON TABLE public.open_feedback_performances TO authenticated;
GRANT ALL ON TABLE public.open_feedback_performances TO service_role;
--
-- Name: TABLE open_question_drafts; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.open_question_drafts TO anon;
GRANT ALL ON TABLE public.open_question_drafts TO authenticated;
GRANT ALL ON TABLE public.open_question_drafts TO service_role;
--
-- Name: TABLE open_question_performances; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON TABLE public.open_question_performances TO postgres;
GRANT ALL ON TABLE public.open_question_performances TO anon;
GRANT ALL ON TABLE public.open_question_performances TO authenticated;
GRANT ALL ON TABLE public.open_question_performances TO service_role;
--
-- Name: TABLE test_tokens; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON TABLE public.test_tokens TO postgres;
GRANT ALL ON TABLE public.test_tokens TO anon;
GRANT ALL ON TABLE public.test_tokens TO authenticated;
GRANT ALL ON TABLE public.test_tokens TO service_role;
--
-- Name: SEQUENCE test_tokens_id_seq; Type: ACL; Schema: public; Owner: supabase_admin
--
GRANT ALL ON SEQUENCE public.test_tokens_id_seq TO postgres;
GRANT ALL ON SEQUENCE public.test_tokens_id_seq TO anon;
GRANT ALL ON SEQUENCE public.test_tokens_id_seq TO authenticated;
GRANT ALL ON SEQUENCE public.test_tokens_id_seq TO service_role;
--
-- Name: TABLE universities; Type: ACL; Schema: public; Owner: postgres
--
GRANT ALL ON TABLE public.universities TO anon;
GRANT ALL ON TABLE public.universities TO authenticated;
GRANT ALL ON TABLE public.universities TO service_role;
--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;
--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES  TO service_role;
--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;
--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS  TO service_role;
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES  TO service_role;
--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES  TO service_role;
--
-- PostgreSQL database dump complete
--