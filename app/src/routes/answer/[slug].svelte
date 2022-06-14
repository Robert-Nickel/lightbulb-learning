<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Toast from '$lib/components/Toast.svelte';
	import Back from '$lib/components/Back.svelte';
	import ImproveAnswer from '$lib/components/ImproveAnswer.svelte';
	import {
		fetchMyfeedback,
		fetchAnswer,
		fetchQuestion,
		fetchfeedbackOfOthers,
		AnswerType,
		feedbackType,
		QuestionType,
		savefeedback,
		fetchLatestAnswer
	} from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import autosize from 'autosize';
	import { routes } from '$lib/routes';

	let question: QuestionType;
	let answer: AnswerType;
	let myfeedback: feedbackType;
	let feedbackOfOthers: Array<feedbackType> = [];
	let feedbackText;
	let toast;
	let improvingAnswer = false;
	let latestAnswer;
	let isLatest = false;

	onMount(async () => {
		refresh($page.params.slug);
	});

	async function refresh(answerId) {
		answer = await fetchAnswer(answerId);
		latestAnswer = await fetchLatestAnswer(answer.question, answer.owner);
		if (latestAnswer) {
			isLatest = latestAnswer.version == answer.version;
		}

		question = await fetchQuestion(answer.question);
		myfeedback = await fetchMyfeedback(answer.id);
		feedbackOfOthers = await fetchfeedbackOfOthers(answer.id);
	}

	async function publishfeedback() {
		myfeedback = await savefeedback(feedbackText, answer.id);
		feedbackText = null;
		toast.showSuccessToast('Thanks for your Feedback!');
	}
</script>

<main class="container">
	{#if answer && question}
		<Back text="Back to Question" route="/question/{question.id}" />

		{#if question.owner == $user.id}
			<div class="mb-4 yours pl-4">Your Question: {question.questionText}</div>
		{:else}
			<div class="mb-4">Question: {question.questionText}</div>
		{/if}

		{#if answer.owner == $user.id}
			<h1 class="yours pl-4">Your Answer: {answer.answerText}</h1>

			{#if feedbackOfOthers.length == 0}
				<i>No one has provided any feedback for your answer.</i>
			{:else}
				<i>Here is the feedback you received for your answer:</i>
				{#each feedbackOfOthers as feedbackOfOther}
					<article>
						{feedbackOfOther.feedbackText}
					</article>
				{/each}
				{#if isLatest}
					{#if improvingAnswer}
						<ImproveAnswer {answer} on:answerImproved={(e) => refresh(e.detail)} />
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
							refresh(latestAnswer.id);
						}}>Go to Latest Version</button
					>
				{/if}
			{/if}
		{:else}
			<h1>{answer.answerText}</h1>

			{#if myfeedback}
				<article class="yours">
					{myfeedback.feedbackText}
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

				<button on:click={publishfeedback} class="w-32 mt-4">Publish</button>
			{/if}
		{/if}
	{/if}
</main>

<Toast bind:this={toast} />

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}
</style>
