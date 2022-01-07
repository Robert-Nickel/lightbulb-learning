<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Toast from '$lib/components/Toast.svelte';
	import Back from '$lib/components/Back.svelte';
	import ImproveOpenAnswer from '$lib/components/ImproveOpenAnswer.svelte';
	import {
		openAnswersTable,
		OpenAnswerType,
		openFeedbackDraftsTable,
		OpenFeedbackDraftType,
		openFeedbackTable,
		OpenFeedbackType,
		openQuestionsTable,
		OpenQuestionType,
		supabase
	} from '$lib/supabaseClient';

	let openQuestion: OpenQuestionType;
	let openAnswer: OpenAnswerType;
	let openFeedbackDraft: OpenFeedbackDraftType;
	let myOpenFeedback: OpenFeedbackType;
	let openFeedbackOfOthers: Array<OpenFeedbackType> = [];
	let openFeedbackDraftText = '';
	let toast;
	let improvingAnswer = false;

	onMount(async () => {
		const openAnswerId = $page.params.slug;
		openAnswer = await (
			await supabase.from<OpenAnswerType>(openAnswersTable).select().eq('id', openAnswerId).single()
		).data;
		fetchOpenQuestion();
		fetchOpenFeedbackDraft();
		fetchMyOpenFeedback();
		fetchOpenFeedbackOfOthers();
	});

	async function fetchOpenQuestion() {
		openQuestion = await (
			await supabase
				.from<OpenQuestionType>(openQuestionsTable)
				.select()
				.eq('id', openAnswer.openQuestion)
				.single()
		).data;
	}

	async function fetchOpenFeedbackDraft() {
		openFeedbackDraft = await (
			await supabase
				.from<OpenFeedbackDraftType>(openFeedbackDraftsTable)
				.select()
				.eq('owner', supabase.auth.user().id)
				.eq('openAnswer', openAnswer.id)
				.single()
		).data;
	}

	async function fetchMyOpenFeedback() {
		myOpenFeedback = await (
			await supabase
				.from<OpenFeedbackType>(openFeedbackTable)
				.select()
				.eq('owner', supabase.auth.user().id)
				.eq('openAnswer', openAnswer.id)
				.single()
		).data;
	}

	async function fetchOpenFeedbackOfOthers() {
		openFeedbackOfOthers = await (
			await supabase
				.from<OpenFeedbackType>(openFeedbackTable)
				.select()
				.eq('openAnswer', openAnswer.id)
				.neq('owner', supabase.auth.user().id)
		).data;
	}

	async function saveOpenFeedbackDraft() {
		await supabase.from<OpenFeedbackDraftType>(openFeedbackDraftsTable).insert({
			feedbackText: openFeedbackDraftText,
			openAnswer: openAnswer.id,
			owner: supabase.auth.user().id
		});
		fetchOpenFeedbackDraft();
	}

	async function deleteMyFeedbackDraft() {
		await supabase
			.from<OpenFeedbackDraftType>(openFeedbackDraftsTable)
			.delete()
			.eq('id', openFeedbackDraft.id);
		fetchOpenFeedbackDraft();
	}

	async function publishOpenFeedback() {
		deleteMyFeedbackDraft();
		await supabase.from<OpenFeedbackType>(openFeedbackTable).insert({
			feedbackText: openFeedbackDraft.feedbackText,
			openAnswer: openFeedbackDraft.openAnswer,
			owner: supabase.auth.user().id
		});

		fetchMyOpenFeedback();
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
