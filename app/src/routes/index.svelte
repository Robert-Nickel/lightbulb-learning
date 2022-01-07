<script lang="ts">
	import StartPage from '$lib/components/StartPage.svelte';
	import ChallengePools from '$lib/components/ChallengePools.svelte';

	import { user } from '$lib/stores/sessionStore';
	import { supabase } from '$lib/supabaseClient';

	user.set(supabase.auth.user());

	supabase.auth.onAuthStateChange((_, session) => {
		user.set(session.user);
	});
</script>

<div class="container" style="padding: 50px 0 100px 0;">
	{#if $user}
		<main class="container py-4 max-w-screen-sm"><ChallengePools /></main>
	{:else}
		<StartPage />
	{/if}
</div>

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
