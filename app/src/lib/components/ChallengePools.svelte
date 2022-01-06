<script lang="ts">
	import { goto } from '$app/navigation';
	import { supabase, challengePoolsTable } from '$lib/supabaseClient';
	import type { definitions } from '$lib/models/supabase';

	type challenge_pools = definitions['challenge_pools'];
	let challengePools: Array<challenge_pools> = [];
	let createChallengePoolDescription = '';

	fetchChallengePools();

	async function fetchChallengePools() {
		challengePools = await (await supabase.from<challenge_pools>(challengePoolsTable).select()).data;
	}

	async function createChallengePool() {
		await supabase
			.from<challenge_pools>(challengePoolsTable)
			.insert([{ description: createChallengePoolDescription, owner: supabase.auth.user().id }]);
		fetchChallengePools();

		createChallengePoolDescription = '';

		// TODO: Success Toast
	}
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
			<button on:click={createChallengePool} class="w-32">Create</button>
		</div>
	</div>
</div>

<style>
	.challengepool:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
