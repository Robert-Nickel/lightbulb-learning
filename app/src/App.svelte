<script lang="ts">
	import Login from "./Login.svelte";
	import { store } from "./stores/auth.js";

	function logout() {
		$store = null;
	}
</script>

<main>
	<h2>scalexam</h2>

	{#if $store != null}
		<h1>
			You are logged in <button type="button" on:click={logout}
				>Log Out</button
			>
		</h1>
		<pre>
    {JSON.stringify($store, null, 2)}
  </pre>
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
