import { createClient } from '@supabase/supabase-js';
import type { definitions } from '$lib/models/supabase';
import { CamelCasedPropertiesDeep, keysToCamelCase } from 'object-key-convert';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl.toString(), supabaseAnonKey.toString());

export async function fetchProfile(userId: string): Promise<ProfileType> {
	const { data, error } = await supabase
		.from<ProfileTypeDB>(profilesTable)
		.select()
		.eq('user_id', userId)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveProfile(
	firstName: string,
	lastName: string,
	university: UniversityType
): Promise<ProfileType> {
	const { data, error } = await supabase
		.from<ProfileTypeDB>(profilesTable)
		.insert({
			user_id: supabase.auth.user().id,
			first_name: firstName,
			last_name: lastName,
			university: university.id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function updateProfile(
	id: string,
	firstName: string,
	lastName: string,
	university: UniversityType
): Promise<ProfileType> {
	const { data, error } = await supabase
		.from<ProfileTypeDB>(profilesTable)
		.update({
			id,
			user_id: supabase.auth.user().id,
			first_name: firstName,
			last_name: lastName,
			university: university.id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchUniversity(id: string): Promise<UniversityType> {
	const { data, error } = await supabase
		.from<UniversityTypeDB>(universitiesTable)
		.select()
		.eq('id', id)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}
export async function fetchUniversityByName(name: string): Promise<UniversityType> {
	const { data, error } = await supabase
		.from<UniversityTypeDB>(universitiesTable)
		.select()
		.eq('name', name)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveUniversity(name: string) {
	const { data, error } = await supabase.from<UniversityTypeDB>(universitiesTable).insert({ name }).single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchChallengePools(userId: string): Promise<ChallengePoolType[]> {
	const { data, error } = await supabase.rpc('fetch_my_challenge_pools', {
		user_id_input: userId
	});

	printIf(error);
	return keysToCamelCase(data);
}

export async function saveChallengePool(description): Promise<ChallengePoolType> {
	const { data, error } = await supabase
		.from<ChallengePoolTypeDB>(challengePoolsTable)
		.insert([{ description, owner: supabase.auth.user().id }])
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchChallengePool(id: string): Promise<ChallengePoolType> {
	const { data, error } = await supabase
		.from<ChallengePoolTypeDB>(challengePoolsTable)
		.select()
		.eq('id', id)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function deleteChallengePool(id: string) {
	const { error } = await supabase.from<ChallengePoolTypeDB>(challengePoolsTable).delete().eq('id', id);
	printIf(error);
}

export async function fetchMyOpenQuestionDraft(challengePoolId: string): Promise<OpenQuestionDraftType> {
	const { data, error } = await supabase
		.from<OpenQuestionDraftTypeDB>(openQuestionDraftsTable)
		.select()
		.eq('owner', supabase.auth.user().id)
		.eq('challenge_pool', challengePoolId);
	printIf(error);
	return keysToCamelCase(data[0]);
}

export async function saveOpenQuestionDraft(
	questionText: string,
	challengePoolId: string
): Promise<OpenQuestionDraftType> {
	console.log('saving open question draft: ' + questionText + ' challenge pool id: ' + challengePoolId);

	const { data, error } = await supabase
		.from<OpenQuestionDraftTypeDB>(openQuestionDraftsTable)
		.insert({
			question_text: questionText,
			challenge_pool: challengePoolId,
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function updateOpenQuestionDraftWithAnswer(
	id: string,
	answerText: string
): Promise<OpenQuestionDraftType> {
	const { data, error } = await supabase
		.from<OpenQuestionDraftTypeDB>(openQuestionDraftsTable)
		.update({ answer_text: answerText })
		.eq('id', id);
	printIf(error);
	return keysToCamelCase(data[0]);
}

export async function deleteAnswerFromOpenQuestionDraft(id: string): Promise<OpenQuestionDraftType> {
	const { data, error } = await supabase
		.from<OpenQuestionDraftTypeDB>(openQuestionDraftsTable)
		.update({ answer_text: null })
		.eq('id', id);
	printIf(error);
	return keysToCamelCase(data[0]);
}

export async function deleteOpenQuestionDraft(id: string) {
	const { error } = await supabase
		.from<OpenQuestionDraftTypeDB>(openQuestionDraftsTable)
		.delete()
		.eq('id', id);
	printIf(error);
}

export async function fetchOpenQuestions(challengePoolId): Promise<OpenQuestionType[]> {
	const { data, error } = await supabase
		.from<OpenQuestionTypeDB>(openQuestionsTable)
		.select()
		.eq('challenge_pool', challengePoolId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenQuestion(id: string): Promise<OpenQuestionType> {
	const { data, error } = await supabase
		.from<OpenQuestionTypeDB>(openQuestionsTable)
		.select()
		.eq('id', id)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveOpenQuestion(
	questionText: string,
	challengePoolId: string
): Promise<OpenQuestionType> {
	const { data, error } = await supabase
		.from<OpenQuestionTypeDB>(openQuestionsTable)
		.insert({
			question_text: questionText,
			challenge_pool: challengePoolId,
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchCorrectOpenAnswer(
	openQuestionId: string,
	userId: string
): Promise<CorrectOpenAnswerType> {
	const { data, error } = await supabase
		.from<CorrectOpenAnswerTypeDB>(correctAnswersTable)
		.select()
		.eq('open_question', openQuestionId)
		.eq('owner', userId)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveCorrectOpenAnswer(
	answerText: string,
	openQuestionId: string
): Promise<CorrectOpenAnswerType> {
	const { data, error } = await supabase
		.from<CorrectOpenAnswerTypeDB>(correctAnswersTable)
		.insert({
			answer_text: answerText,
			open_question: openQuestionId,
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMyOpenAnswerDraft(
	openQuestionId: string,
	userId: string
): Promise<OpenAnswerDraftType> {
	const { data, error } = await supabase
		.from<OpenAnswerDraftTypeDB>(openAnswerDraftsTable)
		.select()
		.eq('open_question', openQuestionId)
		.eq('owner', userId)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveOpenAnswerDraft(
	openAnswerDraftText: string,
	openQuestionId: string
): Promise<OpenAnswerDraftType> {
	const { data, error } = await supabase
		.from<OpenAnswerDraftTypeDB>(openAnswerDraftsTable)
		.insert({
			answer_text: openAnswerDraftText,
			open_question: openQuestionId,
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function deleteOpenAnswerDraft(id) {
	const { error } = await supabase.from<OpenAnswerDraftTypeDB>(openAnswerDraftsTable).delete().eq('id', id);
	printIf(error);
	return null;
}

export async function fetchOpenAnswer(id: string): Promise<OpenAnswerType> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.eq('id', id)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMyOpenAnswers(openQuestionId): Promise<OpenAnswerType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.eq('open_question', openQuestionId)
		.eq('owner', supabase.auth.user().id);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchLatestOpenAnswer(openQuestionId, userId): Promise<OpenAnswerType> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.eq('open_question', openQuestionId)
		.eq('owner', userId)
		.order('version', { ascending: false })
		.limit(1);
	printIf(error);
	return keysToCamelCase(data[0]);
}

export async function fetchOpenAnswersOfOthers(
	openQuestionId: string,
	userId: string
): Promise<OpenAnswerType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.eq('open_question', openQuestionId)
		.neq('owner', userId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveOpenAnswer(
	answerText: string,
	openQuestionId: string,
	version = 1
): Promise<OpenAnswerType> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.insert({
			answer_text: answerText,
			open_question: openQuestionId,
			owner: supabase.auth.user().id,
			version
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMyOpenFeedbackDraft(openAnswerId: string): Promise<OpenFeedbackDraftType> {
	const { data, error } = await supabase
		.from<OpenFeedbackDraftTypeDB>(openFeedbackDraftsTable)
		.select()
		.eq('owner', supabase.auth.user().id)
		.eq('open_answer', openAnswerId)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveOpenFeedbackDraft(
	openFeedbackDraftText: string,
	openAnswerId: string
): Promise<OpenFeedbackDraftType> {
	const { data, error } = await supabase
		.from<OpenFeedbackDraftTypeDB>(openFeedbackDraftsTable)
		.insert({
			feedback_text: openFeedbackDraftText,
			open_answer: openAnswerId,
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function deleteOpenFeedbackDraft(id: string) {
	const { error } = await supabase
		.from<OpenFeedbackDraftTypeDB>(openFeedbackDraftsTable)
		.delete()
		.eq('id', id);
	printIf(error);
	return null;
}

export async function fetchMyOpenFeedback(openAnswerId: string): Promise<OpenFeedbackType> {
	const { data, error } = await supabase
		.from<OpenFeedbackTypeDB>(openFeedbackTable)
		.select()
		.eq('owner', supabase.auth.user().id)
		.eq('open_answer', openAnswerId)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenFeedbackOfOthers(openAnswerId: string): Promise<OpenFeedbackType[]> {
	const { data, error } = await supabase
		.from<OpenFeedbackTypeDB>(openFeedbackTable)
		.select()
		.eq('open_answer', openAnswerId)
		.neq('owner', supabase.auth.user().id);
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveOpenFeedback(
	feedbackText: string,
	openAnswerId: string
): Promise<OpenFeedbackType> {
	const { data, error } = await supabase
		.from<OpenFeedbackTypeDB>(openFeedbackTable)
		.insert({
			feedback_text: feedbackText,
			open_answer: openAnswerId,
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function joinChallengePool(inviteCode: string): Promise<string> {
	if (!inviteCode || inviteCode.length != 10) {
		console.error('invalid invite code: ' + inviteCode);
	}
	const { data, error } = await supabase.rpc('join_challenge_pool', {
		invite_code_input: inviteCode,
		user_id_input: supabase.auth.user().id
	});
	printIf(error);
	return data.toString();
}

export async function saveInviteCode(challengePoolId: string, code: string): Promise<InviteCodeType> {
	const validUntil = new Date();
	validUntil.setFullYear(2100); // do not expire links for now

	const { data, error } = await supabase
		.from<InviteCodeTypeDB>(inviteCodesTable)
		.insert({
			challenge_pool: challengePoolId,
			code,
			valid_until: validUntil.toISOString(),
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMembers(challengePoolId: string): Promise<MemberType[]> {
	const { data, error } = await supabase
		.from<MemberTypeDB>(membersView)
		.select()
		.eq('challenge_pool', challengePoolId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMember(id: string): Promise<MemberType> {
	const { data, error } = await supabase.from<MemberTypeDB>(membersView).select().eq('id', id).single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenQuestionPerformances(id: string): Promise<OpenQuestionPerformancesType[]> {
	const { data, error } = await supabase
		.from<OpenQuestionPerformancesTypeDB>(openQuestionPerformancesView)
		.select()
		.eq('id', id);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenAnswerPerformances(id: string): Promise<OpenAnswerPerformancesType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerPerformancesTypeDB>(openAnswerPerformancesView)
		.select()
		.eq('id', id);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenFeedbackPerformances(id: string): Promise<OpenFeedbackPerformancesType[]> {
	const { data, error } = await supabase
		.from<OpenFeedbackPerformancesTypeDB>(openFeedbackPerformancesView)
		.select()
		.eq('id', id);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchTopics(challengePoolId: string): Promise<TopicType[]> {
	const { data, error } = await supabase
		.from<TopicTypeDB>(topicsTable)
		.select()
		.eq('challenge_pool', challengePoolId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveTopic(challengePoolId: string, name: string): Promise<TopicType> {
	const { data, error } = await supabase
		.from<TopicTypeDB>(topicsTable)
		.insert({
			challenge_pool: challengePoolId,
			name
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveOpenQuestionTopics(openQuestionId: string, topics: string[]): Promise<OpenQuestionTopicType[]> {
	let openQuestionTopics = []
	topics.forEach((topic) => {
		openQuestionTopics.push({ open_question: openQuestionId, topic })
	})
	const { data, error } = await supabase
		.from<OpenQuestionTopicTypeDB>(openQuestionTopicTable)
		.insert(openQuestionTopics);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenQuestionTopics(openQuestionIds: string[]): Promise<OpenQuestionTopicType[]> {
	const { data, error } = await supabase
		.from<OpenQuestionTopicTypeDB>(openQuestionTopicTable)
		.select()
		.in('open_question', openQuestionIds);
	printIf(error);
	return keysToCamelCase(data);
}

function printIf(error) {
	if (error) console.error(error);
}

export const challengePoolsTable = 'challenge_pools';
export const openQuestionDraftsTable = 'open_question_drafts';
export const openQuestionsTable = 'open_questions';
export const correctAnswersTable = 'correct_open_answers';
export const openAnswerDraftsTable = 'open_answer_drafts';
export const openAnswersTable = 'open_answers';
export const openFeedbackDraftsTable = 'open_feedback_drafts';
export const openFeedbackTable = 'open_feedback';
export const profilesTable = 'profiles';
export const universitiesTable = 'universities';
export const challengePoolUserTable = 'challenge_pool_user';
export const inviteCodesTable = 'invite_codes';
export const membersView = 'members';
export const openQuestionPerformancesView = 'open_question_performances';
export const openAnswerPerformancesView = 'open_answer_performances';
export const openFeedbackPerformancesView = 'open_feedback_performances';
export const topicsTable = 'topics';
export const openQuestionTopicTable = 'open_question_topic';

export type ChallengePoolType = CamelCasedPropertiesDeep<definitions['challenge_pools']>;
export type OpenQuestionDraftType = CamelCasedPropertiesDeep<definitions['open_question_drafts']>;
export type OpenQuestionType = CamelCasedPropertiesDeep<definitions['open_questions']>;
export type CorrectOpenAnswerType = CamelCasedPropertiesDeep<definitions['correct_open_answers']>;
export type OpenAnswerDraftType = CamelCasedPropertiesDeep<definitions['open_answer_drafts']>;
export type OpenAnswerType = CamelCasedPropertiesDeep<definitions['open_answers']>;
export type OpenFeedbackDraftType = CamelCasedPropertiesDeep<definitions['open_feedback_drafts']>;
export type OpenFeedbackType = CamelCasedPropertiesDeep<definitions['open_feedback']>;
export type ProfileType = CamelCasedPropertiesDeep<definitions['profiles']>;
export type UniversityType = CamelCasedPropertiesDeep<definitions['universities']>;
export type ChallengePoolUserType = CamelCasedPropertiesDeep<definitions['challenge_pool_user']>;
export type InviteCodeType = CamelCasedPropertiesDeep<definitions['invite_codes']>;
export type MemberType = CamelCasedPropertiesDeep<definitions['members']>;
export type OpenQuestionPerformancesType = CamelCasedPropertiesDeep<
	definitions['open_question_performances']
>;
export type OpenAnswerPerformancesType = CamelCasedPropertiesDeep<definitions['open_answer_performances']>;
export type OpenFeedbackPerformancesType = CamelCasedPropertiesDeep<
	definitions['open_feedback_performances']
>;
export type TopicType = CamelCasedPropertiesDeep<definitions['topics']>;
export type OpenQuestionTopicType = CamelCasedPropertiesDeep<definitions['open_question_topic']>;

export type ChallengePoolTypeDB = definitions['challenge_pools'];
export type OpenQuestionDraftTypeDB = definitions['open_question_drafts'];
export type OpenQuestionTypeDB = definitions['open_questions'];
export type CorrectOpenAnswerTypeDB = definitions['correct_open_answers'];
export type OpenAnswerDraftTypeDB = definitions['open_answer_drafts'];
export type OpenAnswerTypeDB = definitions['open_answers'];
export type OpenFeedbackDraftTypeDB = definitions['open_feedback_drafts'];
export type OpenFeedbackTypeDB = definitions['open_feedback'];
export type ProfileTypeDB = definitions['profiles'];
export type UniversityTypeDB = definitions['universities'];
export type ChallengePoolUserTypeDB = definitions['challenge_pool_user'];
export type InviteCodeTypeDB = definitions['invite_codes'];
export type MemberTypeDB = definitions['members'];
export type OpenQuestionPerformancesTypeDB = definitions['open_question_performances'];
export type OpenAnswerPerformancesTypeDB = definitions['open_answer_performances'];
export type OpenFeedbackPerformancesTypeDB = definitions['open_feedback_performances'];
export type TopicTypeDB = definitions['topics'];
export type OpenQuestionTopicTypeDB = definitions['open_question_topic'];
