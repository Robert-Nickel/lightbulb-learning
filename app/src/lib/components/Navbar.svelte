<script lang="ts">
	import Hamburger from './Hamburger.svelte';
	export let sidebar = false;
</script>

<header class="flex bg-black p-2 items-center text-white">
	<nav class="flex">
		<Hamburger bind:open={sidebar} />
	</nav>
	<nav><a href="/" class="text-white">Lightbulb Learning</a></nav>
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
