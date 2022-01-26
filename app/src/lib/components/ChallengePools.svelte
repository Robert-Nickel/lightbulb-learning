<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchChallengePools, ChallengePoolType } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let challengePools: ChallengePoolType[] = [];

	onMount(async () => {
		challengePools = await fetchChallengePools();
	});
</script>

<h1 id="challenge-pools-title">Challenge Pools</h1>
{#if challengePools.length == 0}<div class="space-y-4">
		<p>You don't have a challenge pool yet! Join one with an invite code, or create one yourself.</p>

		<p>
			Use <a
				on:click={() => {
					navigator.clipboard.writeText('RCTVSYSTMS');
				}}
				data-tooltip="Copy to Clipboard">RCTVSYSTMS</a
			> for Reactive Systems.
		</p>

		<div class="flex justify-between space-x-4">
			<button
				class="outline"
				on:click={() => {
					goto('/join');
				}}>Join with invite code</button
			><button
				class="outline"
				on:click={() => {
					goto('/create');
				}}>Create Challenge Pool</button
			>
		</div>
	</div>
{:else}
	{#each challengePools as challengePool}
		<a href={`/challengepool/${challengePool.id}`} class="light-link">
			<article class="hoverable">
				{challengePool.description}
			</article>
		</a>
	{/each}
{/if}

<style>
	.hoverable:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
