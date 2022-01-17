<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Back from '$lib/components/Back.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { goto } from '$app/navigation';
	import {
		deleteOpenAnswerDraft,
		fetchMyOpenAnswers,
		fetchMyOpenAnswerDraft,
		fetchOpenAnswersOfOthers,
		fetchOpenQuestion,
		OpenAnswerDraftType,
		OpenAnswerType,
		OpenQuestionType,
		saveOpenAnswer,
		saveOpenAnswerDraft,
		supabase,
		fetchLatestOpenAnswer
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';

	let openQuestion: OpenQuestionType;
	let myOpenAnswerDraft: OpenAnswerDraftType;
	let myOpenAnswer: OpenAnswerType;
	let openAnswersOfOthers: OpenAnswerType[] = [];
	let toast;
	let openAnswerDraftText = '';

	onMount(async () => {
		const openQuestionId = $page.params.slug;
		openQuestion = await fetchOpenQuestion(openQuestionId);
		myOpenAnswer = await fetchLatestOpenAnswer(openQuestion.id, supabase.auth.user().id);
		myOpenAnswerDraft = await fetchMyOpenAnswerDraft(openQuestion.id);
		openAnswersOfOthers = await fetchOpenAnswersOfOthers(openQuestion.id);
	});
</script>

<main class="container">
	{#if openQuestion}
		{#if openQuestion.owner == $user.id}
			<h1 class="yours pl-4">{openQuestion.questionText}</h1>

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
				<article class="yours hoverable" on:click={() => goto(`/openanswer/${myOpenAnswer.id}`)}>
					<i>This is your answer: </i>{myOpenAnswer.answerText}
				</article>
			{:else if myOpenAnswerDraft}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">{myOpenAnswerDraft.answerText}</div>
					<button
						on:click={async () => {
							myOpenAnswerDraft = await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
						}}
						class="w-48 secondary outline">Delete</button
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
						class="w-32">Publish</button
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

		{#each openAnswersOfOthers as openAnswerOfOther}
			<article class="hoverable" on:click={() => goto(`/openanswer/${openAnswerOfOther.id}`)}>
				{openAnswerOfOther.answerText}
			</article>
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
