<script lang="ts">
	import StartPage from '$lib/components/StartPage.svelte';
	import ChallengePools from '$lib/components/ChallengePools.svelte';

	import { user } from '$lib/stores/user';
</script>

{#if $user}
	<main class="container py-4 max-w-screen-sm"><ChallengePools /></main>
{:else}
	<StartPage />
{/if}

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
