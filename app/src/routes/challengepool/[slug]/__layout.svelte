<script lang="ts" context="module">
	export const load: Load = async ({ session, params, url }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const pathSegments = url.pathname.split('/');
		const routeLastSegment = pathSegments[pathSegments.length - 1];
		const challengePool = await fetchChallengePool(params.slug);
		return {
			props: {
				challengePool,
				routeLastSegment
			}
		};
	};
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import { ChallengePoolType, fetchChallengePool } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	enum Tab {
		OpenQuestions,
		Performances,
		Settings
	}

	export let challengePool: ChallengePoolType;
	export let routeLastSegment: string;
	$: activeTab =
		routeLastSegment == 'settings'
			? Tab.Settings
			: routeLastSegment == 'performances'
			? Tab.Performances
			: Tab.OpenQuestions;
</script>

<main class="container">
	{#if challengePool}
		<h1>{challengePool.description}</h1>

		{#if $user.id == challengePool.owner}
			<header class="flex p-2 space-x-4 border-b-2 ">
				<nav
					class={activeTab == Tab.OpenQuestions ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.challengePool(challengePool.id));
						activeTab = Tab.OpenQuestions;
					}}
				>
					Open Questions
				</nav>
				<nav
					class={activeTab == Tab.Performances ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.challengePoolPerformances(challengePool.id));
						activeTab = Tab.Performances;
					}}
				>
					Performances
				</nav>
				<nav
					class={activeTab == Tab.Settings ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.challengePoolSettings(challengePool.id));
						activeTab = Tab.Settings;
					}}
				>
					Settings
				</nav>
			</header>
		{/if}

		<slot />
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
