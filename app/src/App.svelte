<script lang="ts">
	import Login from "./components/Login.svelte";
	import { store } from "./stores/auth.js";
	import ChallengePools from "./components/ChallengePools.svelte";
	import { DataStore } from "@aws-amplify/datastore";
	import TailwindCss from "./TailwindCss.svelte";
	import Navbar from "./components/Navbar.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	import { SvelteToast } from "@zerodevx/svelte-toast";

	let open = false;

	function logout() {
		$store = null;
		DataStore.clear();
	}
</script>

<TailwindCss />
<Sidebar bind:open on:logout={logout} />
<Navbar bind:sidebar={open} on:logout={logout} />
<main class="container mx-auto py-4 px-2 max-w-screen-sm">
	{#if $store != null}
		<ChallengePools />
	{:else}
		<Login />
	{/if}
</main>
<SvelteToast />

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
<style>
	:global(body) {
		padding: 0;
	}
</style>
