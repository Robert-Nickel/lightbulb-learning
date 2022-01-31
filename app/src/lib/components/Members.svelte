<script lang="ts">
	import { fetchMembers, MemberType, MemberTypeDB } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	export let challengePoolId: string;
	let members: MemberType[] = [];

	onMount(async () => {
		members = await fetchMembers(challengePoolId);
	});
</script>

{#each members as member}
	<a href={`/performance/${member.id}`} class="light-link">
		<article class="hoverable">
			{member.firstName} {member.lastName}
		</article>
	</a>
{/each}
