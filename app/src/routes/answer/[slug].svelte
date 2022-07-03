<script lang="ts" context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session, params }) =>
		withPageAuth(
			{
				redirectTo: '/login',
				user: session.user
			},
			async () => {
				const answerId = params.slug;
				const answer = await fetchAnswer(answerId, session);
				const latestAnswer = await fetchLatestAnswer(answer.question, session);
				const question = await fetchQuestion(answer.question, session);
				const myFeedback = await fetchMyFeedback(answerId, session);
				const feedbackOfOthers = await fetchFeedbackOfOthers(answerId, session);

				return { props: { question, answer, myFeedback, feedbackOfOthers, latestAnswer } };
			}
		);
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import ImproveAnswer from '$lib/components/ImproveAnswer.svelte';
	import {
		fetchMyFeedback,
		fetchAnswer,
		fetchQuestion,
		fetchFeedbackOfOthers,
		AnswerType,
		FeedbackType,
		QuestionType,
		saveFeedback,
		fetchLatestAnswer
	} from '$lib/supabaseQueries';
	import { goto } from '$app/navigation';
	import autosize from 'autosize';
	import { routes } from '$lib/routes';
	import { session } from '$app/stores';

	export let question: QuestionType;
	export let answer: AnswerType;
	export let myFeedback: FeedbackType;
	export let feedbackOfOthers: Array<FeedbackType>;
	let feedbackText;
	let improvingAnswer = false;
	export let latestAnswer;
	$: isLatest = latestAnswer?.version == answer.version;

	async function publishFeedback() {
		myFeedback = await saveFeedback(feedbackText, answer.id, $session.user.id);
		feedbackText = null;
	}
</script>

<main class="container">
	{#if answer && question}
		<Back text="Back to Question" route="/question/{question?.id}" />

		{#if question.owner == $session.user?.id}
			<div class="mb-4 yours pl-4">Your Question: {question.questionText}</div>
		{:else}
			<div class="mb-4">Question: {question.questionText}</div>
		{/if}

		{#if answer.owner == $session.user.id}
			<h1 class="yours pl-4">Your Answer: {answer.answerText}</h1>

			{#if feedbackOfOthers?.length == 0}
				<i>No one has provided any feedback for your answer.</i>
			{:else}
				<i>Here is the feedback you received for your answer:</i>
				{#if feedbackOfOthers}
					{#each feedbackOfOthers as feedbackOfOther}
						<article>
							{feedbackOfOther.feedbackText}
						</article>
					{/each}
				{/if}
				{#if isLatest}
					{#if improvingAnswer}
						<ImproveAnswer {answer} />
					{:else}
						<div class="mb-4">Do you want to improve your answer based on this feedback?</div>
						<button class="outline w-48" on:click={() => (improvingAnswer = !improvingAnswer)}
							>Improve Answer</button
						>
					{/if}
				{:else}
					<div class="mb-4"><i>Attention: This is an old version.</i></div>
					<button
						class="w-48"
						on:click={() => {
							goto(routes.answer(latestAnswer.id));
						}}>Go to Latest Version</button
					>
				{/if}
			{/if}
		{:else}
			<h1>{answer.answerText}</h1>

			{#if myFeedback}
				<article class="yours">
					{myFeedback.feedbackText}
				</article>
			{:else}
				<textarea
					id="textarea-feedback"
					bind:value={feedbackText}
					class="w-full h-12"
					placeholder="Give feedback to this answer"
					on:load={autosize(document.getElementById('textarea-feedback'))}
				/>
				<i
					>The feedback is private - only you, the owner of the answer and the owner of the course can see it.</i
				>

				<button on:click={publishFeedback} class="w-32 mt-4">Publish</button>
			{/if}
		{/if}
	{/if}
</main>

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}
</style>
