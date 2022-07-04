<script lang="ts" context="module">
	export const load = async ({ session, params }) =>
		withPageAuth({ redirectTo: '/login', user: session.user }, async () => {
			const courseId = params.slug;
			const course = await fetchCourse(courseId, session);
			const topics = await fetchTopics(courseId, session);
			return {
				props: {
					course,
					topics
				}
			};
		});
</script>

<script lang="ts">
	import DeleteCourse from '$lib/components/DeleteCourse.svelte';
	import ManageTopics from '$lib/components/ManageTopics.svelte';
	import GenerateInviteCode from '$lib/components/GenerateInviteCode.svelte';
	import { fetchCourse, fetchTopics } from '$lib/supabaseQueries';
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export let course;
	export let topics;
</script>

{#if course}
	<ManageTopics courseId={course.id} {topics} />
	<GenerateInviteCode courseId={course.id} />
	<DeleteCourse {course} />
{/if}
