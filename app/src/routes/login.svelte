<script>
	import Auth from '$lib/components/supabase-ui-svelte/Auth.svelte';
	import { supabaseClient } from '$lib/db';
	import { session } from '$app/stores';
	import { routes } from '$lib/routes';
</script>

<main class="container">
	<h1>Login</h1>
	{#if $session.user && $session.user.id}
		<p>Success!</p>
	{:else}
		<Auth {supabaseClient} providers={['GitHub']} redirectAfterLogin={routes.courses} />
	{/if}
</main>
