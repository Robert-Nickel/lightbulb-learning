<script lang="ts">
	import { onMount } from 'svelte';
	import { CourseType, fetchMembers, MemberType } from '$lib/supabaseClient';
	import { routes } from '$lib/routes';

	export let course: CourseType;
	let members: MemberType[] = [];

	onMount(() => {
		refresh();
	});

	async function refresh() {
		members = await fetchMembers(course.id);
	}
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
