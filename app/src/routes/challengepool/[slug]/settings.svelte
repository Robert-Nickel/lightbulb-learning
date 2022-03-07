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
	import DeleteChallengePool from '$lib/components/DeleteChallengePool.svelte';
	import ManageTopics from '$lib/components/ManageTopics.svelte';
	import GenerateInviteCode from '$lib/components/GenerateInviteCode.svelte';
	import { fetchChallengePool } from '$lib/supabaseClient';
	import type { Session } from '@supabase/supabase-js';
	import type { Load } from '@sveltejs/kit';

	export let challengePool;
</script>

{#if challengePool}
	<ManageTopics challengePoolId={challengePool.id} />
	<GenerateInviteCode challengePoolId={challengePool.id} />
	<DeleteChallengePool {challengePool} />
{/if}
