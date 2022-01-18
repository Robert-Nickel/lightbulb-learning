<script lang="ts">
	import OpenQuestionDrafts from '$lib/components/OpenQuestionDrafts.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Back from '$lib/components/Back.svelte';
	import {
		ChallengePoolType,
		OpenQuestionType,
		fetchChallengePool,
		fetchOpenQuestions,
		deleteChallengePool
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';

	let challengePool: ChallengePoolType;
	let openQuestions: Array<OpenQuestionType> = [];

	onMount(() => {
		refresh();
	});

	async function refresh() {
		const id = $page.params.slug;
		challengePool = await fetchChallengePool(id);
		openQuestions = await fetchOpenQuestions(challengePool.id);
	}
</script>

<main class="container">
	{#if challengePool}
		<h1>{challengePool.description}</h1>

		<OpenQuestionDrafts {challengePool} on:openQuestionCommitted={refresh} />

		{#if openQuestions.length > 0}
			<h3 class="mt-10">Open Questions</h3>
		{/if}
		{#each openQuestions as openQuestion}
			<a href={`/openquestion/${openQuestion.id}`} class="light-link">
				{#if openQuestion.owner == $user.id}
					<article class="yours hoverable">
						<i>You asked:</i>
						{openQuestion.questionText}
					</article>
				{:else}
					<article class="hoverable">
						{openQuestion.questionText}
					</article>
				{/if}
			</a>
		{/each}

		{#if $user.id == challengePool.owner}
			<button
				on:click={async () => {
					await deleteChallengePool(challengePool.id);
					goto('/');
				}}
				class="secondary outline w-auto mb-0 hover:text-orange-700">Delete {challengePool.description}</button
			>
		{/if}
	{/if}

	<Back text="Back to all Challenge Pools" />
</main>

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.hoverable:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
