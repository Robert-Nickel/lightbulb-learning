<script lang="ts" context="module">
	export const load = async ({ session, params }) =>
		withPageAuth(
			{ redirectTo: '/login', user: session.user },

			async () => {
				const courseId = params.slug;
				return {
					props: {
						course: await fetchCourse(courseId, session),
						members: await fetchMembers(courseId, session)
					}
				};
			}
		);
</script>

<script lang="ts">
	import Performances from '$lib/components/Performances.svelte';

	import { CourseType, fetchCourse, fetchMembers } from '$lib/supabaseQueries';
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export let course: CourseType;
	export let members;
</script>

{#if course}
	<Performances {members} />
{/if}
