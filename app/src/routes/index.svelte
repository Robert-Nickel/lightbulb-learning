<script lang="ts">
	import { store } from '$lib/stores/auth';
	import ChallengePools from '$lib/components/ChallengePools.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import StartPage from '$lib/components/StartPage.svelte';
	import { Auth } from 'aws-amplify';

	const baseUrl: string = 'https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com';

	function showToast(toastEvent) {
		let theme = {
			'--toastBackground': '#48BB78',
			'--toastBarBackground': '#2F855A'
		};
		toast.push(toastEvent.detail.text, {
			theme
		});
	}

	async function getUserId(): Promise<string> {
		const user = await Auth.currentAuthenticatedUser();
		return user.attributes.sub;
	}
</script>

{#if $store != null}
	<main class="container py-4 max-w-screen-sm">
		{#await getUserId() then userId}
			<ChallengePools on:toast={showToast} {baseUrl} {userId} />
		{/await}
	</main>
{:else}
	<StartPage />
{/if}
<SvelteToast />

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
