<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();
	import Toast from './Toast.svelte';
	import {
		ChallengePoolType,
		OpenQuestionDraftType,
		fetchMyOpenQuestionDrafts,
		saveOpenQuestionDraft,
		updateOpenQuestionDraftWithAnswer,
		deleteAnswerFromOpenQuestionDraft,
		saveOpenQuestion,
		deleteOpenQuestionDraft
	} from '$lib/supabaseClient';

	export let challengePool: ChallengePoolType;

	let openQuestionDrafts: OpenQuestionDraftType[] = [];
	let newOpenQuestionDraftText;
	let toast;

	onMount(async () => {
		openQuestionDrafts = await fetchMyOpenQuestionDrafts(challengePool.id);
	});
</script>

<div class="flex justify-between space-x-2">
	<div class="w-full mt-4">
		<input class="w-full" placeholder="Create an open question" bind:value={newOpenQuestionDraftText} />
	</div>
	<div>
		<button
			on:click={async () => {
				const newOpenQuestionDraft = await saveOpenQuestionDraft(newOpenQuestionDraftText, challengePool.id);
				console.log({ newOpenQuestionDraft });
				openQuestionDrafts.push(newOpenQuestionDraft);
				newOpenQuestionDraftText = '';
				// TODO: focus the answer input
			}}
			class="w-32 mt-4">Save</button
		>
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
						on:click={async () => {
							await deleteOpenQuestionDraft(openQuestionDraft.id);
							openQuestionDrafts = await fetchMyOpenQuestionDrafts(challengePool.id);
						}}
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
						<button
							on:click={async () => {
								const answerText = document.getElementById('openQuestionDraftAnswerText').value;
								await updateOpenQuestionDraftWithAnswer(openQuestionDraft.id, answerText);
								openQuestionDrafts = await fetchMyOpenQuestionDrafts(challengePool.id);
							}}
							class="w-48"
						>
							Save
						</button>
					</div>
				{:else}
					<div class="flex justify-between space-x-2">
						<p class="w-full"><i>Your Answer:</i> {openQuestionDraft.answerText}</p>
						<button
							on:click={async () => {
								deleteAnswerFromOpenQuestionDraft(openQuestionDraft.id);
								openQuestionDrafts = await fetchMyOpenQuestionDrafts(challengePool.id);
							}}
							class="w-48 outline secondary h-12"
						>
							Delete Answer
						</button>
					</div>
					<button
						disabled={!openQuestionDraft.answerText}
						on:click={async () => {
							await saveOpenQuestion(openQuestionDraft.questionText, openQuestionDraft.challengePool);
							dispatch('openQuestionCommitted');
							toast.showSuccessToast('Open Question created');
							await deleteOpenQuestionDraft(openQuestionDraft.id);
							openQuestionDrafts = await fetchMyOpenQuestionDrafts(openQuestionDraft.challengePool);
						}}
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
