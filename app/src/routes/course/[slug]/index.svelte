<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const courseId = params.slug;
		const course = await fetchCourse(courseId);
		const openQuestionsDB = await fetchOpenQuestions(courseId);
		const topics = await fetchTopics(courseId);
		const openQuestionIds = openQuestionsDB.map((openQuestion) => {
			return openQuestion.id;
		});
		const openQuestionTopics = await fetchOpenQuestionTopics(openQuestionIds);
		const myOpenQuestionLikes = await fetchMyOpenQuestionLikes(openQuestionIds, user.id);
		const openQuestionLikes = await fetchOpenQuestionLikes(openQuestionIds);
		const openAnswers = await fetchOpenAnswers(openQuestionIds);
		type OpenQuestion = OpenQuestionType & { isLiked: boolean; amountOfAnswers: number; totalLikes: number };

		const openQuestions: OpenQuestion[] = openQuestionsDB.map((openQuestion) => {
			const totalLikes = countLikes(openQuestion.id);
			return {
				...openQuestion,
				...{
					isLiked: isLiked(openQuestion.id),
					amountOfAnswers: countAnswers(openQuestion.id),
					totalLikes
				}
			};
		});

		function isLiked(openQuestionId: string): boolean {
			for (let myOpenQuestionLike of myOpenQuestionLikes) {
				if (openQuestionId == myOpenQuestionLike.openQuestion) {
					return true;
				}
			}
			return false;
		}

		function countAnswers(openQuestionId: string): number {
			return openAnswers.filter((openAnswer) => {
				return openAnswer.openQuestion == openQuestionId;
			}).length;
		}

		function countLikes(openQuestionId: string): number {
			return openQuestionLikes.filter((openQuestionLike) => {
				return openQuestionLike.openQuestion == openQuestionId;
			}).length;
		}

		return {
			props: {
				course,
				openQuestions,
				topics,
				openQuestionTopics
			}
		};
	};
</script>

<script lang="ts">
	import CreateOpenQuestion from '$lib/components/CreateOpenQuestion.svelte';
	import { routes } from '$lib/routes';
	import { user } from '$lib/stores/user';
	import {
		CourseType,
		deleteOpenQuestionLike,
		fetchCourse,
		fetchMyOpenQuestionLikes,
		fetchOpenAnswers,
		fetchOpenQuestionLikes,
		fetchOpenQuestions,
		fetchOpenQuestionTopics,
		fetchTopics,
		OpenQuestionTopicType,
		OpenQuestionType,
		saveOpenQuestionLike,
		TopicType
	} from '$lib/supabaseClient';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	import FilterByTopics from '$lib/components/FilterByTopics.svelte';
	import { invalidate } from '$app/navigation';
	import OpenQuestion from '$lib/components/OpenQuestion.svelte';

	export let course: CourseType;
	export let openQuestions;
	export let topics: TopicType[];
	export let openQuestionTopics: OpenQuestionTopicType[];

	let filteredTopics: string[] = [];

	function isFiltered(openQuestion: OpenQuestionType): boolean {
		for (let filteredTopic of filteredTopics) {
			for (let openQuestionTopic of openQuestionTopics) {
				if (filteredTopic == openQuestionTopic.topic && openQuestionTopic.openQuestion == openQuestion.id) {
					return true;
				}
			}
		}
		return false;
	}
</script>

{#if course}
	<CreateOpenQuestion {course} />

	{#if openQuestions.length > 0}
		<h3 class="mt-10">Open Questions</h3>
		<FilterByTopics
			{topics}
			on:filterTopicsChanged={(event) => {
				filteredTopics = event.detail.filteredTopics;
				openQuestions = openQuestions;
			}}
		/>
		{#each openQuestions as openQuestion}
			{#if isFiltered(openQuestion) || filteredTopics.length == 0}
				<a href={routes.openQuestion(openQuestion.id)} class="light-link" sveltekit:prefetch>
					{#if openQuestion.owner == $user.id}
						<article class="yours hoverable">
							<OpenQuestion {openQuestion} />
						</article>
					{:else}
						<article class="hoverable flex justify-between">
							<OpenQuestion {openQuestion} />

							{#if openQuestion.isLiked}
								<button
									class="outline h-12 ml-4 mb-0 p-2 w-16"
									on:click|preventDefault={async () => {
										await deleteOpenQuestionLike(openQuestion.id);
										openQuestions.map((oq) => {
											if (oq.id == openQuestion.id) {
												oq.isLiked = false;
												oq.totalLikes--;
											}
											return oq;
										});
										openQuestions = openQuestions;
									}}>Unlike</button
								>{:else}<button
									class="outline h-12 ml-4 mb-0 p-2 w-16"
									on:click|preventDefault={async () => {
										await saveOpenQuestionLike(openQuestion.id);
										openQuestions.map((oq) => {
											if (oq.id == openQuestion.id) {
												oq.isLiked = true;
												oq.totalLikes++;
											}
											return oq;
										});
										openQuestions = openQuestions;
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
