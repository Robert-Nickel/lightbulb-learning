<script>
	import { store } from "../stores/auth.js";
	import { createEventDispatcher } from "svelte";
	const dispatch = createEventDispatcher();

	export let open = false;

	function signin() {
		open = false;
		dispatch("signin");
	}

	function signup() {
		open = false;
		dispatch("signup");
	}

	function logout() {
		open = false;
		dispatch("signout");
	}
</script>

<aside
	class="absolute w-64 h-full bg-gray-800 text-white shadow-lg z-10 p-8 pt-24 space-y-2 text-xl cursor-default"
	class:open
>
	{#if $store == null}
		<nav on:click={signin}>Sign In</nav>
		<nav on:click={signup}>Sign Up</nav>
	{:else}
		<nav on:click={logout}>Sign Out</nav>
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
