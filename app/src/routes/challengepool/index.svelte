<script lang="ts" context="module">
	export const load: Load = async ({ session }) => {
		const { user } = session as Session;
		return {
			props: {
				user,
				challengePools: await fetchChallengePools(user.id)
			}
		};
	};
</script>

<script lang="ts">
	import { routes } from '$lib/routes';
	import { fetchChallengePools, ChallengePoolType } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';

	export let challengePools: ChallengePoolType[] = [];
</script>

<main class="container py-4 max-w-screen-sm">
	<h1 id="challenge-pools-title">Challenge Pools</h1>
	{#if challengePools.length == 0}<div class="space-y-4">
			<p>You don't have a challenge pool yet! Join one with an invite code, or create one yourself.</p>

			<p>
				Use <a
					on:click={() => {
						navigator.clipboard.writeText('GNRLWISDOM');
					}}
					data-tooltip="Copy to Clipboard">GNRLWISDOM</a
				> to see an example of what a challenge pool is.
			</p>

			<div class="flex space-x-4 pt-4">
				<a href={routes.join} role="button" class="outline" sveltekit:prefetch>Join with invite code</a>
				<a href={routes.create} role="button" class="outline" sveltekit:prefetch>Create Challenge Pool</a>
			</div>
		</div>
	{:else}
		{#each challengePools as challengePool}
			<a href={routes.challengePool(challengePool.id)} class="light-link" sveltekit:prefetch>
				<article class="hoverable">
					{challengePool.description}
				</article>
			</a>
		{/each}
	{/if}
</main>

<style>
	.hoverable:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
