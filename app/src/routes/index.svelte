<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';

	export const load: Load = async ({ session }) => {
		const { user } = session as Session;
		if (user) {
			return { status: 302, redirect: '/evaluateAuth' };
		}
		return {};
	};
</script>

<script lang="ts">
	import StartPage from '$lib/components/StartPage.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	let loginInProgress = $page.url.hash.includes('#access_token=');

	onMount(() => {
		if (loginInProgress) {
			// this was a redirect from the magic link.
			// By the time this line executes the supabase client did not yet write the token to localstorage therefore we need to defer the auth evaluation call a little bit
			setTimeout(() => location.replace(`${location.origin}/evaluateAuth`), 700);
		}
	});
</script>

{#if loginInProgress}
	<h3 class="text-center" aria-busy="true">logging in...</h3>
{:else}
	<StartPage />
{/if}

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
