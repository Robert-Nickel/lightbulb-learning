<script lang="ts">
	import { page } from '$app/stores';
	import Back from '$lib/components/Back.svelte';
	import {
		fetchMember,
		fetchOpenAnswerPerformances,
		fetchOpenFeedbackPerformances,
		fetchOpenQuestionPerformances,
		MemberType
	} from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	let member: MemberType;
	let allPerformances: { createdAt: string }[] = [];

	export function getDateAndTime(createdAt: string) {
		const date = new Date(createdAt);
		return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
	}

	onMount(async () => {
		const id = $page.params.slug;
		member = await fetchMember(id);
		allPerformances = allPerformances
			.concat(await fetchOpenQuestionPerformances(id))
			.concat(await fetchOpenAnswerPerformances(id))
			.concat(await fetchOpenFeedbackPerformances(id));

		allPerformances.sort((a, b) => {
			return new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1;
		});
	});
</script>

{#if member}<h1>Performance of {member.firstName} {member.lastName}</h1>{/if}

{#if allPerformances}
	{#each allPerformances as performance}
		<article>
			<small>{getDateAndTime(performance.createdAt)}</small>

			{#if performance.openQuestionId}
				<small>- Open Question</small>
				<h4 class="mt-2 mb-2">{performance.questionText}</h4>
				<h4 class="mt-2 mb-0">- {performance.answerText}</h4>
			{:else if performance.openAnswerId}
				<small>- Open Answer </small>
				<p class="my-2"><i>Question: {performance.questionText}</i></p>
				<h4 class="mt-2 mb-0">{performance.answerText}</h4>
			{:else if performance.openFeedbackId}
				<small>- Open Feedback </small>
				<p class="my-2"><i>Question: {performance.questionText}</i></p>
				<p class="my-2"><i>Answer: {performance.answerText}</i></p>
				<h4 class="mt-2 mb-0">{performance.feedbackText}</h4>

			{/if}
		</article>
	{/each}
{/if}

{#if member}
	<Back text="Back to Challenge Pool Settings" route="/challengepool/{member.challengePool}/settings" />
{/if}
