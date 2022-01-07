<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Back from '$lib/components/Back.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import { goto } from '$app/navigation';
	import {
		openAnswerDraftsTable,
		OpenAnswerDraftType,
		openAnswersTable,
		OpenAnswerType,
		openQuestionsTable,
		OpenQuestionType,
		supabase
	} from '$lib/supabaseClient';

	let openQuestion: OpenQuestionType;
	let openAnswerDraft: OpenAnswerDraftType;
	let myOpenAnswer: OpenAnswerType;
	let openAnswersOfOthers: Array<OpenAnswerType> = [];
	let toast;
	let openAnswerDraftText = '';

	onMount(async () => {
		const openQuestionId = $page.params.slug;
		openQuestion = await (
			await supabase.from<OpenQuestionType>(openQuestionsTable).select().eq('id', openQuestionId).single()
		).data;
		fetchOpenAnswerDraft();
		fetchMyOpenAnswer();
		fetchOpenAnswersOfOthers();
	});

	async function fetchOpenAnswerDraft() {
		openAnswerDraft = await (
			await supabase
				.from<OpenAnswerDraftType>(openAnswerDraftsTable)
				.select()
				.eq('openQuestion', openQuestion.id)
				.eq('owner', supabase.auth.user().id)
				.single()
		).data;
	}

	async function fetchMyOpenAnswer() {
		myOpenAnswer = await (
			await supabase
				.from<OpenAnswerType>(openAnswersTable)
				.select()
				.eq('openQuestion', openQuestion.id)
				.eq('owner', supabase.auth.user().id)
				.single()
		).data;
	}

	async function fetchOpenAnswersOfOthers() {
		openAnswersOfOthers = await (
			await supabase
				.from<OpenAnswerType>(openAnswersTable)
				.select()
				.eq('openQuestion', openQuestion.id)
				.neq('owner', supabase.auth.user().id)
		).data;
	}

	async function saveOpenAnswerDraft() {
		await supabase.from<OpenAnswerDraftType>(openAnswerDraftsTable).insert({
			answerText: openAnswerDraftText,
			openQuestion: openQuestion.id,
			owner: supabase.auth.user().id
		});
		fetchOpenAnswerDraft();
	}

	async function deleteMyOpenAnswerDraft() {
		await supabase.from<OpenAnswerDraftType>(openAnswerDraftsTable).delete().eq('id', openAnswerDraft.id);
		fetchOpenAnswerDraft();
	}

	async function publishOpenAnswer() {
		deleteMyOpenAnswerDraft();
		await supabase.from<OpenAnswerType>(openAnswersTable).insert({
			answerText: openAnswerDraft.answerText,
			openQuestion: openAnswerDraft.openQuestion,
			owner: supabase.auth.user().id,
			version: 1
		});
		fetchMyOpenAnswer();
		toast.showSuccessToast('Open Answer created!');
	}
</script>

<main class="container">
	{#if openQuestion}
		{#if openQuestion.owner == supabase.auth.user().id}
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
			{:else if openAnswerDraft}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">{openAnswerDraft.answerText}</div>
					<button on:click={deleteMyOpenAnswerDraft} class="w-48 secondary outline">Delete</button>
				</div>
				<div>
					<button on:click={publishOpenAnswer} class="w-32">Publish</button>
				</div>
			{:else}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">
						<input bind:value={openAnswerDraftText} class="w-full" placeholder="Answer this question" />
					</div>
					<button on:click={saveOpenAnswerDraft} class="w-48 ">Save</button>
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
