<script>
	import { store } from "../stores/auth.js";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let open = false;

	function login() {
		open = false;
		dispatch("login");
	}

	function logout() {
		open = false;
		dispatch("logout");
	}
</script>

<aside
	class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg z-10"
	class:open
>
	{#if $store == null}
		<nav on:click={login} class="p-12 text-xl">Login / Register</nav>
	{:else}
		<nav on:click={logout} class="p-12 text-xl">Logout</nav>
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
