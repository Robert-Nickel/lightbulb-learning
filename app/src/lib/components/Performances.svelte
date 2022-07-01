<script context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';
	export let course;

	export const load = async ({ session, params }) =>
		withPageAuth(
			{
				redirectTo: '/',
				user: session.user
			},
			async () => {
				console.log('Find course id from params');
				console.log({ params });
				const members = await fetchMembers(course.id, session);

				return { props: { members } };
			}
		);
</script>

<script lang="ts">
	import { routes } from '$lib/routes';
	import { fetchMembers } from '$lib/supabaseQueries';
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
