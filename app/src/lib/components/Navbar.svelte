<script lang="ts">
	import { routes } from '$lib/routes';
	import Hamburger from './Hamburger.svelte';
	export let sidebar = false;
</script>

<header class="flex p-2 items-center text-white">
	<nav class="flex">
		<Hamburger bind:open={sidebar} />
	</nav>
	<nav><a href={routes.root} class="text-white mb-0.5" sveltekit:prefetch>Lightbulb Learning</a></nav>
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
