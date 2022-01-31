<script lang="ts">
	import { page } from '$app/stores';
	import {
		fetchMember,
		fetchOpenQuestionPerformances,
		MemberType,
		OpenQuestionPerformancesType
	} from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let member: MemberType;
	let openQuestionPerformances: OpenQuestionPerformancesType[] = [];

	onMount(async () => {
		const id = $page.params.slug;
		member = await fetchMember(id);
		openQuestionPerformances = await fetchOpenQuestionPerformances(id);
	});
</script>

{#if member}<h1>Performance of {member.firstName} {member.lastName}</h1>{/if}

{#if openQuestionPerformances}
	<h4>Open Questions asked:</h4>
	{#each openQuestionPerformances as openQuestionPerformance}
		<article>
			<p>{openQuestionPerformance.questionText}</p>
			<i>Own answer:</i>
			{openQuestionPerformance.answerText}
		</article>
	{/each}
{/if}
