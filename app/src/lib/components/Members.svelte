<script lang="ts">
	import { routes } from '$lib/routes';
	import { fetchMembers, MemberType } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	export let challengePoolId: string;
	let members: MemberType[] = [];

	onMount(async () => {
		members = await fetchMembers(challengePoolId);
	});
</script>

<h3 class="mt-8">Members</h3>
{#each members as member}
	<a href={routes.performance(member.id)} class="light-link">
		<article class="hoverable">
			{member.firstName}
			{member.lastName}
		</article>
	</a>
{/each}
