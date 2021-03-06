-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

CREATE TABLE IF NOT EXISTS public.answer_likes
(
    id uuid NOT NULL DEFAULT uuid_generate_v4(),
    answer uuid NOT NULL,
    owner uuid NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    CONSTRAINT answer_likes_pkey PRIMARY KEY (id),
    CONSTRAINT answer_likes_answer_fkey FOREIGN KEY (answer)
        REFERENCES public.answers (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE,
    CONSTRAINT answer_likes_owner_fkey FOREIGN KEY (owner)
        REFERENCES auth.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.answer_likes
    OWNER to postgres;

GRANT ALL ON TABLE public.answer_likes TO anon;

GRANT ALL ON TABLE public.answer_likes TO authenticated;

GRANT ALL ON TABLE public.answer_likes TO postgres;

GRANT ALL ON TABLE public.answer_likes TO service_role;
