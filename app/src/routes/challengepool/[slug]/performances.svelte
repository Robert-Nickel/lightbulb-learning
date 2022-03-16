<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const challengePool = await fetchChallengePool(params.slug);
		return {
			props: {
				challengePool
			}
		};
	};
</script>

<script lang="ts">
	import Performances from '$lib/components/Performances.svelte';
	import { ChallengePoolType, fetchChallengePool } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';

	export let challengePool: ChallengePoolType;
</script>

{#if challengePool}
	<Performances {challengePool} />
{/if}
