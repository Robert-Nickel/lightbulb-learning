<script lang="ts">
	import Login from "./Login.svelte";
	import { store } from "./stores/auth.js";
	import { API, graphqlOperation } from "aws-amplify";
	import {
		createChallengePool,
		deleteChallengePool,
	} from "./graphql/mutations";
	import { listChallengePools } from "./graphql/queries";

	import { ChallengePool } from "./models";

	function logout() {
		$store = null;
	}

	async function fetchChallengePools() {
		const result = await API.graphql(graphqlOperation(listChallengePools));
		console.log("Fetched challenge models", result);
		return result.data.listChallengePools.items;
	}

	async function createChallengePoolFunc(input) {
		try {
			const challengePool = { description: input.value };
			const result = await API.graphql(
				graphqlOperation(createChallengePool, { input: challengePool })
			);
			console.log("Created new challenge pool", result);
			fetchChallengePoolsPromise = fetchChallengePools();
		} catch (error) {
			console.log("Error creating challenge pool", error);
		}
	}

	let fetchChallengePoolsPromise = fetchChallengePools();
</script>

<main>
	<h2>scalexam</h2>

	{#if $store != null}
		<h1>You are logged in</h1>
		<button type="button" on:click={logout}>Log Out</button>
		<pre>
    <!---{JSON.stringify($store, null, 2)}--->
  </pre>
		<input
			placeholder="Whats the name of the new challenge pool?"
			on:keydown={(e) =>
				e.key === "Enter" && createChallengePoolFunc(e.target)}
		/>

		{#await fetchChallengePoolsPromise}
			<p>...loading challenge pools</p>
		{:then challengePools}
			{#each challengePools as challengePool}
				<p>{challengePool.description}</p>
			{/each}
		{:catch error}
			<p style="color: red">{error.message}</p>
		{/await}
		<!--<OpenQuestionProposalsOverview {openQuestionProposals} />
    <ProposeOpenQuestion on:openQuestionProposed={handleOpenQuestionProposed} />-->
	{:else}
		<Login />
	{/if}
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 240px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
