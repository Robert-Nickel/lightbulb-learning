<script lang="ts">
	import { user } from '$lib/stores/user';

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import OpenQuestionDrafts from './OpenQuestionDrafts.svelte';
	import OpenQuestions from './OpenQuestions.svelte';

	export let challengePool;

	let openQuestions;

	function deleteClicked() {
		dispatch('deleteClicked');
	}

	function openQuestionCommitted() {
		openQuestions.fetchOpenQuestions();
	}
</script>

<details class="p-8" style="background: var(--card-sectionning-background-color);">
	<summary>{challengePool.description} </summary>
	{#if $user.id == challengePool.owner}
		<button on:click={deleteClicked} class="secondary outline w-auto mb-0">Delete</button>
	{/if}
	<div class="mt-2">
		<OpenQuestionDrafts {challengePool} on:toast on:openQuestionCommitted={openQuestionCommitted} />
		<OpenQuestions bind:this={openQuestions} {challengePool} />
	</div>
</details>
