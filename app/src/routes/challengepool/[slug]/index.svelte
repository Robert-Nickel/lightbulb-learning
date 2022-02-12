<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const challengePool = await fetchChallengePool(params.slug);
		const openQuestions = await fetchOpenQuestions(challengePool.id);
		return {
			props: {
				user,
				challengePool,
				openQuestions
			}
		};
	};
</script>

<script lang="ts">
	import CreateOpenQuestion from '$lib/components/CreateOpenQuestion.svelte';
	import { goto } from '$app/navigation';
	import Back from '$lib/components/Back.svelte';
	import {
		ChallengePoolType,
		OpenQuestionType,
		fetchChallengePool,
		fetchOpenQuestions
	} from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';
	import { user } from '$lib/stores/user';

	export let challengePool: ChallengePoolType;
	export let openQuestions: Array<OpenQuestionType> = [];

	async function refreshOpenQuestions() {
		openQuestions = await fetchOpenQuestions(challengePool.id);
	}
</script>

<main class="container">
	{#if challengePool}
		<h1>{challengePool.description}</h1>

		{#if $user.id == challengePool.owner}
			<header class="flex p-2 space-x-4 border-b-2 ">
				<nav class="activeNavElement">Open Questions</nav>
				<nav
					on:click={() => {
						goto('/challengepool/' + challengePool.id + '/settings');
					}}
				>
					Settings
				</nav>
			</header>
		{/if}

		<CreateOpenQuestion {challengePool} on:openQuestionCommitted={refreshOpenQuestions} />

		{#if openQuestions.length > 0}
			<h3 class="mt-10">Open Questions</h3>
		{/if}
		{#each openQuestions as openQuestion}
			<a href={`/openquestion/${openQuestion.id}`} class="light-link" sveltekit:prefetch>
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
	{/if}

	<Back route="/challengepool" text="Back to all Challenge Pools" />
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
