<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Toast from '$lib/components/Toast.svelte';
	import Back from '$lib/components/Back.svelte';
	import ImproveOpenAnswer from '$lib/components/ImproveOpenAnswer.svelte';
	import {
		fetchMyOpenFeedback,
		fetchOpenAnswer,
		fetchOpenQuestion,
		fetchOpenFeedbackOfOthers,
		OpenAnswerType,
		OpenFeedbackType,
		OpenQuestionType,
		saveOpenFeedback,
		fetchLatestOpenAnswer
	} from '$lib/supabaseClient';
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';
	import autosize from '../../../node_modules/autosize';
	import { routes } from '$lib/routes';

	let openQuestion: OpenQuestionType;
	let openAnswer: OpenAnswerType;
	let myOpenFeedback: OpenFeedbackType;
	let openFeedbackOfOthers: Array<OpenFeedbackType> = [];
	let openFeedbackText;
	let toast;
	let improvingAnswer = false;
	let latestOpenAnswer;
	let isLatest = false;

	onMount(async () => {
		refresh($page.params.slug);
	});

	async function refresh(openAnswerId) {
		openAnswer = await fetchOpenAnswer(openAnswerId);
		latestOpenAnswer = await fetchLatestOpenAnswer(openAnswer.openQuestion, openAnswer.owner);
		if (latestOpenAnswer) {
			isLatest = latestOpenAnswer.version == openAnswer.version;
		}

		openQuestion = await fetchOpenQuestion(openAnswer.openQuestion);
		myOpenFeedback = await fetchMyOpenFeedback(openAnswer.id);
		openFeedbackOfOthers = await fetchOpenFeedbackOfOthers(openAnswer.id);
	}

	async function publishOpenFeedback() {
		myOpenFeedback = await saveOpenFeedback(openFeedbackText, openAnswer.id);
		openFeedbackText = null;
		toast.showSuccessToast('Thanks for your Feedback!');
	}
</script>

<main class="container">
	{#if openAnswer && openQuestion}
		<Back text="Back to Open Question" route="/openquestion/{openQuestion.id}" />

		{#if openQuestion.owner == $user.id}
			<div class="mb-4 yours pl-4">Your Question: {openQuestion.questionText}</div>
		{:else}
			<div class="mb-4">Question: {openQuestion.questionText}</div>
		{/if}

		{#if openAnswer.owner == $user.id}
			<h1 class="yours pl-4">Your Answer: {openAnswer.answerText}</h1>

			{#if openFeedbackOfOthers.length == 0}
				<i>No one has provided any feedback for your answer.</i>
			{:else}
				<i>Here is the feedback you received for your answer:</i>
				{#each openFeedbackOfOthers as openFeedbackOfOther}
					<article>
						{openFeedbackOfOther.feedbackText}
					</article>
				{/each}
				{#if isLatest}
					{#if improvingAnswer}
						<ImproveOpenAnswer {openAnswer} on:openAnswerImproved={(e) => refresh(e.detail)} />
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
							goto(routes.openAnswer(latestOpenAnswer.id));
							refresh(latestOpenAnswer.id);
						}}>Go to Latest Version</button
					>
				{/if}
			{/if}
		{:else}
			<h1>{openAnswer.answerText}</h1>

			{#if myOpenFeedback}
				<article class="yours">
					{myOpenFeedback.feedbackText}
				</article>
			{:else}
				<textarea
					id="textarea-feedback"
					bind:value={openFeedbackText}
					class="w-full h-12"
					placeholder="Give feedback to this answer"
					on:load={autosize(document.getElementById('textarea-feedback'))}
				/>
				<i
					>The feedback is private - only you, the owner of the answer and the owner of the course can see it.</i
				>

				<button on:click={publishOpenFeedback} class="w-32 mt-4">Publish</button>
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
