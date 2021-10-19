<script>
	import { createEventDispatcher } from "svelte";

	export let open = false;

	const dispatch = createEventDispatcher();

	function logout() {
		dispatch("logout");
	}
</script>

<aside
	class="absolute w-full h-full bg-gray-200 border-r-2 shadow-lg"
	class:open
>
	<nav class="p-12 text-xl">
		<a
			href="/"
			class="hover:text-gray-700 hover:no-underline"
			on:click={logout}>Logout</a
		>
	</nav>
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out;
	}

	.open {
		left: 0;
	}
</style>
