<script lang="ts" context="module">
	export const load = async ({ session, params }) =>
		withPageAuth({ redirectTo: '/login', user: session.user }, async () => {
			const courseId = params.slug;
			const course = await fetchCourse(courseId, session);
			const courseUser = await fetchCourseUser(courseId, session);
			const topics = await fetchTopicsForCourse(courseId, session);
			const inviteCode = await fetchInviteCode(courseId, session);
			return {
				props: {
					course,
					courseUser,
					topics,
					inviteCode
				}
			};
		});
</script>

<script lang="ts">
	import DeleteCourse from '$lib/components/DeleteCourse.svelte';
	import ManageTopics from '$lib/components/ManageTopics.svelte';
	import GenerateInviteCode from '$lib/components/GenerateInviteCode.svelte';
	import { fetchCourse, fetchTopicsForCourse, fetchInviteCode, fetchCourseUser } from '$lib/supabaseQueries';
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';
	import { session } from '$app/stores';
	import LeaveCourse from '$lib/components/LeaveCourse.svelte';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	export let course;
	export let courseUser;
	export let topics;
	export let inviteCode;
</script>

{#if $session.user.id == course.owner}
	<ManageTopics courseId={course.id} {topics} />
	<GenerateInviteCode courseId={course.id} {inviteCode} />
	<DeleteCourse {course} />
{:else}
	<button
		class="outline w-64 mt-4"
		on:click={() => {
			goto(routes.performance(courseUser.id));
		}}>My Performance</button
	>
	<LeaveCourse {course} />
{/if}
