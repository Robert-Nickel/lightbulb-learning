<script lang="ts">
	import { routes } from '$lib/routes';

	export let members;
</script>

<main class="container">
	{#if members && members.length > 0}
		{#each members as member}
			<a href={routes.performance(member.id)} class="light-link" sveltekit:prefetch>
				<article class="hoverable">
					{member.email}
				</article>
			</a>
		{/each}
	{/if}
</main>
