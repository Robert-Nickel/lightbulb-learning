import { createClient } from '@supabase/supabase-js'
import type { definitions } from '$lib/models/supabase';

const supabaseUrl = import.meta.env.VITE_SVELTE_APP_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SVELTE_APP_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl.toString(), supabaseAnonKey.toString())
export const challengePoolsTable = 'challenge_pools';
export const openQuestionDraftsTable = 'open_question_drafts';
export const openQuestionsTable = 'open_questions';
export const openAnswerDraftsTable = 'open_answer_drafts';
export const openAnswersTable = 'open_answers';
export const openFeedbackDraftsTable = 'open_feedback_drafts';
export const openFeedbackTable = 'open_feedback';

export type ChallengePoolType = definitions['challenge_pools'];
export type OpenQuestionDraftType = definitions['open_question_drafts'];
export type OpenQuestionType = definitions['open_questions'];
export type OpenAnswerDraftType = definitions['open_answer_drafts'];
export type OpenAnswerType = definitions['open_answers'];
export type OpenFeedbackDraftType = definitions['open_feedback_drafts'];
export type OpenFeedbackType = definitions['open_feedback'];
