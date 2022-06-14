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

export async function fetchCourses(userId: string): Promise<CourseType[]> {
	const { data, error } = await supabase.rpc('fetch_my_courses', {
		user_id_input: userId
	});

	printIf(error);
	return keysToCamelCase(data);
}

export async function saveCourse(description: string): Promise<CourseType> {
	const { data, error } = await supabase
		.from<CourseTypeDB>(coursesTable)
		.insert({ description, owner: supabase.auth.user().id })
		.single();
	printIf(error);
	const course: CourseType = keysToCamelCase(data);
	await saveCourseUser(course.id);
	return course;
}

// only for the owner of a course.
// Regular member must use the join course function.
async function saveCourseUser(courseId: string) {
	const { data, error } = await supabase
		.from<CourseUserTypeDB>(courseUserTable)
		.insert({ course: courseId, user_id: supabase.auth.user().id })
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchCourse(id: string): Promise<CourseType> {
	const { data, error } = await supabase
		.from<CourseTypeDB>(coursesTable)
		.select()
		.eq('id', id)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function deleteCourse(id: string) {
	const { error } = await supabase.from<CourseTypeDB>(coursesTable).delete().eq('id', id);
	printIf(error);
}

export async function fetchQuestions(courseId): Promise<QuestionType[]> {
	const { data, error } = await supabase
		.from<QuestionTypeDB>(questionsTable)
		.select()
		.eq('course', courseId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchQuestion(id: string): Promise<QuestionType> {
	const { data, error } = await supabase
		.from<QuestionTypeDB>(questionsTable)
		.select()
		.eq('id', id)
		.maybeSingle();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveQuestion(
	questionText: string,
	courseId: string
): Promise<QuestionType> {
	const { data, error } = await supabase
		.from<QuestionTypeDB>(questionsTable)
		.insert({
			question_text: questionText,
			course: courseId,
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
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

export async function fetchMyOpenAnswers(questionId): Promise<OpenAnswerType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.eq('question', questionId)
		.eq('owner', supabase.auth.user().id);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchLatestOpenAnswer(questionId, userId): Promise<OpenAnswerType> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.eq('question', questionId)
		.eq('owner', userId)
		.order('version', { ascending: false })
		.limit(1);
	printIf(error);
	return keysToCamelCase(data[0]);
}

export async function fetchOpenAnswersOfOthers(
	questionId: string,
	userId: string
): Promise<OpenAnswerType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.eq('question', questionId)
		.neq('owner', userId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveOpenAnswer(
	answerText: string,
	questionId: string,
	version = 1
): Promise<OpenAnswerType> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.insert({
			answer_text: answerText,
			question: questionId,
			owner: supabase.auth.user().id,
			version
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
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

export async function joinCourse(inviteCode: string): Promise<string> {
	if (!inviteCode || inviteCode.length != 10) {
		console.error('invalid invite code: ' + inviteCode);
	}
	const { data, error } = await supabase.rpc('join_course', {
		invite_code_input: inviteCode,
		user_id_input: supabase.auth.user().id
	});
	printIf(error);
	return data.toString();
}

export async function saveInviteCode(courseId: string, code: string): Promise<InviteCodeType> {
	const validUntil = new Date();
	validUntil.setFullYear(2100); // do not expire links for now

	const { data, error } = await supabase
		.from<InviteCodeTypeDB>(inviteCodesTable)
		.insert({
			course: courseId,
			code,
			valid_until: validUntil.toISOString(),
			owner: supabase.auth.user().id
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMembers(courseId: string): Promise<MemberType[]> {
	const { data, error } = await supabase
		.from<MemberTypeDB>(membersView)
		.select()
		.eq('course', courseId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMember(courseUserId: string): Promise<MemberType> {
	const { data, error } = await supabase.from<MemberTypeDB>(membersView).select().eq('id', courseUserId).single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchQuestionPerformances(courseUserId: string): Promise<QuestionPerformanceType[]> {
	const { data, error } = await supabase
		.from<QuestionPerformanceTypeDB>(questionPerformancesView)
		.select()
		.eq('id', courseUserId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenAnswerPerformances(courseUserId: string): Promise<OpenAnswerPerformanceType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerPerformanceTypeDB>(openAnswerPerformancesView)
		.select()
		.eq('id', courseUserId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenFeedbackPerformances(courseUserId: string): Promise<OpenFeedbackPerformanceType[]> {
	const { data, error } = await supabase
		.from<OpenFeedbackPerformanceTypeDB>(openFeedbackPerformancesView)
		.select()
		.eq('id', courseUserId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchTopics(courseId: string): Promise<TopicType[]> {
	const { data, error } = await supabase
		.from<TopicTypeDB>(topicsTable)
		.select()
		.eq('course', courseId);
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveTopic(courseId: string, name: string): Promise<TopicType> {
	const { data, error } = await supabase
		.from<TopicTypeDB>(topicsTable)
		.insert({
			course: courseId,
			name
		})
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveQuestionTopics(questionId: string, topics: string[]): Promise<QuestionTopicType[]> {
	let questionTopics = []
	topics.forEach((topic) => {
		questionTopics.push({ question: questionId, topic })
	})
	const { data, error } = await supabase
		.from<QuestionTopicTypeDB>(questionTopicTable)
		.insert(questionTopics);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchQuestionTopics(questionIds: string[]): Promise<QuestionTopicType[]> {
	const { data, error } = await supabase
		.from<QuestionTopicTypeDB>(questionTopicTable)
		.select()
		.in('question', questionIds);
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveQuestionLike(questionId: string): Promise<QuestionLikeType> {
	const { data, error } = await supabase
		.from<QuestionLikeTypeDB>(questionLikesTable)
		.insert({ question: questionId, owner: supabase.auth.user().id })
		.single();
	printIf(error);
	return keysToCamelCase(data);
}
export async function saveOpenAnswerLike(openAnswerId: string): Promise<OpenAnswerLikeType> {
	const { data, error } = await supabase
		.from<OpenAnswerLikeTypeDB>(openAnswerLikesTable)
		.insert({ open_answer: openAnswerId, owner: supabase.auth.user().id })
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMyQuestionLikes(questionIds: string[], userId: string): Promise<QuestionLikeType[]> {
	const { data, error } = await supabase
		.from<QuestionLikeTypeDB>(questionLikesTable)
		.select()
		.eq('owner', userId)
		.in('question', questionIds);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMyOpenAnswerLikes(openAnswerIds: string[], userId: string): Promise<OpenAnswerLikeType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerLikeTypeDB>(openAnswerLikesTable)
		.select()
		.eq('owner', userId)
		.in('open_answer', openAnswerIds);
	printIf(error);
	return keysToCamelCase(data);
}

export async function deleteQuestionLike(questionId: string) {
	// TODO: doesn't this delete too much?!?! Or is this regulated by RLS?
	const { error } = await supabase
		.from<QuestionLikeTypeDB>(questionLikesTable)
		.delete()
		.eq('question', questionId);
	printIf(error);
}

export async function deleteOpenAnswerLike(openAnswerId: string) {
	// TODO: doesn't this delete too much?!?! Or is this regulated by RLS?
	const { error } = await supabase
		.from<OpenAnswerLikeTypeDB>(openAnswerLikesTable)
		.delete()
		.eq('open_answer', openAnswerId);
	printIf(error);
}

export async function fetchProgresses(courseUserId: string): Promise<ProgressType[]> {
	const { data, error } = await supabase
		.from<ProgressTypeDB>(progressesTable)
		.select()
		.eq('course_user', courseUserId)
	printIf(error);
	return keysToCamelCase(data);
}

export async function saveProgress(courseUserId: string, percentage: number): Promise<ProgressType> {
	const { data, error } = await supabase
		.from<ProgressTypeDB>(progressesTable)
		.insert({ course_user: courseUserId, percentage })
		.single();
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenAnswers(questionIds: string[]): Promise<OpenAnswerType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerTypeDB>(openAnswersTable)
		.select()
		.in('question', questionIds);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchQuestionLikes(questionIds: string[]): Promise<QuestionLikeType[]> {
	const { data, error } = await supabase
		.from<QuestionLikeTypeDB>(questionLikesTable)
		.select()
		.in('question', questionIds);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchOpenAnswerLikes(openAnswerIds: string[]): Promise<OpenAnswerLikeType[]> {
	const { data, error } = await supabase
		.from<OpenAnswerLikeTypeDB>(openAnswerLikesTable)
		.select()
		.in('open_answer', openAnswerIds);
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchCourseUser(courseId: string, userId: string): Promise<ProgressType> {
	const { data, error } = await supabase.from(courseUserTable)
		.select()
		.eq("course", courseId)
		.eq("user_id", userId)
		.single()
	printIf(error);
	return keysToCamelCase(data);
}

export async function fetchMyLatestProgress(courseUserId: string): Promise<ProgressType> {
	const { data, error } = await supabase
		.from<ProgressTypeDB>(progressesTable)
		.select()
		.eq('course_user', courseUserId)
		.order("created_at", { ascending: false });
	printIf(error);
	return keysToCamelCase(data[0]);
}

function printIf(error) {
	if (error) console.error(error);
}

export const coursesTable = 'courses';
export const questionsTable = 'questions';
export const openAnswersTable = 'open_answers';
export const openFeedbackTable = 'open_feedback';
export const profilesTable = 'profiles';
export const universitiesTable = 'universities';
export const courseUserTable = 'course_user';
export const inviteCodesTable = 'invite_codes';
export const membersView = 'members';
export const questionPerformancesView = 'question_performances';
export const openAnswerPerformancesView = 'open_answer_performances';
export const openFeedbackPerformancesView = 'open_feedback_performances';
export const topicsTable = 'topics';
export const questionTopicTable = 'question_topic';
export const questionLikesTable = 'question_likes';
export const openAnswerLikesTable = 'open_answer_likes';
export const progressesTable = 'progresses';

export type CourseType = CamelCasedPropertiesDeep<definitions['courses']>;
export type QuestionType = CamelCasedPropertiesDeep<definitions['questions']>;
export type OpenAnswerType = CamelCasedPropertiesDeep<definitions['open_answers']>;
export type OpenFeedbackType = CamelCasedPropertiesDeep<definitions['open_feedback']>;
export type ProfileType = CamelCasedPropertiesDeep<definitions['profiles']>;
export type UniversityType = CamelCasedPropertiesDeep<definitions['universities']>;
export type CourseUserType = CamelCasedPropertiesDeep<definitions['course_user']>;
export type InviteCodeType = CamelCasedPropertiesDeep<definitions['invite_codes']>;
export type MemberType = CamelCasedPropertiesDeep<definitions['members']>;
export type QuestionPerformanceType = CamelCasedPropertiesDeep<
	definitions['question_performances']
>;
export type OpenAnswerPerformanceType = CamelCasedPropertiesDeep<definitions['open_answer_performances']>;
export type OpenFeedbackPerformanceType = CamelCasedPropertiesDeep<
	definitions['open_feedback_performances']
>;
export type TopicType = CamelCasedPropertiesDeep<definitions['topics']>;
export type QuestionTopicType = CamelCasedPropertiesDeep<definitions['question_topic']>;
export type QuestionLikeType = CamelCasedPropertiesDeep<definitions['question_likes']>;
export type OpenAnswerLikeType = CamelCasedPropertiesDeep<definitions['open_answer_likes']>;
export type ProgressType = CamelCasedPropertiesDeep<definitions['progresses']>;

export type CourseTypeDB = definitions['courses'];
export type QuestionTypeDB = definitions['questions'];
export type OpenAnswerTypeDB = definitions['open_answers'];
export type OpenFeedbackTypeDB = definitions['open_feedback'];
export type ProfileTypeDB = definitions['profiles'];
export type UniversityTypeDB = definitions['universities'];
export type CourseUserTypeDB = definitions['course_user'];
export type InviteCodeTypeDB = definitions['invite_codes'];
export type MemberTypeDB = definitions['members'];
export type QuestionPerformanceTypeDB = definitions['question_performances'];
export type OpenAnswerPerformanceTypeDB = definitions['open_answer_performances'];
export type OpenFeedbackPerformanceTypeDB = definitions['open_feedback_performances'];
export type TopicTypeDB = definitions['topics'];
export type QuestionTopicTypeDB = definitions['question_topic'];
export type QuestionLikeTypeDB = definitions['question_likes'];
export type OpenAnswerLikeTypeDB = definitions['open_answer_likes'];
export type ProgressTypeDB = definitions['progresses'];