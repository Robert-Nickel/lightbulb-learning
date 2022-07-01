<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import Hamburger from './Hamburger.svelte';

	export let sidebar = false;
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
	<!--{#if !$user}
		<nav>
			<button
				class="outline"
				on:click={() => {
					goto(routes.login);
				}}>Login</button
			>
		</nav>
	{/if}-->
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
