<script lang="ts" context="module">
	export const load = async ({ session, params }) =>
		withPageAuth({ redirectTo: '/login', user: session.user }, async () => {
			const courseId = params.slug;
			const course = await fetchCourse(courseId, session);
			const topics = await fetchTopicsForCourse(courseId, session);
			const inviteCode = await fetchInviteCode(courseId, session);
			return {
				props: {
					course,
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
	import { fetchCourse, fetchTopicsForCourse, fetchInviteCode } from '$lib/supabaseQueries';
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';
	import { session } from '$app/stores';
	import LeaveCourse from '$lib/components/LeaveCourse.svelte';

	export let course;
	export let topics;
	export let inviteCode;
</script>

{#if $session.user.id == course.owner}
	<ManageTopics courseId={course.id} {topics} />
	<GenerateInviteCode courseId={course.id} {inviteCode} />
	<DeleteCourse {course} />
{:else}
	<LeaveCourse {course} />
{/if}
