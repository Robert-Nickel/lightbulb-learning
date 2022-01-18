<script lang="ts">
	import StartPage from '$lib/components/StartPage.svelte';
	import ChallengePools from '$lib/components/ChallengePools.svelte';

	import { user } from '$lib/stores/user';
	import { onMount } from 'svelte';
	import { fetchProfile } from '$lib/supabaseClient';
	import { goto } from '$app/navigation';

	onMount(async () => {
		if ($user) {
			const profile = await fetchProfile($user.id);
			if (!profile) {
				goto('/welcome');
			}
		}
	});
</script>

{#if $user}
	<main class="container py-4 max-w-screen-sm"><ChallengePools /></main>
{:else}
	<StartPage />
{/if}

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
