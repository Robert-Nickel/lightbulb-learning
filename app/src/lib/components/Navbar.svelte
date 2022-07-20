<script lang="ts">
	import { routes } from '$lib/routes';
	import Hamburger from './Hamburger.svelte';
	import { session } from '$app/stores';

	export let sidebar = false;
	export let supabaseClient;
</script>

<header class="flex p-2 items-center text-white justify-between">
	<div class="flex">
		<nav class="flex">
			<Hamburger bind:open={sidebar} />
		</nav>
		<nav>
			<a
				href={routes.root}
				class="text-white	"
				style="margin-top:0em; margin-bottom: 0.8em;"
				sveltekit:prefetch>Lightbulb Learning</a
			>
		</nav>
	</div>
	{#if $session.user}
		<nav>
			<button
				on:click={() => {
					supabaseClient.auth.signOut();
				}}
				class="outline">Logout</button
			>
		</nav>
	{/if}
</header>