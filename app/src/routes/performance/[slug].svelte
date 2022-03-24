<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };

		const courseUserId = params.slug;
		const member = await fetchMember(courseUserId);
		let allPerformances: { createdAt: string }[] = (await fetchOpenQuestionPerformances(courseUserId))
			.concat(await fetchOpenAnswerPerformances(courseUserId))
			.concat(await fetchOpenFeedbackPerformances(courseUserId))
			.concat(await fetchEvaluations(courseUserId));
		allPerformances = sortChronologically(allPerformances);
		let latestEvaluation;
		for (let i = 0; i < allPerformances.length; i++) {
			if (allPerformances[i].percentage != null) {
				latestEvaluation = allPerformances[i].percentage;
				break;
			}
		}
		return {
			props: {
				member,
				allPerformances,
				latestEvaluation
			}
		};
	};
</script>

<script lang="ts">
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	import Back from '$lib/components/Back.svelte';
	import Evaluation from '$lib/components/Evaluation.svelte';
	import { routes } from '$lib/routes';
	import {
		fetchEvaluations,
		fetchMember,
		fetchOpenAnswerPerformances,
		fetchOpenFeedbackPerformances,
		fetchOpenQuestionPerformances,
		MemberType
	} from '$lib/supabaseClient';

	export let member: MemberType;
	export let allPerformances: { createdAt: string }[];
	export let latestEvaluation: number;

	function getDateAndTime(createdAt: string) {
		const date = new Date(createdAt);
		return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
	}

	export function sortChronologically(performances) {
		performances.sort((a, b) => {
			return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1;
		});
		return performances;
	}
</script>

{#if member}
	<Back text="Back to all Performances" route={routes.coursePerformances(member.course)} />
{/if}

{#if member}<h1>Performance of {member.firstName} {member.lastName}</h1>{/if}

{#if member}
	<Evaluation
		courseUserId={member.id}
		{latestEvaluation}
		on:evaluationAdded={(event) => {
			allPerformances.push(event.detail);
			allPerformances = sortChronologically(allPerformances);
		}}
	/>
{/if}

{#if allPerformances}
	{#each allPerformances as performance}
		<article>
			<small>{getDateAndTime(performance.createdAt)}</small>

			{#if performance.openQuestionId}
				<small
					>- Open Question - {performance.likes}
					{#if performance.likes == 1}
						like{:else}likes
					{/if}</small
				>
				<h4 class="mt-2 mb-2" id="oqp-question-text">{performance.questionText}</h4>
				<h4 class="mt-2 mb-0" id="oqp-answer-text">- {performance.answerText}</h4>
			{:else if performance.openAnswerId}
				<small
					>- Open Answer {#if performance.version > 1}Improvement{/if}</small
				>
				<p class="my-2"><i>Question: {performance.questionText}</i></p>
				<h4 class="mt-2 mb-0">{performance.answerText}</h4>
			{:else if performance.openFeedbackId}
				<small>- Open Feedback </small>
				<p class="my-2"><i>Question: {performance.questionText}</i></p>
				<p class="my-2"><i>Answer: {performance.answerText}</i></p>
				<h4 class="mt-2 mb-0">{performance.feedbackText}</h4>
			{:else if performance.percentage || performance.percentage == 0}
				<small>- Evaluation </small>
				<h4 class="mt-2 mb-0" id="evaluation-text">
					Reached {performance.percentage}%
				</h4>
			{/if}
		</article>
	{/each}
{/if}
