<script lang="ts">
	import { ChallengePool } from '$lib/models';
	import { DataStore } from 'aws-amplify';
	import OpenQuestionDrafts from '$lib/components/OpenQuestionDrafts.svelte';
	import OpenQuestions from '$lib/components/OpenQuestions.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let baseUrl: string;
	export let userId: string;

	let challengePool;
	let openQuestions;

	onMount(async () => {
		const poolId = $page.params.slug;
		try {
			challengePool = await DataStore.query(ChallengePool, poolId);
		} catch (error) {
			throw new Error(`There is no challenge pool with id ${poolId}`);
		}
	});

	async function deletePool() {
		await DataStore.delete(await DataStore.query(ChallengePool, challengePool.id));
		goto('/');
	}

	function openQuestionCommitted() {
		openQuestions.fetchOpenQuestions();
	}
</script>

<main class="container">
	slug is: {$page.params.slug}
	{#if challengePool}
		<h1>{challengePool.description}</h1>
		{#if userId == challengePool.owner}
			<button on:click={deletePool} class="secondary outline w-auto mb-0">Delete</button>
		{/if}
		<OpenQuestionDrafts
			{challengePool}
			on:toast
			on:openQuestionCommitted={openQuestionCommitted}
			{baseUrl}
			{userId}
		/>
		<OpenQuestions bind:this={openQuestions} {challengePool} {baseUrl} {userId} />
	{/if}
</main>
