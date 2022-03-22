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
	import Performances from '$lib/components/Performances.svelte';
	import { CourseType, fetchCourse } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';

	export let course: CourseType;
</script>

{#if course}
	<Performances {course} />
{/if}
