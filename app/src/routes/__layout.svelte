<script lang="ts">
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { supabaseClient } from '$lib/db';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';

	let sidebarOpen = false;

	const onUserUpdate = async (user) => {
		if (user) await goto('/course');
	};
</script>

<Sidebar bind:open={sidebarOpen} />
<Navbar bind:sidebar={sidebarOpen} />

<SupaAuthHelper {supabaseClient} {session} {onUserUpdate}>
	{#if $session.user}
		<main class="container py-4 max-w-screen-sm">
			<slot />
		</main>
	{:else}
		<slot />
	{/if}
</SupaAuthHelper>
