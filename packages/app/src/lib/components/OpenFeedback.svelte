<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { DataStore } from '@aws-amplify/datastore';
	import { OpenFeedbackDraft, OpenFeedback, OpenAnswer } from '../models';

	export let baseUrl: string;
	export let openAnswer: OpenAnswer;
	export let userId: string;

	let openFeedbackDraft: OpenFeedbackDraft;
	let myOpenFeedback: OpenFeedback;
	let openFeedbacks: Array<OpenFeedback>;

	fetchOpenFeedbackDraft(openAnswer);
	fetchMyOpenFeedback(openAnswer);
	fetchOpenFeedbacks(openAnswer);

	async function fetchOpenFeedbackDraft(openAnswer) {
		let openFeedbackDrafts = await DataStore.query(OpenFeedbackDraft, (f) =>
			f.openanswerID('eq', openAnswer.id)
		);
		openFeedbackDraft = openFeedbackDrafts[0];
	}

	async function fetchMyOpenFeedback(openAnswer) {
		let openFeedbacks = await DataStore.query(
			OpenFeedback,
			(f) => f.openanswerID('eq', openAnswer.id) && f.owner('eq', userId)
		);
		myOpenFeedback = openFeedbacks[0];
	}

	async function fetchOpenFeedbacks(openAnswer) {
		openFeedbacks = await DataStore.query(
			OpenFeedback,
			(f) => f.openanswerID('eq', openAnswer.id) && f.owner('ne', userId)
		);
	}

	async function saveOpenFeedbackDraft(openAnswer: OpenAnswer) {
		const feedbackText = document.getElementById('openFeedbackDraft').value;
		await DataStore.save(
			new OpenFeedbackDraft({
				feedbackText,
				openanswerID: openAnswer.id
			})
		);
		fetchOpenFeedbackDraft(openAnswer);
	}

	async function commitOpenFeedback(openFeedbackDraft: OpenFeedbackDraft, openAnswer: OpenAnswer) {
		deleteMyFeedbackDraft(openFeedbackDraft, openAnswer);

		let myOpenFeedback: OpenFeedback = new OpenFeedback({
			feedbackText: openFeedbackDraft.feedbackText,
			openanswerID: openFeedbackDraft.openanswerID,
			owner: userId
		});
		await DataStore.save(myOpenFeedback);

		publishOpenFeedbackCommittedEvent(myOpenFeedback);

		dispatch('toast', { type: 'success', text: 'Open Feedback created!' });

		fetchMyOpenFeedback(openAnswer);
		fetchOpenFeedbacks(openAnswer);
	}

	async function deleteMyFeedbackDraft(openFeedbackDraft: OpenFeedbackDraft, openAnswer: OpenAnswer) {
		await DataStore.delete(await DataStore.query(OpenFeedbackDraft, openFeedbackDraft.id));
		fetchOpenFeedbackDraft(openAnswer);
	}

	async function publishOpenFeedbackCommittedEvent(openFeedback: OpenFeedback) {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		var raw = JSON.stringify(openFeedback);

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch(`${baseUrl}/commitOpenFeedback`, requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.log('error', error));
	}
</script>

<div class="space-y-2">
	{#if myOpenFeedback}
		<div class="rounded p-4 space-y-2 whitespace-pre" style="background: var(--card-background-color);">
			<div class="italic">✅ This is your feedback.</div>
			{myOpenFeedback.feedbackText}
		</div>
	{:else if openAnswer.owner != userId}
		{#if openFeedbackDraft}
			<div class="flex justify-between">
				<div>{openFeedbackDraft.feedbackText}</div>
				<div>
					<button on:click={() => deleteMyFeedbackDraft(openFeedbackDraft, openAnswer)} class="w-32"
						>Delete</button
					>
				</div>
			</div>
		{:else}
			<div class="flex justify-between space-x-2 mt-2">
				<div class="w-full">
					<input id="openFeedbackDraft" class="w-full" placeholder="Provide feedback to this answer" />
				</div>
				<div>
					<button on:click={() => saveOpenFeedbackDraft(openAnswer)} class="w-32">Save Draft</button>
				</div>
			</div>
		{/if}
		<div>
			<button
				disabled={!openFeedbackDraft}
				on:click={() => commitOpenFeedback(openFeedbackDraft, openAnswer)}
				class="w-32">Commit</button
			>
		</div>
	{/if}
	{#if openAnswer.owner == userId || myOpenFeedback}
		<!--I can see other peoples feedback, if it was my answer or I already provided my feedback-->
		{#if openFeedbacks && openFeedbacks.length > 0}
			<div class="space-y-2">
				<div class="mb-2 italic">Other people's feedback:</div>
				{#each openFeedbacks as openFeedback}
					<div class="rounded p-4 space-y-2" style="background: var(--card-background-color);">
						{openFeedback.feedbackText}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</div>
