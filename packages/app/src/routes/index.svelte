<script lang="ts">
	import Login from '$lib/components/Login.svelte';
	import { store } from '$lib/stores/auth';
	import ChallengePools from '$lib/components/ChallengePools.svelte';
	import { DataStore } from '@aws-amplify/datastore';
	import Navbar from '$lib/components/Navbar.svelte';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import { SvelteToast, toast } from '@zerodevx/svelte-toast';
	import NewsletterSignUp from '$lib/components/NewsletterSignUp.svelte';
	import WhatWeDo from '$lib/components/WhatWeDo.svelte';
	import { Auth } from 'aws-amplify';

	let sidebarOpen = false;
	let loginMode = '';
	const baseUrl: string = 'https://yybkc7efv3.execute-api.eu-central-1.amazonaws.com';

	function signin() {
		loginMode = 'signin';
	}

	function signup() {
		loginMode = 'signup';
	}

	function signout() {
		$store = null;
		DataStore.clear();
		loginMode = 'signin';
	}

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

<Sidebar bind:open={sidebarOpen} on:signout={signout} on:signin={signin} on:signup={signup} />
<Navbar bind:sidebar={sidebarOpen} />
{#if $store != null}
	{#await getUserId() then userId}
		<main class="container mx-auto py-4 px-2 max-w-screen-sm">
			<ChallengePools on:toast={showToast} {baseUrl} {userId} />
		</main>
	{/await}
{:else}
	<div
		class="bg-center bg-contain bg-no-repeat bg-black"
		style="background-image: url('/images/lightbulb.jpeg');"
	>
		<p class="text-7xl max-w-screen-sm mx-auto px-8 leading-snug pt-32 pb-8 text-white font-bold">
			Learning for the long run.
		</p>
	</div>
	{#if loginMode != ''}
		<main class="container">
			<Login mode={loginMode} />
		</main>
	{:else}
		<main class="container mx-auto py-4 px-2 max-w-screen-sm">
			<WhatWeDo />
		</main>
	{/if}
	<NewsletterSignUp />
{/if}
<SvelteToast />

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
<style>
	:global(body) {
		padding: 0;
	}
</style>
