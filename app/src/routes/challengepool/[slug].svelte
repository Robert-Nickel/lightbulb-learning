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

	const openQuestionsString = 'open_questions';
	const settingsString = 'settings';

	let challengePool: ChallengePoolType;
	let openQuestions: Array<OpenQuestionType> = [];
	let inviteCode: string;
	let currentTab = 'open_questions';

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

		{#if $user.id == challengePool.owner}
			<header class="flex p-2 space-x-4 border-b-2 ">
				<nav
					class={currentTab === openQuestionsString ? 'activeNavElement' : ''}
					on:click={() => {
						currentTab = openQuestionsString;
					}}
				>
					Open Questions
				</nav>
				<nav
					class={currentTab === settingsString ? 'activeNavElement' : ''}
					on:click={() => {
						currentTab = settingsString;
					}}
				>
					Settings
				</nav>
			</header>
		{/if}

		{#if currentTab == openQuestionsString}
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
						<article class="hover:">
							{openQuestion.questionText}
						</article>
					{/if}
				</a>
			{/each}
		{:else if currentTab == settingsString}
			<button
				on:click={async () => {
					const randomTenCharString = Math.random().toString(16).substring(2, 12);
					inviteCode = (await saveInviteCode(challengePool.id, randomTenCharString)).code;
					navigator.clipboard.writeText(inviteCode);
				}}
				class="secondary outline w-auto my-4"
				>Generate Invite Code
			</button>
			{#if inviteCode}
				<div class="mb-4">
					Invite Code: <a
						on:click={() => {
							navigator.clipboard.writeText(inviteCode);
						}}
						data-tooltip="Copy to Clipboard">{inviteCode}</a
					> (valid: 7 days)
				</div>
			{/if}

			<button
				on:click={async () => {
					if (
						confirm(
							'Everything within ' +
								challengePool.description +
								' will be gone forever.\nAre you really sure?'
						)
					) {
						await deleteChallengePool(challengePool.id);
						goto('/');
					}
				}}
				class="secondary outline w-auto mb-0 hover-red">Delete {challengePool.description}</button
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

	header {
		border-color: var(--card-sectionning-background-color);
	}

	nav {
		color: var(--secondary);
	}

	nav:hover {
		color: var(--white);
		font-weight: 500;
		border-color: var(--primary);
	}

	.activeNavElement {
		color: var(--white);
		font-weight: 500;
		border-color: var(--primary);
	}
</style>
