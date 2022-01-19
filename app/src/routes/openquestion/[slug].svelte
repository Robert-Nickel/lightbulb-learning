<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Back from '$lib/components/Back.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import {
		deleteOpenAnswerDraft,
		fetchMyOpenAnswerDraft,
		fetchOpenAnswersOfOthers,
		fetchOpenQuestion,
		OpenAnswerDraftType,
		OpenAnswerType,
		OpenQuestionType,
		saveOpenAnswer,
		saveOpenAnswerDraft,
		supabase,
		fetchLatestOpenAnswer,
		CorrectOpenAnswerType,
		fetchCorrectOpenAnswer
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';

	let openQuestion: OpenQuestionType;
	let correctOpenAnswer: CorrectOpenAnswerType;
	let myOpenAnswerDraft: OpenAnswerDraftType;
	let myOpenAnswer: OpenAnswerType;
	let openAnswersOfOthers: OpenAnswerType[] = [];
	let openAnswerDraftText = '';
	let toast;

	onMount(async () => {
		const openQuestionId = $page.params.slug;
		openQuestion = await fetchOpenQuestion(openQuestionId);
		correctOpenAnswer = await fetchCorrectOpenAnswer(openQuestionId);
		myOpenAnswer = await fetchLatestOpenAnswer(openQuestion.id, supabase.auth.user().id);
		myOpenAnswerDraft = await fetchMyOpenAnswerDraft(openQuestion.id);
		const openAnswersOfOthersWithNonLatest = await fetchOpenAnswersOfOthers(openQuestion.id);
		openAnswersOfOthers = await filterNonLatest(openAnswersOfOthersWithNonLatest);
	});

	async function filterNonLatest(openAnswersOfOthers) {
		// O(n^2) <- thats though, isn't there a better way?
		// It filters out the non-latest open answers
		let openAnswers = openAnswersOfOthers;
		let indizesToRemove: number[] = [];
		for (let i = 0; i < openAnswers.length; i++) {
			let openAnswer = openAnswers[i];
			for (let otherOpenAnswer of openAnswers) {
				if (openAnswer.owner == otherOpenAnswer.owner) {
					if (openAnswer.version < otherOpenAnswer.version) {
						indizesToRemove.push(i);
						break;
					}
				}
			}
		}
		indizesToRemove
			.sort((a, b) => 0 - (a > b ? 1 : -1)) // sort descending
			.forEach((index) => {
				openAnswers.splice(index, 1);
			});
		return openAnswers;
	}
</script>

<main class="container">
	{#if openQuestion}
		{#if openQuestion.owner == $user.id}
			<h1 class="yours pl-4">{openQuestion.questionText}</h1>
			{#if correctOpenAnswer}
				<div class="mb-4"><i>Correct answer: </i>{correctOpenAnswer.answerText}</div>
			{/if}
			<div class="mb-4">
				{#if openAnswersOfOthers.length == 0}
					<i>No one has answered your question yet.</i>
				{:else}
					<i>People answered:</i>
				{/if}
			</div>
		{:else}
			<h1>{openQuestion.questionText}</h1>

			{#if myOpenAnswer}
				<a href={`/openanswer/${myOpenAnswer.id}`} class="light-link">
					<article class="yours hoverable">
						<i>Your answer: </i>{myOpenAnswer.answerText}
					</article>
				</a>
			{:else if myOpenAnswerDraft}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">{myOpenAnswerDraft.answerText}</div>
					<button
						on:click={async () => {
							myOpenAnswerDraft = await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
						}}
						class="w-48 h-12 secondary outline">Delete</button
					>
				</div>
				<div>
					<button
						on:click={async () => {
							myOpenAnswer = await saveOpenAnswer(
								myOpenAnswerDraft.answerText,
								myOpenAnswerDraft.openQuestion
							);
							myOpenAnswerDraft = await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
							toast.showSuccessToast('Open Answer created!');
						}}
						class="w-32 mt-4">Publish</button
					>
				</div>
			{:else}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">
						<input bind:value={openAnswerDraftText} class="w-full" placeholder="Answer this question" />
					</div>
					<button
						on:click={async () => {
							myOpenAnswerDraft = await saveOpenAnswerDraft(openAnswerDraftText, openQuestion.id);
						}}
						class="w-48 ">Save</button
					>
				</div>
			{/if}
		{/if}

		<!-- This shows the old and the new versions of the answers! -->
		{#each openAnswersOfOthers as openAnswerOfOther}
			<a href={`/openanswer/${openAnswerOfOther.id}`} class="light-link">
				<article class="hoverable">
					{openAnswerOfOther.answerText}
				</article>
			</a>
		{/each}

		<Back text="Back to Challenge Pool" route="/challengepool/{openQuestion.challengePool}" />
	{/if}
</main>

<Toast bind:this={toast} />

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.hoverable:hover {
		background: var(--card-sectionning-background-color);
	}
</style>
