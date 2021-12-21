<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import { DataStore } from '@aws-amplify/datastore';
	import { OpenQuestionDraft, ChallengePool, OpenQuestion } from '../models';

	export let baseUrl: string;
	export let challengePool: ChallengePool;
	export let userId: string;

	let openQuestionDrafts: Array<OpenQuestionDraft> = [];

	fetchOpenQuestionDrafts();

	async function fetchOpenQuestionDrafts() {
		openQuestionDrafts = await DataStore.query(OpenQuestionDraft, (q) =>
			q.challengepoolID('eq', challengePool.id)
		);
	}

	async function createOpenQuestionDraft() {
		const questionText = document.getElementById('openQuestionDraftQuestionText').value;
		await DataStore.save(
			new OpenQuestionDraft({
				questionText,
				challengepoolID: challengePool.id
			})
		);
		document.getElementById('openQuestionDraftQuestionText').value = '';

		await fetchOpenQuestionDrafts();
		document.getElementById('openQuestionDraftAnswerText').focus();
	}

	async function updateOpenQuestionDraftWithAnswer(openQuestionDraft: OpenQuestionDraft) {
		const answerText = document.getElementById('openQuestionDraftAnswerText').value;
		await DataStore.save(
			OpenQuestionDraft.copyOf(openQuestionDraft, (updated) => {
				updated.answerText = answerText;
			})
		);
		fetchOpenQuestionDrafts();
	}

	async function deleteOpenQuestionDraft(id) {
		await DataStore.delete(await DataStore.query(OpenQuestionDraft, id));
		fetchOpenQuestionDrafts();
	}

	async function deleteMyAnswerFromOpenQuestionDraft(openQuestionDraft) {
		await DataStore.save(
			OpenQuestionDraft.copyOf(openQuestionDraft, (updated) => {
				updated.answerText = null;
			})
		);
		fetchOpenQuestionDrafts();
	}

	async function commitOpenQuestion(openQuestionDraft: OpenQuestionDraft, userId: string) {
		await DataStore.save(
			new OpenQuestion({
				questionText: openQuestionDraft.questionText,
				challengepoolID: openQuestionDraft.challengepoolID,
				owner: userId
			})
		);
		dispatch('openQuestionCommitted');

		publishOpenQuestionCommittedEvent(openQuestionDraft);

		dispatch('toast', { type: 'success', text: 'Open Question created!' });

		await DataStore.delete(await DataStore.query(OpenQuestionDraft, openQuestionDraft.id));
		fetchOpenQuestionDrafts();
	}

	async function publishOpenQuestionCommittedEvent(openQuestionDraft: OpenQuestionDraft) {
		var myHeaders = new Headers();
		myHeaders.append('Content-Type', 'application/json');

		var raw = JSON.stringify(openQuestionDraft);

		var requestOptions = {
			method: 'POST',
			headers: myHeaders,
			body: raw
		};

		fetch(`${baseUrl}/commitOpenQuestion`, requestOptions)
			.then((response) => response.text())
			.then((result) => console.log(result))
			.catch((error) => console.log('error', error));
	}
</script>

<div class="flex justify-between space-x-2">
	<div class="w-full mt-4">
		<input class="w-full" placeholder="Create an open question" id="openQuestionDraftQuestionText" />
	</div>
	<div>
		<button on:click={createOpenQuestionDraft} class="w-32 mt-4">Save</button>
	</div>
</div>

<div class="">
	{#if openQuestionDrafts.length > 0}
		<h3 class="mt-8">Drafts</h3>
	{/if}

	{#if openQuestionDrafts && openQuestionDrafts.length > 0}
		{#each openQuestionDrafts as openQuestionDraft}
			<article class="mb-8">
				<div class="flex justify-between space-x-2">
					<h4 class="w-full">{openQuestionDraft.questionText}</h4>
					<button
						on:click={() => deleteOpenQuestionDraft(openQuestionDraft.id)}
						class="w-48 outline secondary"
					>
						Delete Question
					</button>
				</div>

				<div class="flex justify-between space-x-2">
					{#if openQuestionDraft.answerText == null}
						<input
							class="w-full"
							placeholder="What is the correct answer?"
							id="openQuestionDraftAnswerText"
						/>
						<button on:click={() => updateOpenQuestionDraftWithAnswer(openQuestionDraft)} class="w-32">
							Save
						</button>
					{:else}
						<b class="w-full">Answer: {openQuestionDraft.answerText}</b>
						<button on:click={() => deleteMyAnswerFromOpenQuestionDraft(openQuestionDraft)} class="w-48">
							Delete Answer
						</button>
						<button
							disabled={!openQuestionDraft.answerText}
							on:click={() => commitOpenQuestion(openQuestionDraft, userId)}
							class="w-32"
						>
							Publish
						</button>
					{/if}
				</div>
			</article>
		{/each}
	{/if}
</div>
