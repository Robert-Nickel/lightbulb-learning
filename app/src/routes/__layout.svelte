<script lang="ts">
	import { store } from '$lib/stores/auth';
	import { browser } from '$app/env';
	import '../app.css';
	import Amplify from '@aws-amplify/core';
	import aws_exports from '../aws-exports';
	import * as process from 'process';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import { Auth } from 'aws-amplify';

	const baseUrl: string = 'https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com';

	if (browser) {
		Amplify.configure(aws_exports);
		// Based on https://github.com/aws-amplify/amplify-js/issues/3274#issuecomment-497773026
		window['process'] = process;
	}

	export async function getUserId(): Promise<string> {
		const user = await Auth.currentAuthenticatedUser();
		return user.attributes.sub;
	}

	let sidebarOpen = false;
</script>

<Sidebar bind:open={sidebarOpen} />
<Navbar bind:sidebar={sidebarOpen} />

{#if $store != null}
	{#await getUserId() then userId}
		<main class="container py-4 max-w-screen-sm">
			<slot {userId} {baseUrl} />
		</main>
	{/await}
{:else}
	<slot {baseUrl} />
{/if}
