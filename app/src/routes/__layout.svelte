<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';

	import { goto } from '$app/navigation';
	import { session } from '$app/stores';
	import { supabaseClient } from '$lib/db';
	import { SupaAuthHelper } from '@supabase/auth-helpers-svelte';

	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	const onUserUpdate = async (user) => {
		if (user) {
			goto('/course');
		}
	};

	onMount(() => {
		const hash = $page.url.hash;
		if (hash.includes('type=recovery')) {
			const accessToken = hash.slice(1).split('&')[0].split('=')[1];
			goto('reset-password/' + accessToken);
		}
	});
</script>

<Navbar {supabaseClient} />

<SupaAuthHelper {supabaseClient} {session} {onUserUpdate}>
	<main class="container py-4 max-w-screen-sm">
		<slot />
	</main>
</SupaAuthHelper>
