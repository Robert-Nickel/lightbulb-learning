<script lang="ts">
	import OpenQuestionDrafts from '$lib/components/OpenQuestionDrafts.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { user } from '$lib/stores/user';
	import Back from '$lib/components/Back.svelte';
	import { challengePoolsTable, openQuestionsTable, supabase } from '$lib/supabaseClient';
	import type { definitions } from '$lib/models/supabase';

	type challenge_pool = definitions['challenge_pools'];
	type open_question = definitions['open_questions'];

	let challengePool: challenge_pool;
	let openQuestions: Array<open_question> = [];

	onMount(() => {
		refresh();
	});

	async function refresh() {
		const id = $page.params.slug;
		challengePool = await (
			await supabase.from<challenge_pool>(challengePoolsTable).select().eq('id', id).single()
		).data;
		openQuestions = await (
			await supabase.from<open_question>(openQuestionsTable).select().eq('challenge_pool', id)
		).data;
	}

	async function deletePool() {
		await supabase.from('challenge_pools').delete().eq('id', challengePool.id);
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
			<div on:click={() => goto(`/openquestion/${openQuestion.id}`)}>
				{#if openQuestion.owner == supabase.auth.user().id}
					<article class="yours question">
						<i>You asked:</i>
						{openQuestion.questionText}
					</article>
				{:else}
					<article class="hoverable">
						{openQuestion.questionText}
					</article>
				{/if}
			</div>
		{/each}

		{#if supabase.auth.user().id == challengePool.owner}
			<button on:click={deletePool} class="secondary outline w-auto mb-0"
				>Delete {challengePool.description}</button
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
