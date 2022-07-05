<script lang="ts" context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session }) =>
		withPageAuth(
			{
				redirectTo: '/login',
				user: session.user
			},
			async () => {
				return { props: { courses: await fetchCourses(session) } };
			}
		);
</script>

<script lang="ts">
	import { routes } from '$lib/routes';
	import { fetchCourses, CourseType } from '$lib/supabaseQueries';

	export let courses: CourseType[] = [];

	let noInviteCode = false;
</script>

<main class="container py-4 max-w-screen-sm">
	<h1 id="courses-title">Courses</h1>
	{#if courses.length == 0}
		{#if !noInviteCode}
			<p>Do you have an invite code?</p>
			<div class="flex space-x-2">
				<a href={routes.joinCourse()} class="outline w-24" role="button">Yes</a>
				<!-- svelte-ignore a11y-missing-attribute -->
				<a
					on:click={() => {
						noInviteCode = true;
					}}
					class="outline w-24"
					role="button">No</a
				>
			</div>
		{:else}
			<p>Would you rather create your own course or join an example course to see what it is like?</p>
			<div class="flex space-x-2">
				<a href={routes.newCourse} role="button" class="outline" sveltekit:prefetch>Create own Course</a>
				<a href={routes.joinCourse('GNRLWISDOM')} role="button" class="outline" sveltekit:prefetch
					>Join example Course</a
				>
			</div>
		{/if}
	{:else}
		{#each courses as course}
			<a href={routes.course(course.id)} class="light-link" sveltekit:prefetch>
				<article class="hoverable">
					{course.description}
				</article>
			</a>
		{/each}
		<a class="meta-course" href={routes.joinCourse()}><article class="hoverable">Join Course</article></a>
		<a class="meta-course" href={routes.newCourse}><article class="hoverable">Create new Course</article></a>
	{/if}
</main>

<style>
	.hoverable:hover {
		background-color: var(--card-sectionning-background-color);
	}

	.meta-course:hover {
		text-decoration: none;
	}
</style>
