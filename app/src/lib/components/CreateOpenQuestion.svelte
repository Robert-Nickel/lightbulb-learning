<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();
	import Toast from './Toast.svelte';
	import {
		ChallengePoolType,
		OpenQuestionDraftType,
		saveOpenQuestionDraft,
		updateOpenQuestionDraftWithAnswer,
		deleteAnswerFromOpenQuestionDraft,
		saveOpenQuestion,
		deleteOpenQuestionDraft,
		saveCorrectOpenAnswer,
		fetchMyOpenQuestionDraft
	} from '$lib/supabaseClient';
	import autosize from '../../../node_modules/autosize';

	export let challengePool: ChallengePoolType;

	let openQuestionDraft: OpenQuestionDraftType;
	let openQuestionDraftText = '';
	let openQuestionDraftAnswerText = '';
	let toast;

	onMount(async () => {
		openQuestionDraft = await fetchMyOpenQuestionDraft(challengePool.id);
	});
</script>

<div class="mt-4">
	<textarea
		id="textarea-question"
		class="w-full h-12"
		placeholder="Create an open question"
		bind:value={openQuestionDraftText}
		on:load={autosize(document.getElementById('textarea-question'))}
	/>
	<button
		hidden={openQuestionDraftText.length == 0}
		on:click={async () => {
			openQuestionDraft = await saveOpenQuestionDraft(openQuestionDraftText, challengePool.id);
			openQuestionDraftText = '';
			// TODO: focus the answer input
		}}
		class="w-32 h-12">Save</button
	>
</div>

<div class="mt-4">
	{#if openQuestionDraft}
		<h3 class="mt-8">Draft</h3>
		<article>
			<div class="flex justify-between space-x-2">
				<p class="w-full" id="p-draft-question">{openQuestionDraft.questionText}</p>
				<button
					on:click={async () => {
						await deleteOpenQuestionDraft(openQuestionDraft.id);
						openQuestionDraft = null;
						openQuestionDraftAnswerText = '';
					}}
					class="w-24 outline secondary h-12 hover-red"
				>
					Delete
				</button>
			</div>

			{#if openQuestionDraft.answerText == null}
				<div>
					<textarea
						class="w-full h-12"
						placeholder="What is the correct answer?"
						id="textarea-draft-answer"
						on:load={autosize(document.getElementById('textarea-draft-answer'))}
						bind:value={openQuestionDraftAnswerText}
					/>
					<button
						on:click={async () => {
							openQuestionDraft = await updateOpenQuestionDraftWithAnswer(
								openQuestionDraft.id,
								openQuestionDraftAnswerText
							);
						}}
						hidden={openQuestionDraftAnswerText.length == 0}
						class="w-32 h-12 mb-0"
						id="button-save"
					>
						Save
					</button>
				</div>
			{:else}
				<div class="flex justify-between space-x-2">
					<p class="w-full" id="p-draft-answer"><i>Your Answer:</i> {openQuestionDraft.answerText}</p>
					<button
						on:click={async () => {
							openQuestionDraft = await deleteAnswerFromOpenQuestionDraft(openQuestionDraft.id);
							openQuestionDraftAnswerText = '';
						}}
						class="w-24 outline secondary h-12 hover-red"
					>
						Delete
					</button>
				</div>
				<button
					id="button-publish"
					disabled={!openQuestionDraft.answerText}
					on:click={async () => {
						const openQuestion = await saveOpenQuestion(
							openQuestionDraft.questionText,
							openQuestionDraft.challengePool
						);
						await saveCorrectOpenAnswer(openQuestionDraft.answerText, openQuestion.id);
						dispatch('openQuestionCommitted');
						toast.showSuccessToast('Open Question created');
						await deleteOpenQuestionDraft(openQuestionDraft.id);
						openQuestionDraft = null;
						openQuestionDraftAnswerText = "";
					}}
					class="w-32 h-12 mb-0"
				>
					Publish
				</button>
			{/if}
		</article>
	{/if}
</div>

<Toast bind:this={toast} />
