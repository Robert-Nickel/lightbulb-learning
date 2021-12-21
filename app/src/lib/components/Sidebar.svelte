<script>
	import { store } from '$lib/stores/auth';
	import { DataStore } from '@aws-amplify/datastore';

	export let open = false;

	function logout() {
		open = false;
		$store = null;
		DataStore.clear();
	}
</script>

<aside
	class="absolute w-64 h-full bg-gray-800 text-white shadow-lg z-10 p-8 pt-24 space-y-2 text-xl cursor-default"
	class:open
>
	{#if $store == null}
		<nav on:click={() => (open = false)}><a href="/register">Register</a></nav>
		<nav on:click={() => (open = false)}><a href="/login">Login</a></nav>
	{:else}
		<nav on:click={logout}><a href="/">Logout</a></nav>
	{/if}
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out;
	}

	.open {
		left: 0;
	}
</style>
