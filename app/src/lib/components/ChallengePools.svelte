<script lang="ts">
	import { fetchChallengePools, ChallengePoolType, saveChallengePool } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let challengePools: ChallengePoolType[] = [];
	let createChallengePoolDescription = '';

	onMount(async () => {
		challengePools = await fetchChallengePools();
	});
</script>

<h1 id="challenge-pools-title">Challenge Pools</h1>

{#each challengePools as challengePool}
	<a href={`/challengepool/${challengePool.id}`} class="light-link">
		<article class="hoverable">
			{challengePool.description}
		</article>
	</a>
{/each}

<div class="space-y-4">
	<div class="flex justify-between space-x-2">
		<div class="w-full">
			<input
				bind:value={createChallengePoolDescription}
				class="w-full"
				placeholder="Create new Challenge Pool"
			/>
		</div>
		<div>
			<button
				on:click={async () => {
					challengePools.push(await saveChallengePool(createChallengePoolDescription));
					createChallengePoolDescription = '';
					challengePools = await fetchChallengePools();
					// TODO: Success Toast
				}}
				class="w-32">Create</button
			>
		</div>
	</div>
</div>

<style>
	.hoverable:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
