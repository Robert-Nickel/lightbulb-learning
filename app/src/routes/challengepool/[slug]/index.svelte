<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const challengePoolId = params.slug;
		const challengePool = await fetchChallengePool(challengePoolId);
		const openQuestions = await fetchOpenQuestions(challengePoolId);
		const topics = await fetchTopics(challengePoolId);
		const openQuestionIds = openQuestions.map((openQuestion) => {
			return openQuestion.id;
		});
		const openQuestionTopics = await fetchOpenQuestionTopics(openQuestionIds);
		const openQuestionLikes = await fetchOpenQuestionLikes(openQuestionIds, user.id);
		return {
			props: {
				challengePool,
				openQuestions,
				topics,
				openQuestionTopics,
				openQuestionLikes
			}
		};
	};
</script>

<script lang="ts">
	import CreateOpenQuestion from '$lib/components/CreateOpenQuestion.svelte';
	import { routes } from '$lib/routes';
	import { user } from '$lib/stores/user';
	import {
		deleteOpenQuestionLike,
		fetchChallengePool,
		fetchOpenQuestionLikes,
		fetchOpenQuestions,
		fetchOpenQuestionTopics,
		fetchTopics,
		OpenQuestionLikeType,
		OpenQuestionTopicType,
		OpenQuestionType,
		saveOpenQuestionLike,
		TopicType
	} from '$lib/supabaseClient';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	import FilterByTopics from '$lib/components/FilterByTopics.svelte';

	export let challengePool;
	export let openQuestions;
	export let topics: TopicType[];
	export let openQuestionTopics: OpenQuestionTopicType[];
	export let openQuestionLikes: OpenQuestionLikeType[];

	let filteredTopics: string[] = [];

	async function refreshOpenQuestions() {
		openQuestions = await fetchOpenQuestions(challengePool.id);
	}

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

	function isLiked(openQuestionId: string) {
		for (let openQuestionLike of openQuestionLikes) {
			if (openQuestionId == openQuestionLike.openQuestion) {
				return true;
			}
		}
		return false;
	}
</script>

{#if challengePool}
	<CreateOpenQuestion {challengePool} on:openQuestionCommitted={refreshOpenQuestions} />

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
							{openQuestion.questionText}
						</article>
					{:else}
						<article class="hoverable flex justify-between">
							{openQuestion.questionText}
							{#if isLiked(openQuestion.id)}
								<button
									class="outline h-12 ml-4 p-2"
									style="width: 8em;"
									on:click|preventDefault={async () => {
										await deleteOpenQuestionLike(openQuestion.id);
										openQuestionLikes = openQuestionLikes.filter((openQuestionLike) => {
											openQuestionLike.id != openQuestion.id;
										});
										openQuestions = openQuestions;
									}}>Unlike</button
								>{:else}<button
									class="outline h-12 ml-4 p-2"
									style="width: 8em;"
									on:click|preventDefault={async () => {
										openQuestionLikes.push(await saveOpenQuestionLike(openQuestion.id));
										openQuestionLikes = openQuestionLikes;
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
