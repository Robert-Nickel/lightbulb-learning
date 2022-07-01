<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const course = await fetchCourse(params.slug);
		return {
			props: {
				course
			}
		};
	};
</script>

<script lang="ts">
	import DeleteCourse from '$lib/components/DeleteCourse.svelte';
	import ManageTopics from '$lib/components/ManageTopics.svelte';
	import GenerateInviteCode from '$lib/components/GenerateInviteCode.svelte';
	import { fetchCourse } from '$lib/supabaseQueries';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';

	export let course;
</script>

{#if course}
	<ManageTopics courseId={course.id} />
	<GenerateInviteCode courseId={course.id} />
	<DeleteCourse {course} />
{/if}
