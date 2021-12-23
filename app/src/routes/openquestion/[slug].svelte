<script lang="ts">
	import { onMount } from 'svelte';
	import { OpenAnswerDraft, OpenQuestion, OpenAnswer } from '$lib/models';
	import { page } from '$app/stores';
	import { DataStore } from 'aws-amplify';
	import { user } from '$lib/stores/user';

	let openQuestion: OpenQuestion;
	let openAnswerDraft: OpenAnswerDraft;
	let myOpenAnswer: OpenAnswer;
	let openAnswersOfOthers: Array<OpenAnswer> = [];

	onMount(async () => {
		const openQuestionId = $page.params.slug;
		try {
			openQuestion = await DataStore.query(OpenQuestion, openQuestionId);
		} catch (error) {
			throw error;
		}
		fetchOpenAnswerDraft();
		fetchMyOpenAnswer();
		fetchOpenAnswersOfOthers();
	});

	async function fetchOpenAnswerDraft() {
		let openAnswerDrafts = await DataStore.query(OpenAnswerDraft, (a) =>
			a.openquestionID('eq', openQuestion.id)
		);
		openAnswerDraft = openAnswerDrafts[0];
	}

	async function fetchMyOpenAnswer() {
		let openAnswers = await DataStore.query(
			OpenAnswer,
			(a) => a.openquestionID('eq', openQuestion.id) && a.owner('eq', $user.id)
		);
		myOpenAnswer = openAnswers[0];
	}

	async function fetchOpenAnswersOfOthers() {
		openAnswersOfOthers = await DataStore.query(OpenAnswer, (a) =>
			a.openquestionID('eq', openQuestion.id).owner('ne', $user.id)
		);
	}

	async function saveOpenAnswerDraft() {
		const answerText = document.getElementById('openAnswerDraft').value;
		await DataStore.save(
			new OpenAnswerDraft({
				answerText,
				openquestionID: openQuestion.id
			})
		);
		fetchOpenAnswerDraft();
	}

	async function deleteMyAnswerDraft() {
		await DataStore.delete(await DataStore.query(OpenAnswerDraft, openAnswerDraft.id));
		fetchOpenAnswerDraft();
	}

	async function publishOpenAnswer() {
		deleteMyAnswerDraft();

		let myOpenAnswer: OpenAnswer = new OpenAnswer({
			answerText: openAnswerDraft.answerText,
			openquestionID: openAnswerDraft.openquestionID,
			owner: $user.id
		});
		await DataStore.save(myOpenAnswer);
		fetchMyOpenAnswer();

		// TODO: publishOpenAnswerCommittedEvent(myOpenAnswer);

		// TODO: this is ignored
		// dispatch('toast', { type: 'success', text: 'Open Answer created!' });
	}
</script>

{#if openQuestion}
	<h1 class="yours pl-4">{openQuestion.questionText}</h1>
	{#if openQuestion.owner == $user.id}
		<i>This is your own question, so you cannot answer it.</i>
	{:else if myOpenAnswer}
		<div class="yours answer"><i>This is your answer: </i>{myOpenAnswer.answerText}</div>
	{:else if openAnswerDraft}
		<div class="flex justify-between space-x-2 mt-2">
			<div class="w-full">{openAnswerDraft.answerText}</div>
			<button on:click={deleteMyAnswerDraft} class="w-48 secondary outline">Delete</button>
		</div>
		<div>
			<button on:click={publishOpenAnswer} class="w-32">Publish</button>
		</div>
	{:else}
		<div class="flex justify-between space-x-2 mt-2">
			<div class="w-full">
				<input id="openAnswerDraft" class="w-full" placeholder="Answer this question" />
			</div>
			<button on:click={saveOpenAnswerDraft} class="w-48 ">Save</button>
		</div>
	{/if}

	{#each openAnswersOfOthers as openAnswerOfOther}
		<div class="answer">
			{openAnswerOfOther.answerText}
		</div>
	{/each}
{/if}

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.answer {
		@apply p-4 mb-4 rounded;
		background: var(--card-sectionning-background-color);
	}
</style>
