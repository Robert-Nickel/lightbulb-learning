<script lang="ts">
	import { store } from '$lib/stores/auth';
	import StartPage from '$lib/components/StartPage.svelte';
	import ChallengePools from '$lib/components/ChallengePools.svelte';
</script>

{#if $store != null}
	<main class="container py-4 max-w-screen-sm"><ChallengePools /></main>
{:else}
	<StartPage />
{/if}

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
