<script lang="ts">
	import { routes } from '$lib/routes';
	import { session } from '$app/stores';

	export let supabaseClient;
</script>

<header class="flex items-center text-white justify-between mx-6 mt-4">
	<div class="flex p-0">
		<nav>
			<a href={routes.root} sveltekit:prefetch>Lightbulb Learning</a>
		</nav>
	</div>
	{#if $session.user}
		<nav>
			<span class="text-ellipsis truncate" style="max-width: 8em;">{$session.user.email}</span>
			<!-- svelte-ignore a11y-missing-attribute -->
			<a
				on:click={() => {
					supabaseClient.auth.signOut();
				}}
				class="ml-4">Logout</a
			>
		</nav>
	{:else}
		<nav>
			<!-- svelte-ignore a11y-missing-attribute -->
			<a href="/login" sveltekit:prefetch>Login</a>
		</nav>
	{/if}
</header>
