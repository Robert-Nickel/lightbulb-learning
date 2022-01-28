<script lang="ts">
	import Hamburger from './Hamburger.svelte';
	export let sidebar = false;
</script>

<header class="flex p-2 items-center text-white">
	<nav class="flex">
		<Hamburger bind:open={sidebar} />
	</nav>
	<nav><a href="/" class="text-white mb-0.5">Lightbulb Learning</a></nav>
</header>

<!--
    References:
    https://dev.to/joshnuss/creating-a-sidebar-menu-in-svelte-ih2
-->
