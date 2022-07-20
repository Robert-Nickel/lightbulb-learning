<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { supabaseClient } from '$lib/db';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';

	const onUserUpdate = async (user) => {
		if (user) {
			goto('/course');
		}
	};
</script>

<Navbar {supabaseClient} />

<SupaAuthHelper {supabaseClient} {session} {onUserUpdate}>
	<main class="container py-4 max-w-screen-sm">
		<slot />
	</main>
</SupaAuthHelper>
