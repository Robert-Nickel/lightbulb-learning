<script>
import { goto } from '$app/navigation';

	import { user } from '$lib/stores/user';
import { supabase } from '$lib/supabaseClient';

	export let open = false;

	async function logout() {
		open = false;
		// TODO: This throws an error. We don't handle it. See https://github.com/supabase/supabase/discussions/3468?sort=top
		supabase.auth.signOut();
		goto('/');
	}
</script>

<aside
	class="absolute w-64 h-full bg-gray-800 text-white shadow-lg z-10 p-8 pt-24 space-y-2 text-xl cursor-default"
	class:open
>
	{#if $user}
		<nav on:click={logout}><a href="/logout">Logout</a></nav>
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
