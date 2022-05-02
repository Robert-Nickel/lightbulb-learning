<script lang="ts" context="module">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';

	export const load: Load = async ({ session, url }) => {
		const { user } = session as Session;
		if (url.href.includes(routes.logout)) {
			return {};
		}
		if (user) {
			return { status: 302, redirect: routes.evaluateAuth };
		}
		return {};
	};
</script>

<script lang="ts">
	import StartPage from '$lib/components/StartPage.svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { routes } from '$lib/routes';

	let loginInProgress = $page.url.hash.includes('#access_token=');
	let logoutInProgress = $page.url.href.includes(routes.logout);
	$: logInOutText = loginInProgress ? 'Logging in...' : logoutInProgress ? 'Logging out...' : undefined;

	onMount(() => {
		if (loginInProgress || logoutInProgress) {
			// this was a redirect from the magic link or logout.
			// By the time this line executes the supabase client did not yet write/delete the token from localstorage therefore we need to defer the auth progress call a little bit
			setTimeout(() => location.replace(`${location.origin}${routes.evaluateAuth}`), 1000);
		}
	});
</script>

{#if logInOutText}
	<h3 class="text-center" aria-busy="true">{logInOutText}</h3>
{:else}
	<StartPage />
{/if}

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
