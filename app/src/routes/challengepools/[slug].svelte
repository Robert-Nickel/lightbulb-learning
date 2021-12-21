<script lang="ts" context="module">
	import { ChallengePool } from '$lib/models';
	import { DataStore } from 'aws-amplify';
	import OpenQuestionDrafts from '$lib/components/OpenQuestionDrafts.svelte';
	import OpenQuestions from '$lib/components/OpenQuestions.svelte';
	import { goto } from '$app/navigation';
	let challengePool;
	export let baseUrl: string;
	export let userId: string;
	let openQuestions;
	/** @type {import('@sveltejs/kit').Load} */
	export async function load({ page, fetch, session, stuff }) {
		const challengePoolId = page.params.slug;
		try {
			challengePool = await DataStore.query(ChallengePool, challengePoolId);
			return challengePool;
		} catch (error) {
			return {
				status: 404,
				error: new Error(`There is no challenge pool with this id.`)
			};
		}
	}
	async function deletePool() {
		await DataStore.delete(await DataStore.query(ChallengePool, challengePool.id));
		goto('/');
	}
	function openQuestionCommitted() {
		openQuestions.fetchOpenQuestions();
	}
</script>

<main class="container">
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
</main>
