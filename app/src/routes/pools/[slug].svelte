<script lang="ts">
	import { store } from '$lib/stores/auth';
	import { Auth } from 'aws-amplify';

	async function getUserId(): Promise<string> {
		const user = await Auth.currentAuthenticatedUser();
		return user.attributes.sub;
	}
</script>

BLASD
<!-- TODO: alles -->
{#if $store != null}
	{#await getUserId() then userId}
		<main class="container mx-auto py-4 px-2 max-w-screen-sm">
			<!-- <ChallengePools on:toast={showToast} {baseUrl} {userId} /> -->
		</main>
	{/await}
{/if}
