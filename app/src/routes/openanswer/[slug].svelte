<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { DataStore } from 'aws-amplify';
	import { OpenAnswer, OpenFeedbackDraft, OpenFeedback, OpenQuestion, OpenAnswerDraft } from '$lib/models';
	import { user } from '$lib/stores/user';
	import Toast from '$lib/components/Toast.svelte';
	import Back from '$lib/components/Back.svelte';
	import ImproveOpenAnswer from '$lib/components/ImproveOpenAnswer.svelte';

	let openQuestion: OpenQuestion;
	let openAnswer: OpenAnswer;
	let openFeedbackDraft: OpenFeedbackDraft;
	let myOpenFeedback: OpenFeedback;
	let openFeedbackOfOthers: Array<OpenFeedback> = [];
	let openFeedbackDraftText = '';
	let toast;
	let improvingAnswer = false;

	onMount(async () => {
		const openAnswerId = $page.params.slug;
		try {
			openAnswer = await DataStore.query(OpenAnswer, openAnswerId);
			fetchOpenQuestion();
			fetchOpenFeedbackDraft();
			fetchMyOpenFeedback();
			fetchOpenFeedbackOfOthers();
		} catch (error) {
			throw error;
		}
	});

	async function fetchOpenQuestion() {
		openQuestion = await DataStore.query(OpenQuestion, openAnswer.openquestionID);
	}

	async function fetchOpenFeedbackDraft() {
		let openFeedbackDrafts = await DataStore.query(OpenFeedbackDraft, (f) =>
			f.openanswerID('eq', openAnswer.id)
		);
		openFeedbackDraft = openFeedbackDrafts[0];
	}

	async function fetchMyOpenFeedback() {
		let myOpenFeedbacks = await DataStore.query(
			OpenFeedback,
			(f) => f.openanswerID('eq', openAnswer.id) && f.owner('eq', $user.id)
		);
		myOpenFeedback = myOpenFeedbacks[0];
	}

	async function fetchOpenFeedbackOfOthers() {
		openFeedbackOfOthers = await DataStore.query(OpenFeedback, (f) =>
			f.openanswerID('eq', openAnswer.id).owner('ne', $user.id)
		);
	}	

	async function saveOpenFeedbackDraft() {
		await DataStore.save(
			new OpenFeedbackDraft({
				feedbackText: openFeedbackDraftText,
				openanswerID: openAnswer.id
			})
		);
		fetchOpenFeedbackDraft();
	}

	async function deleteMyFeedbackDraft() {
		await DataStore.delete(await DataStore.query(OpenFeedbackDraft, openFeedbackDraft.id));
		fetchOpenFeedbackDraft();
	}

	async function publishOpenFeedback() {
		deleteMyFeedbackDraft();

		let myOpenFeedback: OpenFeedback = new OpenFeedback({
			feedbackText: openFeedbackDraft.feedbackText,
			openanswerID: openFeedbackDraft.openanswerID,
			owner: $user.id
		});
		await DataStore.save(myOpenFeedback);
		fetchMyOpenFeedback();
		toast.showSuccessToast('Thanks for your Feedback!');
	}
</script>

<main class="container">
	{#if openAnswer && openQuestion}
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
			{:else if openFeedbackDraft}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">{openFeedbackDraft.feedbackText}</div>
					<button on:click={deleteMyFeedbackDraft} class="w-48 secondary outline">Delete</button>
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
					<button on:click={saveOpenFeedbackDraft} class="w-48 ">Save</button>
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
