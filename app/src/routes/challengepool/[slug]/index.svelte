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
		fetchOpenQuestions,
		deleteChallengePool
	} from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';
	import { user } from '$lib/stores/user';
	import { routes } from '$lib/routes';
	import Performances from '$lib/components/Performances.svelte';
	import ManageTopics from '$lib/components/ManageTopics.svelte';
	import GenerateInviteCode from '$lib/components/GenerateInviteCode.svelte';
	import DeleteChallengePool from '$lib/components/DeleteChallengePool.svelte';

	enum Tab {
		OpenQuestions,
		Performances,
		Settings
	}

	export let challengePool: ChallengePoolType;
	export let openQuestions: Array<OpenQuestionType> = [];
	let activeTab = Tab.OpenQuestions;

	async function refreshOpenQuestions() {
		openQuestions = await fetchOpenQuestions(challengePool.id);
	}
</script>

<main class="container">
	{#if challengePool}
		<h1>{challengePool.description}</h1>

		{#if $user.id == challengePool.owner}
			<header class="flex p-2 space-x-4 border-b-2 ">
				<nav
					class={activeTab == Tab.OpenQuestions ? 'activeNavElement' : ''}
					on:click={() => {
						activeTab = Tab.OpenQuestions;
						console.log(activeTab);
					}}
				>
					Open Questions
				</nav>
				<nav
					class={activeTab == Tab.Performances ? 'activeNavElement' : ''}
					on:click={() => {
						activeTab = Tab.Performances;
						console.log(activeTab);
					}}
				>
					Performances
				</nav>
				<nav
					class={activeTab == Tab.Settings ? 'activeNavElement' : ''}
					on:click={() => {
						activeTab = Tab.Settings;
						console.log(activeTab);
					}}
				>
					Settings
				</nav>
			</header>
		{/if}

		{#if activeTab == Tab.OpenQuestions}
			<CreateOpenQuestion {challengePool} on:openQuestionCommitted={refreshOpenQuestions} />

			{#if openQuestions.length > 0}
				<h3 class="mt-10">Open Questions</h3>
			{/if}
			{#each openQuestions as openQuestion}
				<a href={routes.openQuestion(openQuestion.id)} class="light-link" sveltekit:prefetch>
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
		{:else if activeTab == Tab.Performances}
			<Performances {challengePool} />
		{:else if activeTab == Tab.Settings}
			<ManageTopics challengePoolId={challengePool.id} />
			<GenerateInviteCode challengePoolId={challengePool.id} />
			<DeleteChallengePool {challengePool} />
		{/if}
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
