<script>
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	export let open = false;

	async function logout() {
		open = false;
		try {
			// TODO: This throws an error. We don't handle it. See https://github.com/supabase/supabase/discussions/3468?sort=top
			user.signOut();
		} catch {}
		goto(routes.logout);
	}

	function close() {
		open = false;
	}
</script>

<aside
	class="absolute flex flex-col justify-between w-48 h-full bg-gray-800 text-white shadow-lg z-10 p-8 pt-24 space-y-2 text-xl cursor-default"
	class:open
>
	<div>
		<!--{#if $user}
			<nav on:click={close}><a href={routes.root} sveltekit:prefetch>My Courses</a></nav>
			<nav on:click={close}><a href={routes.newCourse} sveltekit:prefetch>New Course</a></nav>
			<nav on:click={close}><a href={routes.joinCourse()} sveltekit:prefetch>Join Course</a></nav>
			<nav on:click={close}><a href={routes.help} sveltekit:prefetch>Help</a></nav>
		{:else}
			<nav on:click={close}><a href={routes.login} sveltekit:prefetch>Login</a></nav>
		{/if}-->
	</div>

	<!--{#if $user}
		<button on:click={logout} class="outline">Logout</button>
	{/if}-->
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
