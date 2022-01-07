<script lang="ts">
	import { store } from '$lib/stores/auth';
	import '../app.css';
	import Sidebar from '$lib/components/Sidebar.svelte';
	import Navbar from '$lib/components/Navbar.svelte';

	let sidebarOpen = false;
</script>

<Sidebar bind:open={sidebarOpen} />
<Navbar bind:sidebar={sidebarOpen} />

{#if $store}
	<main class="container py-4 max-w-screen-sm">
		<slot />
	</main>
{:else}
	<slot />
{/if}
