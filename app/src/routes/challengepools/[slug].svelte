<script lang="ts">
	import { ChallengePool, OpenQuestion } from '$lib/models';
	import { DataStore } from 'aws-amplify';
	import OpenQuestionDrafts from '$lib/components/OpenQuestionDrafts.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';
	import OpenAnswers from '$lib/components/OpenAnswers.svelte';

	let challengePool: ChallengePool;
	let openQuestions: Array<OpenQuestion> = [];

	onMount(async () => {
		refresh()
	});

	async function refresh() {
		const poolId = $page.params.slug;
		try {
			challengePool = await DataStore.query(ChallengePool, poolId);
			openQuestions = await DataStore.query(OpenQuestion, (q) => q.challengepoolID('eq', challengePool.id));
		} catch (error) {
			throw error;
		}
	}

	async function deletePool() {
		await DataStore.delete(await DataStore.query(ChallengePool, challengePool.id));
		goto('/');
	}

	function openQuestionCommitted() {
		refresh();
	}
</script>

<main class="container">
	{#if challengePool}
		<h1>{challengePool.description}</h1>

		<OpenQuestionDrafts {challengePool} on:toast on:openQuestionCommitted={openQuestionCommitted} />
		{#if openQuestions.length > 0}
			<h3 class="mt-10">Open Questions</h3>
		{/if}
		{#each openQuestions as openQuestion}
			{#if openQuestion.owner == $user.id}
				<article class="yours">
					<i>You asked:</i>
					{openQuestion.questionText}
				</article>
			{:else}
				<article>
					<p>{openQuestion.questionText}</p>
					<OpenAnswers bind:openQuestion />
				</article>
			{/if}
		{/each}

		{#if $user.id == challengePool.owner}
			<button on:click={deletePool} class="secondary outline w-auto mb-0"
				>Delete {challengePool.description}</button
			>
		{/if}
	{/if}
</main>

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}
</style>
