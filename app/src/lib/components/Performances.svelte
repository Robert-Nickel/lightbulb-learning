<script lang="ts">
	import { routes } from '$lib/routes';

	export let members;
</script>

<main class="container">
	{#if members && members.length > 0}
		{#each members as member}
			<a href={routes.performance(member.id)} class="light-link">
				<article class="hoverable">
					{member.firstName}
					{member.lastName}
				</article>
			</a>
		{/each}
	{/if}
</main>
