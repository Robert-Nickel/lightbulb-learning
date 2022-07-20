<script>
	import Auth from '$lib/components/supabase-ui-svelte/Auth.svelte';
	import { supabaseClient } from '$lib/db';
	import { session } from '$app/stores';
	import { routes } from '$lib/routes';
	import { goto } from '$app/navigation';

	$: {
		if ($session.user && $session.user.id) {
			goto(routes.courses);
		}
	}
</script>

<main class="container">
	<h1>Login</h1>
	<Auth {supabaseClient} providers={['GitHub']} redirectAfterLogin={routes.courses} />
</main>
