<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const courseId = params.slug;
		const course = await fetchCourse(courseId);
		const questionsDB = await fetchQuestions(courseId);
		const topics = await fetchTopics(courseId);
		const questionIds = questionsDB.map((question) => {
			return question.id;
		});
		const questionTopics = await fetchQuestionTopics(questionIds);
		const myQuestionLikes = await fetchMyQuestionLikes(questionIds, user.id);
		const questionLikes = await fetchQuestionLikes(questionIds);
		const answers = await fetchAnswers(questionIds);
		type Question = QuestionType & { isLiked: boolean; amountOfAnswers: number; totalLikes: number };

		const questions: Question[] = questionsDB.map((question) => {
			const totalLikes = countLikes(question.id);
			return {
				...question,
				...{
					isLiked: isLiked(question.id),
					amountOfAnswers: countAnswers(question.id),
					totalLikes
				}
			};
		});

		function isLiked(questionId: string): boolean {
			for (let myQuestionLike of myQuestionLikes) {
				if (questionId == myQuestionLike.question) {
					return true;
				}
			}
			return false;
		}

		function countAnswers(questionId: string): number {
			return answers.filter((answer) => {
				return answer.question == questionId;
			}).length;
		}

		function countLikes(questionId: string): number {
			return questionLikes.filter((questionLike) => {
				return questionLike.question == questionId;
			}).length;
		}

		return {
			props: {
				course,
				questions,
				topics,
				questionTopics
			}
		};
	};
</script>

<script lang="ts">
	import CreateQuestion from '$lib/components/CreateQuestion.svelte';
	import { routes } from '$lib/routes';
	import { user } from '$lib/stores/user';
	import {
		CourseType,
		deleteQuestionLike,
		fetchCourse,
		fetchMyQuestionLikes,
		fetchAnswers,
		fetchQuestionLikes,
		fetchQuestions,
		fetchQuestionTopics,
		fetchTopics,
		QuestionTopicType,
		QuestionType,
		saveQuestionLike,
		TopicType
	} from '$lib/supabaseClient';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	import FilterByTopics from '$lib/components/FilterByTopics.svelte';
	import Question from '$lib/components/Question.svelte';

	export let course: CourseType;
	export let questions;
	export let topics: TopicType[];
	export let questionTopics: QuestionTopicType[];

	let filteredTopics: string[] = [];

	function isFiltered(question: QuestionType): boolean {
		for (let filteredTopic of filteredTopics) {
			for (let questionTopic of questionTopics) {
				if (filteredTopic == questionTopic.topic && questionTopic.question == question.id) {
					return true;
				}
			}
		}
		return false;
	}
</script>

{#if course}
	<CreateQuestion {course} />

	{#if questions.length > 0}
		<h3 class="mt-10">Questions</h3>
		<FilterByTopics
			{topics}
			on:filterTopicsChanged={(event) => {
				filteredTopics = event.detail.filteredTopics;
				questions = questions;
			}}
		/>
		{#each questions as question}
			{#if isFiltered(question) || filteredTopics.length == 0}
				<a href={routes.question(question.id)} class="light-link" sveltekit:prefetch>
					{#if question.owner == $user.id}
						<article class="yours hoverable">
							<Question {question} />
						</article>
					{:else}
						<article class="hoverable flex justify-between">
							<Question {question} />

							{#if question.isLiked}
								<button
									class="outline h-12 ml-4 mb-0 p-2 w-16"
									on:click|preventDefault={async () => {
										await deleteQuestionLike(question.id);
										questions.map((oq) => {
											if (oq.id == question.id) {
												oq.isLiked = false;
												oq.totalLikes--;
											}
											return oq;
										});
										questions = questions;
									}}>Unlike</button
								>{:else}<button
									class="outline h-12 ml-4 mb-0 p-2 w-16"
									on:click|preventDefault={async () => {
										await saveQuestionLike(question.id);
										questions.map((oq) => {
											if (oq.id == question.id) {
												oq.isLiked = true;
												oq.totalLikes++;
											}
											return oq;
										});
										questions = questions;
									}}>Like!</button
								>
							{/if}
						</article>
					{/if}</a
				>
			{/if}
		{/each}
	{/if}
{/if}

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.hoverable:hover {
		background: var(--card-sectionning-background-color);
	}
</style>
