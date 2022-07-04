<script context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session, params }) =>
		withPageAuth(
			{
				redirectTo: '/login',
				user: session.user
			},
			async () => {
				const courseId = params.slug;
				const course = await fetchCourse(courseId, session);
				const questionsDB = await fetchQuestions(courseId, session);
				const topics = await fetchTopics(courseId, session);
				const questionIds = questionsDB.map((question) => {
					return question.id;
				});
				const questionTopics = await fetchQuestionTopics(questionIds, session);
				const myQuestionLikes = await fetchMyQuestionLikes(questionIds, session);
				const questionLikes = await fetchQuestionLikes(questionIds, session);
				const answers = await fetchAnswers(questionIds, session);

				const questions = questionsDB.map((question) => {
					const totalLikes = questionLikes?.filter((questionLike) => {
						return questionLike.question == question.id;
					}).length;
					return {
						...question,
						...{
							isLiked: myQuestionLikes?.some((mql) => mql.id == question.id),
							amountOfAnswers: answers?.filter((answer) => {
								return answer.question == question.id;
							}).length,
							totalLikes
						}
					};
				});

				return {
					props: {
						course,
						questions,
						topics,
						questionTopics
					}
				};
			}
		);
</script>

<script lang="ts">
	import CreateQuestion from '$lib/components/CreateQuestion.svelte';
	import { routes } from '$lib/routes';
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
	} from '$lib/supabaseQueries';
	import FilterByTopics from '$lib/components/FilterByTopics.svelte';
	import Question from '$lib/components/Question.svelte';
	import { session } from '$app/stores';

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
					{#if question.owner == $session.user.id}
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
