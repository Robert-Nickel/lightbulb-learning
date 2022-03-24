<script lang="ts" context="module">
	export const load: Load = async ({ session, params, url }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const pathSegments = url.pathname.split('/');
		const routeLastSegment = pathSegments[pathSegments.length - 1];
		const courseId = params.slug;
		const course = await fetchCourse(courseId);
		const courseUser = await fetchCourseUser(courseId, user.id);
		const myLatestEvaluation = await fetchMyLatestEvaluation(courseUser.id);
		return {
			props: {
				course,
				routeLastSegment,
				myLatestEvaluation: myLatestEvaluation ? myLatestEvaluation.percentage : 0
			}
		};
	};
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import { CourseType, fetchCourse, fetchCourseUser, fetchMyLatestEvaluation } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	enum Tab {
		OpenQuestions,
		Performances,
		Settings
	}

	export let course: CourseType;
	export let routeLastSegment: string;
	export let myLatestEvaluation: number;
	$: activeTab =
		routeLastSegment == 'settings'
			? Tab.Settings
			: routeLastSegment == 'performances'
			? Tab.Performances
			: Tab.OpenQuestions;
</script>

<main class="container">
	<Back route="/course" text="Back to all Courses" />

	{#if course}
		<h1>{course.description}</h1>
		{#if myLatestEvaluation == 0}
			<p>
				Your Evaluation:&nbsp;
				<em data-tooltip="Ask a good open question to increase it!">{myLatestEvaluation}%.</em>
			</p>
		{:else}
			<p>Your Evaluation:&nbsp;{myLatestEvaluation}%.</p>
		{/if}

		{#if $user.id == course.owner}
			<header class="flex p-2 space-x-4 border-b-2 ">
				<nav
					class={activeTab == Tab.OpenQuestions ? 'activeNavElement' : ''}
					on:click={() => {
						goto(routes.course(course.id));
						activeTab = Tab.OpenQuestions;
					}}
				>
					Open Questions
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
