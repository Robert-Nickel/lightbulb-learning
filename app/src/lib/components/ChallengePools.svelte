<script lang="ts">
	import { DataStore } from '@aws-amplify/datastore';
	import { ChallengePool } from '../models';
	import { Hub } from 'aws-amplify';
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';

	const dispatch = createEventDispatcher();
	let challengePools: Array<ChallengePool> = [];
	fetchChallengePools();

	const listener = Hub.listen('datastore', async (hubData) => {
		const { event, data } = hubData.payload;
		if (event === 'ready') {
			fetchChallengePools();
			// This removes the listener
			listener();
		}
	});

	async function fetchChallengePools() {
		challengePools = await DataStore.query(ChallengePool);
	}

	async function createChallengePool() {
		const description = document.getElementById('challengePoolDescription').value;
		try {
			await DataStore.save(new ChallengePool({ description: description, owner: $user.id }));
		} catch (error) {
			console.log(error);
		}
		fetchChallengePools();
		document.getElementById('challengePoolDescription').value = '';
		dispatch('toast', { type: 'success', text: 'Challenge Pool created!' });
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
			<input id="challengePoolDescription" class="w-full" placeholder="Create new Challenge Pool" />
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
