<script lang="ts">
	import Login from "./Login.svelte";
	import { store } from "./stores/auth.js";
	import ChallengePools from "./components/ChallengePools.svelte";
	import { DataStore } from "@aws-amplify/datastore";

	function logout() {
		$store = null;
		DataStore.clear();
	}
</script>

<main>
	<h1>scalexam</h1> <button type="button" on:click={logout} style="float: right">Log Out</button>
	<br><br>
	{#if $store != null}
		<ChallengePools />

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
		max-width: 900px;
		margin: 0 auto;
	}

	h1 {
		color: #ff3e00;
		font-size: 4em;
		font-weight: 100;
	}

	@media (min-width: 640px) {
		main {
			max-width: none;
		}
	}
</style>
