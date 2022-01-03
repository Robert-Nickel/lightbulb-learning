<script lang="ts">
	import { ChallengePool, OpenQuestion } from '$lib/models';
	import { DataStore } from 'aws-amplify';
	import OpenQuestionDrafts from '$lib/components/OpenQuestionDrafts.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';
	import Back from '$lib/components/Back.svelte';

	let challengePool: ChallengePool;
	let openQuestions: Array<OpenQuestion> = [];

	onMount(() => {
		refresh();
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

		<OpenQuestionDrafts {challengePool} on:openQuestionCommitted={openQuestionCommitted} />

		{#if openQuestions.length > 0}
			<h3 class="mt-10">Open Questions</h3>
		{/if}
		{#each openQuestions as openQuestion}
			<div on:click={() => goto(`/openquestion/${openQuestion.id}`)} >
				{#if openQuestion.owner == $user.id}
					<article class="yours question">
						<i>You asked:</i>
						{openQuestion.questionText}
					</article>
				{:else}
					<article class="hoverable">
						{openQuestion.questionText}
						<!--<OpenAnswers bind:openQuestion />-->
					</article>
				{/if}
			</div>
		{/each}

		{#if $user.id == challengePool.owner}
			<button on:click={deletePool} class="secondary outline w-auto mb-0"
				>Delete {challengePool.description}</button
			>
		{/if}
	{/if}

	<Back text="Back to all Challenge Pools"/>
</main>

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.hoverable:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
