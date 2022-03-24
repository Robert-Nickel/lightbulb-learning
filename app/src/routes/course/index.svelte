<script lang="ts" context="module">
	export const load: Load = async ({ session }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: routes.login };
		return {
			props: {
				user,
				courses: await fetchCourses(user.id)
			}
		};
	};
</script>

<script lang="ts">
	import { routes } from '$lib/routes';
	import { fetchCourses, CourseType } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';

	export let courses: CourseType[] = [];
</script>

<main class="container py-4 max-w-screen-sm">
	<h1 id="courses-title">Courses</h1>
	{#if courses.length == 0}<div class="space-y-4">
			<p>You don't have a course yet! Join one with an invite code, or create one yourself.</p>

			<p>
				Use <a
					on:click={() => {
						navigator.clipboard.writeText('GNRLWISDOM');
					}}
					data-tooltip="Copy to Clipboard">GNRLWISDOM</a
				> to see an example of what a course is.
			</p>

			<div class="flex space-x-4 pt-4">
				<a href={routes.join} role="button" class="outline" sveltekit:prefetch>Join with invite code</a>
				<a href={routes.newCourse} role="button" class="outline" sveltekit:prefetch>New Course</a>
			</div>
		</div>
	{:else}
		{#each courses as course}
			<a href={routes.course(course.id)} class="light-link" sveltekit:prefetch>
				<article class="hoverable">
					{course.description}
				</article>
			</a>
		{/each}
		<a href={routes.newCourse}>Create new Course</a>
	{/if}
</main>

<style>
	.hoverable:hover {
		background-color: var(--card-sectionning-background-color);
	}
</style>
