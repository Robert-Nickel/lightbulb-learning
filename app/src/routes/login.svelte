<script>
	import Auth from 'supabase-ui-svelte';
	import { error, isLoading } from '@supabase/auth-helpers-svelte';
	import { supabaseClient } from '$lib/db';
	import { session } from '$app/stores';
</script>

{#if !$session.user}
	{#if $error}
		<p>{$error.message}</p>
	{/if}
	<h1>{$isLoading ? `Loading...` : `Loaded!`}</h1>
	<Auth {supabaseClient} providers={['github']} />
{:else}
	<button on:click={() => supabaseClient.auth.signOut()}>Sign out</button>
	<p>user:</p>
	<pre>{JSON.stringify($session.user, null, 2)}</pre>
{/if}
