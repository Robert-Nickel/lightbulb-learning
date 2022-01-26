<script lang="ts">
	import CreateOpenQuestion from '$lib/components/CreateOpenQuestion.svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Back from '$lib/components/Back.svelte';
	import {
		ChallengePoolType,
		OpenQuestionType,
		fetchChallengePool,
		fetchOpenQuestions,
		deleteChallengePool,
		saveInviteCode
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';

	let challengePool: ChallengePoolType;
	let openQuestions: Array<OpenQuestionType> = [];
	let inviteCode: string;

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

		<CreateOpenQuestion {challengePool} on:openQuestionCommitted={refresh} />

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
			<div class="flex space-x-2">
				<button
					on:click={async () => {
						const randomTenCharString = Math.random().toString(16).substring(2, 12);
						inviteCode = (await saveInviteCode(challengePool.id, randomTenCharString)).code;
						navigator.clipboard.writeText(inviteCode);
					}}
					class="secondary outline w-auto mb-0"
					>Generate Invite Code
				</button>

				<button
					on:click={async () => {
						if (
							confirm(
								'Everything within ' + challengePool.description + ' will be gone forever.\nAre you really sure?'
							)
						) {
							await deleteChallengePool(challengePool.id);
							goto('/');
						}
					}}
					class="secondary outline w-auto mb-0 hover-red">Delete {challengePool.description}</button
				>
			</div>
			{#if inviteCode}
				<div class="mt-3">
					Invite Code: <a
						on:click={() => {
							navigator.clipboard.writeText(inviteCode);
						}}
						data-tooltip="Copy to Clipboard">{inviteCode}</a
					> (valid: 7 days)
				</div>
			{/if}
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
