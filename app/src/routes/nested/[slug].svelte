<script lang="ts">
	import { ChallengePool } from '$lib/models';
	import { DataStore } from 'aws-amplify';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	export let baseUrl: string;
	export let userId: string;

	let challengePool;

	onMount(async () => {
		const poolId = $page.params.slug;
		try {
			challengePool = await DataStore.query(ChallengePool, poolId);
		} catch (error) {
			throw new Error(`There is no challenge pool with id ${poolId}`);
		}
	});
</script>

<main class="container">
	{#if challengePool}
		<h1>{challengePool.description}</h1>
	{/if}
	slug is: {$page.params.slug}
</main>
