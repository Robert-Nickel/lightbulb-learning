<script lang="ts">
	import { DataStore } from '@aws-amplify/datastore';
	import { ChallengePool } from '../models';
	import { Hub } from 'aws-amplify';
	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import { getGroup } from '$lib/stores/auth';

	const dispatch = createEventDispatcher();
	let challengePools: Array<ChallengePool> = [];
	let createChallengePoolDescription = '';
	let groupID: string = 'some_default';

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
		try {
			groupID = await getGroup();
		} catch (error) {
			console.error(error);
		}
		console.log('Filtering challenge pools with groupId: ' + groupID);
		challengePools = await DataStore.query(ChallengePool, (p) => p.groupID('eq', groupID));
	}

	async function createChallengePool() {
		try {
			const ownerString = $user.id.toString();
			console.log("os", ownerString);

			await DataStore.save(
				new ChallengePool({ 
					description: createChallengePoolDescription, 
					owner: "ownerString",
					groupID 
				})
			);
		} catch (error) {
			console.log(error);
		}
		fetchChallengePools();
		createChallengePoolDescription = '';
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
