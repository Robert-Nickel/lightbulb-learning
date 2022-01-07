<script>
	import { supabase } from '$lib/supabaseClient';
	import { user } from '$lib/stores/sessionStore';

	export let open = false;

	async function logout() {
		open = false;
		try {
			let { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			alert(error.message);
		}
	}
</script>

<aside
	class="absolute w-64 h-full bg-gray-800 text-white shadow-lg z-10 p-8 pt-24 space-y-2 text-xl cursor-default"
	class:open
>
	{#if $user}
		<nav on:click={logout}><a href="/">Logout</a></nav>
	{:else}
		<nav on:click={() => (open = false)}><a href="/login">Login</a></nav>
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
