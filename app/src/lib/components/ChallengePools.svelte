<script lang="ts">
	import { goto } from '$app/navigation';
	import { fetchChallengePools, ChallengePoolType, saveChallengePool } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let challengePools: ChallengePoolType[] = [];
	let createChallengePoolDescription = '';

	onMount(async () => {
		challengePools = await fetchChallengePools();
	});
</script>

<h1>Challenge Pools</h1>

<main class="container">
	{#each challengePools as challengePool}
		<div on:click={() => goto(`/challengepool/${challengePool.id}`)}>
			<article class="challengepool">
				{challengePool.description}
			</article>
		</div>
	{/each}
</main>

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
					await saveChallengePool(createChallengePoolDescription);
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
	.challengepool:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
