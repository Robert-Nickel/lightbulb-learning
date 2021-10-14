<script lang="ts">
	import Login from "./Login.svelte";
	import { store } from "./stores/auth.js";
	import { API, graphqlOperation } from "aws-amplify";
	import { createChallengePool } from "./graphql/mutations";
	import { listChallengePools } from "./graphql/queries";
	import type { ChallengePool } from "./API";
	import { onCreateChallengePool } from "./graphql/subscriptions";

	import { onMount } from "svelte";

	let challengePools = [];

	function logout() {
		$store = null;
	}

	onMount(() => {
		API.graphql(graphqlOperation(listChallengePools)).then((data) => {
			console.log({ data });
			challengePools = data.data.listChallengePools.items;
		});
	});
</script>

<main>
	<h2>scalexam</h2>

	{#if $store != null}
		<h1>You are logged in</h1>
		<button type="button" on:click={logout}>Log Out</button>
		<pre>
    <!---{JSON.stringify($store, null, 2)}--->
  </pre>
		{#each challengePools as challengePool}
			<p>{challengePool.description}</p>
		{/each}
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
