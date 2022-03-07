<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };
		const challengePool = await fetchChallengePool(params.slug);
		const openQuestions = await fetchOpenQuestions(params.slug);
		return {
			props: {
				challengePool,
				openQuestions
			}
		};
	};
</script>

<script lang="ts">
	import CreateOpenQuestion from '$lib/components/CreateOpenQuestion.svelte';
	import { routes } from '$lib/routes';
	import { user } from '$lib/stores/user';
	import { fetchChallengePool, fetchOpenQuestions } from '$lib/supabaseClient';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';

	export let challengePool;
	export let openQuestions;

	async function refreshOpenQuestions() {
		openQuestions = await fetchOpenQuestions(challengePool.id);
	}
</script>

{#if challengePool}
	<CreateOpenQuestion {challengePool} on:openQuestionCommitted={refreshOpenQuestions} />

	{#if openQuestions.length > 0}
		<h3 class="mt-10">Open Questions</h3>

		{#each openQuestions as openQuestion}
			<a href={routes.openQuestion(openQuestion.id)} class="light-link" sveltekit:prefetch>
				{#if openQuestion.owner == $user.id}
					<article class="yours hoverable">
						<i>You asked:</i>
						{openQuestion.questionText}
					</article>
				{:else}
					<article class="hover:">
						{openQuestion.questionText}
					</article>
				{/if}
			</a>
		{/each}
	{/if}
{:else}
	no challenge pool
{/if}
