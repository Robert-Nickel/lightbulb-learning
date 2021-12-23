<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { DataStore } from '@aws-amplify/datastore';
	import { OpenAnswerDraft, OpenQuestion, OpenAnswer } from '../models';
	import OpenFeedback from './OpenFeedback.svelte';
	import { user } from '$lib/stores/user';
	import { baseUrl } from '$lib/awsCommon';

	export let openQuestion: OpenQuestion;
	let openAnswerDraft: OpenAnswerDraft;
	let myOpenAnswer: OpenAnswer;
	let openAnswers: Array<OpenAnswer>;

	fetchOpenAnswerDraft(openQuestion);
	fetchMyOpenAnswer(openQuestion);
	fetchOpenAnswers(openQuestion);

	console.log('owner: ' + openQuestion.owner);
	console.log('user: ' + $user.id);

	async function fetchOpenAnswerDraft(openQuestion) {
		let openAnswerDrafts = await DataStore.query(OpenAnswerDraft, (a) =>
			a.openquestionID('eq', openQuestion.id)
		);
		openAnswerDraft = openAnswerDrafts[0];
	}

	async function fetchMyOpenAnswer(openQuestion) {
		let openAnswers = await DataStore.query(
			OpenAnswer,
			(a) => a.openquestionID('eq', openQuestion.id) && a.owner('eq', $user.id)
		);
		myOpenAnswer = openAnswers[0];
	}

	async function fetchOpenAnswers(openQuestion) {
		openAnswers = await DataStore.query(OpenAnswer, (a) => a.openquestionID('eq', openQuestion.id));
	}

	async function saveOpenAnswerDraft(openQuestion: OpenQuestion) {
		const answerText = document.getElementById('openAnswerDraft').value;
		await DataStore.save(
			new OpenAnswerDraft({
				answerText,
				openquestionID: openQuestion.id
			})
		);
		fetchOpenAnswerDraft(openQuestion);
	}

	async function commitOpenAnswer(openAnswerDraft: OpenAnswerDraft, openQuestion: OpenQuestion) {
		deleteMyAnswerDraft(openAnswerDraft, openQuestion);

		let myOpenAnswer: OpenAnswer = new OpenAnswer({
			answerText: openAnswerDraft.answerText,
			openquestionID: openAnswerDraft.openquestionID,
			owner: $user.id
		});
		await DataStore.save(myOpenAnswer);
		myOpenAnswer = myOpenAnswer;

		publishOpenAnswerCommittedEvent(myOpenAnswer);

		// TODO: this is ignored
		// dispatch('toast', { type: 'success', text: 'Open Answer created!' });

		fetchMyOpenAnswer(openQuestion);
	}

	async function deleteMyAnswerDraft(openAnswerDraft: OpenAnswerDraft, openQuestion: OpenQuestion) {
		await DataStore.delete(await DataStore.query(OpenAnswerDraft, openAnswerDraft.id));
		fetchOpenAnswerDraft(openQuestion);
	}

	async function publishOpenAnswerCommittedEvent(openAnswer: OpenAnswer) {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		var raw = JSON.stringify(openAnswer);

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch(`${baseUrl}/commitOpenAnswer`, requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.log('error', error));
	}
</script>

<div>
	{#if myOpenAnswer}
		<div class="yours answer">
			<p class="m-0"><i>You answered: </i>{myOpenAnswer.answerText}</p>
			<!--TODO: Add feedback to own answer-->
			<!--<OpenFeedback bind:openAnswer {baseUrl} />-->
		</div>
	{:else if openAnswerDraft}
		<div class="flex justify-between space-x-2 mt-2">
			<div class="w-full">{openAnswerDraft.answerText}</div>
			<button
				on:click={() => deleteMyAnswerDraft(openAnswerDraft, openQuestion)}
				class="w-48 secondary outline">Delete</button
			>
		</div>
		<div>
			<button
				disabled={!openAnswerDraft}
				on:click={() => commitOpenAnswer(openAnswerDraft, openQuestion)}
				class="w-32">Publish</button
			>
		</div>
	{:else if openQuestion.owner != $user.id}
		<!--Create a new answer-->
		<div class="flex justify-between space-x-2 mt-2">
			<div class="w-full">
				<input id="openAnswerDraft" class="w-full" placeholder="Answer this question" />
			</div>
			<button on:click={() => saveOpenAnswerDraft(openQuestion)} class="w-48 ">Save</button>
		</div>
		<div />
	{/if}
	{#if openAnswers && openAnswers.length > 0}
		<b>Other people's answers</b>
		{#each openAnswers as openAnswer}
			<div class="answer mt-4">
				<p class="mb-0">{openAnswer.answerText}</p>
				<!--<OpenFeedback {openAnswer} />-->
			</div>
		{/each}
	{/if}
</div>

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.answer {
		@apply p-4 mb-4 rounded;
		background: var(--card-sectionning-background-color);
	}
</style>
