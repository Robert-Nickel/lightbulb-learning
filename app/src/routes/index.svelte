<script lang="ts">
	import { store } from '$lib/stores/auth';
	import ChallengePools from '$lib/components/ChallengePools.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import StartPage from '$lib/components/StartPage.svelte';

	function showToast(toastEvent) {
		let theme = {
			'--toastBackground': '#48BB78',
			'--toastBarBackground': '#2F855A'
		};
		toast.push(toastEvent.detail.text, {
			theme
		});
	}
</script>

{#if $store != null}
	<main class="container py-4 max-w-screen-sm">
		<ChallengePools on:toast={showToast} />
	</main>
{:else}
	<StartPage />
{/if}
<SvelteToast />

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
