<script context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session, params, url }) =>
		withPageAuth(
			{
				redirectTo: '/',
				user: session.user
			},
			async () => {
				const pathSegments = url.pathname.split('/');
				const routeLastSegment = pathSegments[pathSegments.length - 1];
				const courseId = params.slug;
				const course = await fetchCourse(courseId, session);
				const courseUser = await fetchCourseUser(courseId, session);
				const myLatestProgress = await fetchMyLatestProgress(courseUser.id, session);
				return {
					props: {
						course,
						courseUser,
						routeLastSegment,
						myLatestProgress: myLatestProgress ? myLatestProgress.percentage : 0
					}
				};
			}
		);
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import { CourseType, fetchCourse, fetchCourseUser, fetchMyLatestProgress } from '$lib/supabaseQueries';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	export let course: CourseType;
	export let routeLastSegment: string;
	export let myLatestProgress: number;
</script>

<main class="container">
	<Back route="/course" text="Back to all Courses" />

	{#if course && $session.user && $session.user.id}
		<h1>{course.description}</h1>
		<p>
			Your progress:&nbsp;
			<em
				data-tooltip={myLatestProgress == 0
					? 'Ask a good question to get started!'
					: 'Reach 100%, to get the certificate!'}>{myLatestProgress}%.</em
			>
		</p>

		<header class="flex p-2 space-x-4 border-b-2 ">
			<nav
				class={!['settings', 'performances'].includes(routeLastSegment) ? 'activeNavElement' : ''}
				on:click={() => {
					goto(routes.course(course.id));
				}}
			>
				Questions
			</nav>

			{#if $session.user.id == course.owner}
				<nav
					class={routeLastSegment == 'performances' ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.coursePerformances(course.id));
					}}
				>
					Performances
				</nav>
			{/if}

			<nav
				class={routeLastSegment == 'settings' ? 'activeNavElement' : ''}
				on:click={() => {
					goto(routes.courseSettings(course.id));
				}}
			>
				Settings
			</nav>
		</header>

		<slot />
	{/if}
</main>

<style>
	header {
		border-color: var(--card-sectionning-background-color);
	}

	nav {
		color: var(--secondary);
	}

	nav:hover {
		color: var(--white);
		font-weight: 500;
		border-color: var(--primary);
	}

	.activeNavElement {
		color: var(--white);
		font-weight: 500;
		border-color: var(--primary);
	}
</style>
