<script lang="ts">
	import { DataStore } from '@aws-amplify/datastore';
	import { ChallengePool } from '../models';
	import ChallengePoolDetail from './ChallengePoolDetail.svelte';
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

<div class="flex flex-wrap justify-center">
	{#each challengePools as challengePool}
		<article class="w-96 m-5 cursor-pointer" on:click={() => goto(`/challengepools/${challengePool.id}`)}>
			<a href={`/challengepools/${challengePool.id}`}><h4>{challengePool.description}</h4> </a>

			<!-- TODO: warum wird immer 0 angezeigt? -->
			<div>Questions: {challengePool.OpenQuestionDrafts?.length ?? 0}</div>
			<div>Drafts: {challengePool.OpenQuestionDrafts?.length ?? 0}</div>
			<div>Last update: {challengePool.updatedAt}</div>
		</article>
	{/each}
</div>
