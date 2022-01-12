<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Toast from '$lib/components/Toast.svelte';
	import Back from '$lib/components/Back.svelte';
	import ImproveOpenAnswer from '$lib/components/ImproveOpenAnswer.svelte';
	import {
		fetchMyOpenFeedback,
		fetchMyOpenFeedbackDraft,
		fetchOpenAnswer,
		fetchOpenQuestion,
		fetchOpenFeedbackOfOthers,
		OpenAnswerType,
		OpenFeedbackDraftType,
		OpenFeedbackType,
		OpenQuestionType,
		supabase,
		saveOpenFeedbackDraft,
		deleteOpenFeedbackDraft,
		saveOpenFeedback
	} from '$lib/supabaseClient';

	let openQuestion: OpenQuestionType;
	let openAnswer: OpenAnswerType;
	let myOpenFeedbackDraft: OpenFeedbackDraftType;
	let myOpenFeedback: OpenFeedbackType;
	let openFeedbackOfOthers: Array<OpenFeedbackType> = [];
	let openFeedbackDraftText = '';
	let toast;
	let improvingAnswer = false;

	onMount(async () => {
		const openAnswerId = $page.params.slug;
		openAnswer = await fetchOpenAnswer(openAnswerId);
		openQuestion = await fetchOpenQuestion(openAnswer.openQuestion);
		myOpenFeedbackDraft = await fetchMyOpenFeedbackDraft(openAnswer.id);
		myOpenFeedback = await fetchMyOpenFeedback(openAnswer.id);
		openFeedbackOfOthers = await fetchOpenFeedbackOfOthers(openAnswer.id);
	});

	async function publishOpenFeedback() {
		await deleteOpenFeedbackDraft(openAnswer.id);
		await fetchMyOpenFeedbackDraft(openAnswer.id);
		await saveOpenFeedback(myOpenFeedbackDraft.feedbackText, myOpenFeedbackDraft.openAnswer);
		await fetchMyOpenFeedback(openAnswer.id);
		toast.showSuccessToast('Thanks for your Feedback!');
	}
</script>

<main class="container">
	{#if openAnswer && openQuestion}
		{#if openQuestion.owner == supabase.auth.user().id}
			<div class="mb-4 yours pl-4">Your Question: {openQuestion.questionText}</div>
		{:else}
			<div class="mb-4">Question: {openQuestion.questionText}</div>
		{/if}

		{#if openAnswer.owner == supabase.auth.user().id}
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
				{#if improvingAnswer}
					<ImproveOpenAnswer {openAnswer} />
				{:else}
					<div class="mb-4">Do you want to improve your answer based on this feedback?</div>
					<button class="outline" on:click={() => (improvingAnswer = !improvingAnswer)}>Improve Answer</button
					>
				{/if}
			{/if}
		{:else}
			<h1>{openAnswer.answerText}</h1>

			{#if myOpenFeedback}
				<article class="yours">
					<i>This is your feedback: </i>{myOpenFeedback.feedbackText}
				</article>
			{:else if myOpenFeedbackDraft}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">{myOpenFeedbackDraft.feedbackText}</div>
					<button
						on:click={async () => {
							await deleteOpenFeedbackDraft(myOpenFeedbackDraft.id);
							myOpenFeedbackDraft = await fetchMyOpenFeedbackDraft(openAnswer.id);
						}}
						class="w-48 secondary outline">Delete</button
					>
				</div>
				<div>
					<button on:click={publishOpenFeedback} class="w-32">Publish</button>
				</div>
			{:else}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">
						<input
							bind:value={openFeedbackDraftText}
							class="w-full"
							placeholder="Give feedback to this answer"
						/>
					</div>
					<button
						on:click={async () => {
							// TODO: careful! When creating feedback on a newer version of the open answer than the one in the url!
							await saveOpenFeedbackDraft(openFeedbackDraftText, openAnswer.id);
							myOpenFeedback = await fetchMyOpenFeedback(openAnswer.id);
						}}
						class="w-48 ">Save</button
					>
				</div>
			{/if}
		{/if}
		<Back text="Back to Open Question" route="/openquestion/{openQuestion.id}" />
	{/if}
</main>

<Toast bind:this={toast} />

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}
</style>
