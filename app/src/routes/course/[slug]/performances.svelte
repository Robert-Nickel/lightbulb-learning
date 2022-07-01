<script lang="ts" context="module">
	export const load = async ({ session, params }) => {
		withPageAuth(
			{ redirectTo: '/', user: session.user },

			async () => {
				return {
					props: {
						course: await fetchCourse(params.slug, session)
					}
				};
			}
		);
	};
</script>

<script lang="ts">
	import Performances from '$lib/components/Performances.svelte';
	import { CourseType, fetchCourse } from '$lib/supabaseQueries';
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export let course: CourseType;
</script>

{#if course}
	<Performances {course} />
{/if}
