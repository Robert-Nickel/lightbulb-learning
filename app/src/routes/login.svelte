<script>
	import Auth from 'supabase-ui-svelte';
	import { supabaseClient } from '$lib/db';
	import { session } from '$app/stores';
</script>

<main class="container">
	<h1>Login</h1>
	{#if !$session.user}
		<Auth {supabaseClient} providers={['github']} />
	{:else}
		<p>You are already logged in.</p>
		<button on:click={() => supabaseClient.auth.signOut()} class="w-32">Logout</button>
	{/if}
</main>