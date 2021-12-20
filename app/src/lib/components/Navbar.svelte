<script lang="ts">
	import Logo from './Logo.svelte';
	import Hamburger from './Hamburger.svelte';

	export let sidebar = false;
</script>

<header class="flex justify-between bg-black p-2 items-center text-white">
	<nav class="flex">
		<Hamburger bind:open={sidebar} />
		<p class="text-white mt-2">Lightbulb Learning</p>
	</nav>
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
