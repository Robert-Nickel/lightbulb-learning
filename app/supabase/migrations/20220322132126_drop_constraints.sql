-- This script was generated by the Schema Diff utility in pgAdmin 4
-- For the circular dependencies, the order in which Schema Diff writes the objects is not very sophisticated
-- and may require manual changes to the script to ensure changes are applied in the correct order.
-- Please report an issue for any failure with the reproduction steps.

ALTER TABLE IF EXISTS public.courses DROP CONSTRAINT IF EXISTS challenge_pools_owner_fkey;

ALTER TABLE IF EXISTS public.questions DROP CONSTRAINT IF EXISTS questions_new_owner_fkey;

ALTER TABLE IF EXISTS public.questions DROP CONSTRAINT IF EXISTS questions_course_fkey;

ALTER TABLE IF EXISTS public.questions DROP CONSTRAINT IF EXISTS questions_owner_fkey;

ALTER TABLE IF EXISTS public.invite_codes DROP CONSTRAINT IF EXISTS invite_codes_course_fkey;
