<script lang="ts" context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';
	export const load = async ({ session, params }) =>
		withPageAuth(
			{
				redirectTo: '/login',
				user: session.user
			},
			async () => {
				const courseUserId = params.slug;
				const member = await fetchMember(courseUserId, session);

				let allPerformances: { createdAt: string }[] = (
					await fetchQuestionPerformances(courseUserId, session)
				)
					.concat(await fetchAnswerPerformances(courseUserId, session))
					.concat(await fetchFeedbackPerformances(courseUserId, session))
					.concat(await fetchProgresses(courseUserId, session));
				allPerformances = allPerformances.sort((a, b) => {
					return new Date(a.createdAt) < new Date(b.createdAt) ? 1 : -1;
				});

				let latestProgress;
				for (let i = 0; i < allPerformances.length; i++) {
					if (allPerformances[i].percentage != null) {
						latestProgress = allPerformances[i].percentage;
						break;
					}
				}
				return {
					props: {
						member,
						allPerformances,
						latestProgress
					}
				};
			}
		);
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import Progress from '$lib/components/Progress.svelte';
	import { routes } from '$lib/routes';
	import {
		fetchProgresses,
		fetchMember,
		fetchAnswerPerformances,
		fetchFeedbackPerformances,
		fetchQuestionPerformances,
		MemberType
	} from '$lib/supabaseQueries';

	export let member: MemberType;
	export let allPerformances: { createdAt: string }[];
	export let latestProgress: number;

	function getDateAndTime(createdAt: string) {
		const date = new Date(createdAt);
		return date.toLocaleDateString() + ' - ' + date.toLocaleTimeString();
	}
</script>

{#if member}
	<Back text="Back to all Performances" route={routes.coursePerformances(member.course)} />
{/if}

{#if member}<h1>Performance of {member.firstName} {member.lastName}</h1>{/if}

{#if member}
	<Progress
		courseUserId={member.id}
		{latestProgress}
		on:progressAdded={(event) => {
			allPerformances.push(event.detail);
		}}
	/>
{/if}

{#if allPerformances}
	{#each allPerformances as performance}
		<article>
			<small>{getDateAndTime(performance.createdAt)}</small>

			{#if performance.questionId}
				<small
					>- Question - {performance.likes}
					{#if performance.likes == 1}
						like{:else}likes
					{/if}</small
				>
				<h4 class="mt-2 mb-2" id="oqp-question-text">{performance.questionText}</h4>
			{:else if performance.answerId}
				<small
					>- Answer {#if performance.version > 1}Improvement{/if} - {performance.likes}
					{#if performance.likes == 1}
						like{:else}likes
					{/if}</small
				>
				<p class="my-2"><i>Question: {performance.questionText}</i></p>
				<h4 class="mt-2 mb-0">{performance.answerText}</h4>
			{:else if performance.feedbackId}
				<small>- Feedback </small>
				<p class="my-2"><i>Question: {performance.questionText}</i></p>
				<p class="my-2"><i>Answer: {performance.answerText}</i></p>
				<h4 class="mt-2 mb-0">{performance.feedbackText}</h4>
			{:else if performance.percentage || performance.percentage == 0}
				<small>- Progress </small>
				<h4 class="mt-2 mb-0" id="progress-text">
					Reached {performance.percentage}%
				</h4>
			{/if}
		</article>
	{/each}
{/if}
