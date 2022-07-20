<script lang="ts">
	import { routes } from '$lib/routes';
	import Hamburger from './Hamburger.svelte';
	import { session } from '$app/stores';

	export let supabaseClient;
</script>

<header class="flex p-2 items-center text-white justify-between">
	<div class="flex">
		<nav>
			<a
				href={routes.root}
				class="text-white"
				style="margin-top:0em; margin-bottom: 0.8em;"
				sveltekit:prefetch>Lightbulb Learning</a
			>
		</nav>
	</div>
	{#if $session.user}
		<nav style="margin-top:0em; margin-bottom: 0.8em;">
			{$session.user.email} &nbsp;
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				on:click={() => {
					supabaseClient.auth.signOut();
				}}
				style="cursor: pointer">Logout</a
			>
		</nav>
	{:else}
		<nav style="margin-top:0em; margin-bottom: 0.8em;">
			<!-- svelte-ignore a11y-missing-attribute -->
			<a href="/login"><button class="outline">Login</button></a>
		</nav>
	{/if}
</header>
