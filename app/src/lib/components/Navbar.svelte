<script lang="ts">
	import Hamburger from './Hamburger.svelte';
	export let sidebar = false;
	// TODO: auslesen der Descirption aus Gruppe
	let level = 'Free';
</script>

<header class="flex p-2 items-center text-white">
	<nav class="flex">
		<Hamburger bind:open={sidebar} />
	</nav>
	<nav><a href="/" class="text-white">Lightbulb Learning</a></nav>
	<nav class="ml-4">{level}</nav>
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
