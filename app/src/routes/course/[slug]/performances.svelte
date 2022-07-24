<script lang="ts" context="module">
	export const load = async ({ session, params }) =>
		withPageAuth(
			{ redirectTo: '/login', user: session.user },

			async () => {
				const courseId = params.slug;
				return {
					props: {
						members: await fetchMembers(courseId, session)
					}
				};
			}
		);
</script>

<script lang="ts">
	import Performances from '$lib/components/Performances.svelte';

	import { fetchMembers } from '$lib/supabaseQueries';
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export let members;
</script>

<Performances {members} />
