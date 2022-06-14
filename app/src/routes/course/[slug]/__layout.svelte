<script lang="ts" context="module">
	export const load: Load = async ({ session, params, url }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const pathSegments = url.pathname.split('/');
		const routeLastSegment = pathSegments[pathSegments.length - 1];
		const courseId = params.slug;
		const course = await fetchCourse(courseId);
		console.log({ user });
		const courseUser = await fetchCourseUser(courseId, user.id);
		console.log({ courseUser });
		const mylatestProgress = await fetchMyLatestProgress(courseUser.id);
		return {
			props: {
				course,
				routeLastSegment,
				mylatestProgress: mylatestProgress ? mylatestProgress.percentage : 0
			}
		};
	};
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import { CourseType, fetchCourse, fetchCourseUser, fetchMyLatestProgress } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	enum Tab {
		Questions,
		Performances,
		Settings
	}

	export let course: CourseType;
	export let routeLastSegment: string;
	export let mylatestProgress: number;
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
				data-tooltip={mylatestProgress == 0
					? 'Ask a good question to get started!'
					: 'Reach 100%, to get the certificate!'}>{mylatestProgress}%.</em
			>
		</p>

		{#if $user.id == course.owner}
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
