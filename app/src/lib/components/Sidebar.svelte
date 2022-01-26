<script>
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';

	export let open = false;

	async function logout() {
		open = false;
		// TODO: This throws an error. We don't handle it. See https://github.com/supabase/supabase/discussions/3468?sort=top
		user.signOut();
		goto('/login');
	}

	function close() {
		open = false
	}
</script>

<aside
	class="absolute w-64 h-full bg-gray-800 text-white shadow-lg z-10 p-8 pt-24 space-y-2 text-xl cursor-default"
	class:open
>
	<!-- Ignore this -->

	{#if $user}
		<nav on:click={close}><a href="/create">Create Challenge Pool</a></nav>
		<nav on:click={close}><a href="/join">Join Challenge Pool</a></nav>
		<nav on:click={logout}><a href="/">Logout</a></nav>
	{:else}
		<nav on:click={close}><a href="/login">Login</a></nav>
	{/if}
	<nav on:click={close}><a href="/help">Help</a></nav>
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
