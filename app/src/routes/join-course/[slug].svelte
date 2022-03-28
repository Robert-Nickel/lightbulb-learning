<script lang="ts" context="module">
	export const load: Load = async ({ session, params, url }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const inviteCode = params.slug;

		return {
			props: {
				inviteCode
			}
		};
	};
</script>

<script lang="ts">
	import JoinCourse from '$lib/components/JoinCourse.svelte';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';

	export let inviteCode;
</script>

<JoinCourse {inviteCode} />
