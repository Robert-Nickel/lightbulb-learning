<script>
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { session } from '$app/stores';
	import { supabaseClient } from '$lib/db';

	export let open = false;

	function close() {
		open = false;
	}
</script>

<aside
	class="absolute flex flex-col justify-between w-48 h-full bg-gray-800 text-white shadow-lg z-10 p-8 pt-24 space-y-2 text-xl cursor-default"
	class:open
>
	<div>
		{#if $session.user}
			<nav on:click={close}><a href={routes.courses} sveltekit:prefetch>My Courses</a></nav>
			<nav on:click={close}><a href={routes.newCourse} sveltekit:prefetch>New Course</a></nav>
			<nav on:click={close}><a href={routes.joinCourse()} sveltekit:prefetch>Join Course</a></nav>
			<nav on:click={close}><a href={routes.help} sveltekit:prefetch>Help</a></nav>
		{:else}
			<nav on:click={close}><a href={routes.login} sveltekit:prefetch>Login</a></nav>
		{/if}
	</div>

	{#if $session.user}
		<button
			on:click={() => {
				supabaseClient.auth.signOut();
				close();
			}}
			class="outline">Logout</button
		>
	{/if}
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
