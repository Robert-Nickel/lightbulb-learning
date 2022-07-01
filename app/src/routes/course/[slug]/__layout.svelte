<script context="module">
	import { supabaseServerClient, withPageAuth } from '@supabase/auth-helpers-sveltekit';

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

	enum Tab {
		Questions,
		Performances,
		Settings
	}

	export let course: CourseType;
	export let routeLastSegment: string;
	export let myLatestProgress: number;
	$: activeTab =
		routeLastSegment == 'settings'
			? Tab.Settings
			: routeLastSegment == 'performances'
			? Tab.Performances
			: Tab.Questions;
</script>

<main class="container">
	<Back route="/course" text="Back to all Courses" />

	{#if course}
		<h1>{course.description}</h1>
		<p>
			Your progress:&nbsp;
			<em
				data-tooltip={myLatestProgress == 0
					? 'Ask a good question to get started!'
					: 'Reach 100%, to get the certificate!'}>{myLatestProgress}%.</em
			>
		</p>

		{#if $session.user.id == course.owner}
			<header class="flex p-2 space-x-4 border-b-2 ">
				<nav
					class={activeTab == Tab.Questions ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.course(course.id));
						activeTab = Tab.Questions;
					}}
				>
					Questions
				</nav>
				<nav
					class={activeTab == Tab.Performances ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.coursePerformances(course.id));
						activeTab = Tab.Performances;
					}}
				>
					Performances
				</nav>
				<nav
					class={activeTab == Tab.Settings ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.courseSettings(course.id));
						activeTab = Tab.Settings;
					}}
				>
					Settings
				</nav>
			</header>
		{/if}

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
