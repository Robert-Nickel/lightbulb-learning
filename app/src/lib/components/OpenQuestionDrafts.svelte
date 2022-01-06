<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	import Toast from './Toast.svelte';
	import {
		supabase,
		ChallengePoolType,
		OpenQuestionDraftType,
		OpenQuestionType,
		openQuestionDraftsTable,
		openQuestionsTable
	} from '$lib/supabaseClient';

	export let challengePool: ChallengePoolType;

	let openQuestionDrafts: Array<OpenQuestionDraftType> = [];
	let toast;

	fetchOpenQuestionDrafts();

	async function fetchOpenQuestionDrafts() {
		openQuestionDrafts = await (
			await supabase
				.from<OpenQuestionDraftType>(openQuestionDraftsTable)
				.select()
				.eq('owner', supabase.auth.user().id)
				.eq('challengePool', challengePool.id)
		).data;
	}

	async function createOpenQuestionDraft() {
		const questionText = document.getElementById('openQuestionDraftQuestionText').value;
		await supabase
			.from<OpenQuestionDraftType>(openQuestionDraftsTable)
			.insert({ questionText, challengePool: challengePool.id, owner: supabase.auth.user().id });
		document.getElementById('openQuestionDraftQuestionText').value = '';

		await fetchOpenQuestionDrafts();
		document.getElementById('openQuestionDraftAnswerText').focus();
	}

	async function updateOpenQuestionDraftWithAnswer(openQuestionDraft: OpenQuestionDraft) {
		const answerText = document.getElementById('openQuestionDraftAnswerText').value;
		await supabase
			.from<OpenQuestionDraftType>(openQuestionDraftsTable)
			.update({ answerText })
			.eq('id', openQuestionDraft.id);

		fetchOpenQuestionDrafts();
	}

	async function deleteOpenQuestionDraft(id) {
		await supabase.from<OpenQuestionDraftType>(openQuestionDraftsTable).delete().eq('id', id);
		fetchOpenQuestionDrafts();
	}

	async function deleteMyAnswerFromOpenQuestionDraft(openQuestionDraft) {
		await supabase
			.from<OpenQuestionDraftType>(openQuestionDraftsTable)
			.update({ answerText: null })
			.eq('id', openQuestionDraft.id);

		fetchOpenQuestionDrafts();
	}

	async function commitOpenQuestion(openQuestionDraft: OpenQuestionDraftType) {
		await supabase.from<OpenQuestionType>(openQuestionsTable).insert({
			questionText: openQuestionDraft.questionText,
			challengePool: openQuestionDraft.challengePool,
			owner: supabase.auth.user().id
		});

		dispatch('openQuestionCommitted');

		toast.showSuccessToast('Open Question created');

		await supabase
			.from<OpenQuestionDraftType>(openQuestionDraftsTable)
			.delete()
			.eq('id', openQuestionDraft.id);
		fetchOpenQuestionDrafts();
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
					<p class="w-full">{openQuestionDraft.questionText}</p>
					<button
						on:click={() => deleteOpenQuestionDraft(openQuestionDraft.id)}
						class="w-48 outline secondary"
					>
						Delete Question
					</button>
				</div>

				{#if openQuestionDraft.answerText == null}
					<div class="flex justify-between space-x-2">
						<input
							class="w-full"
							placeholder="What is the correct answer?"
							id="openQuestionDraftAnswerText"
						/>
						<button on:click={() => updateOpenQuestionDraftWithAnswer(openQuestionDraft)} class="w-48">
							Save
						</button>
					</div>
				{:else}
					<div class="flex justify-between space-x-2">
						<p class="w-full"><i>Your Answer:</i> {openQuestionDraft.answerText}</p>
						<button
							on:click={() => deleteMyAnswerFromOpenQuestionDraft(openQuestionDraft)}
							class="w-48 outline secondary h-12"
						>
							Delete Answer
						</button>
					</div>
					<button
						disabled={!openQuestionDraft.answerText}
						on:click={() => commitOpenQuestion(openQuestionDraft)}
						class="w-32 h-12"
					>
						Publish
					</button>
				{/if}
			</article>
		{/each}
	{/if}
</div>

<Toast bind:this={toast} />
