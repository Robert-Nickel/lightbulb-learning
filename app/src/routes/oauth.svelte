<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	async function signIn() {
		supabase.auth.signIn({ provider: 'github' });
	}
</script>

<main class="container">
	<h1 id="oauth-title">OAuth</h1>
	<button on:click={signIn}>Sign in with GitHub</button>
</main>
