<script lang="ts">
	import Login from "./components/Login.svelte";
	import { store } from "./stores/auth.js";
	import ChallengePools from "./components/ChallengePools.svelte";
	import { DataStore } from "@aws-amplify/datastore";
	import TailwindCss from "./TailwindCss.svelte";
	import Navbar from "./components/Navbar.svelte";
	import Sidebar from "./components/Sidebar.svelte";
	import { SvelteToast, toast } from "@zerodevx/svelte-toast";
	import NewsletterSignUp from "./components/NewsletterSignUp.svelte";
	import WhatWeDo from "./components/WhatWeDo.svelte";

	let sidebarOpen = false;
	let showLogin = false;

	function login() {
		showLogin = true;
	}

	function logout() {
		$store = null;
		DataStore.clear();
	}

	function showToast(toastEvent) {
		let theme = {
			"--toastBackground": "#48BB78",
			"--toastBarBackground": "#2F855A",
		};
		toast.push(toastEvent.detail.text, {
			theme,
		});
	}
</script>

<TailwindCss />
<Sidebar bind:open={sidebarOpen} on:logout={logout} on:login={login} />
<Navbar bind:sidebar={sidebarOpen} on:logout={logout} />

{#if $store != null}
	<main class="container mx-auto py-4 px-2 max-w-screen-sm">
		<ChallengePools on:toast={showToast} />
	</main>
{:else if showLogin}
	<main class="container mx-auto py-4 px-2 max-w-screen-sm">
		<Login />
	</main>
{:else}
	<main class="container mx-auto py-4 px-2 max-w-screen-sm">
		<WhatWeDo />
	</main>
	<NewsletterSignUp />
{/if}
<SvelteToast />

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
<style>
	:global(body) {
		padding: 0;
	}
</style>
