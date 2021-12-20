<script lang="ts" context="module">
	import { ChallengePool } from '$lib/models';

	import { DataStore } from 'aws-amplify';

	import OpenQuestionDrafts from '$lib/components/OpenQuestionDrafts.svelte';
	import OpenQuestions from '$lib/components/OpenQuestions.svelte';

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

	function deleteClicked() {
		// TODO
	}

	function openQuestionCommitted() {
		openQuestions.fetchOpenQuestions();
	}
</script>

<main class="container py-4 max-w-screen-sm mx-auto">
	<details class="p-8" style="background: var(--card-sectionning-background-color);">
		<summary>{challengePool.description} </summary>
		{#if userId == challengePool.owner}
			<button on:click={deleteClicked} class="secondary outline w-auto mb-0">Delete</button>
		{/if}
		<div class="mt-2">
			<OpenQuestionDrafts
				{challengePool}
				on:toast
				on:openQuestionCommitted={openQuestionCommitted}
				{baseUrl}
				{userId}
			/>
			<OpenQuestions bind:this={openQuestions} {challengePool} {baseUrl} {userId} />
		</div>
	</details>
</main>
