<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	async function signIn() {
		const res = await supabase.auth.signIn({ provider: 'github' });
		console.log({ res });
	}
</script>

<main class="container">
	<h1 id="oauth-title">OAuth</h1>
	<button on:click={signIn}>Sign in with GitHub</button>
</main>
