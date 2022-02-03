<script lang="ts">
	import {
		deleteOpenAnswerDraft,
		fetchMyOpenAnswerDraft,
		OpenAnswerDraftType,
		OpenAnswerType,
		saveOpenAnswer,
		saveOpenAnswerDraft
	} from '$lib/supabaseClient';
	import Toast from './Toast.svelte';
	import autosize from '../../../node_modules/autosize';
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let openAnswer: OpenAnswerType;
	let myOpenAnswerDraft: OpenAnswerDraftType;
	let openAnswerDraftText;
	let toast;

	onMount(async () => {
		myOpenAnswerDraft = await fetchMyOpenAnswerDraft(openAnswer.openQuestion);
		openAnswerDraftText = openAnswer.answerText;
	});
</script>

{#if myOpenAnswerDraft}
	<div class="flex justify-between space-x-2 mt-2">
		<div class="w-full">{myOpenAnswerDraft.answerText}</div>
		<button
			on:click={async () => {
				myOpenAnswerDraft = await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
				openAnswerDraftText = '';
			}}
			class="w-48 h-12 secondary outline">Delete</button
		>
	</div>
	<div>
		<button
			on:click={async () => {
				const improvedOpenAnswer = await saveOpenAnswer(
					myOpenAnswerDraft.answerText,
					myOpenAnswerDraft.openQuestion,
					openAnswer.version + 1
				);
				myOpenAnswerDraft = await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
				toast.showSuccessToast('Open Answer improved!');
				dispatch('openAnswerImproved', improvedOpenAnswer.id);
			}}
			class="w-32 mt-4">Publish</button
		>
	</div>
{:else}
	<div class="flex justify-between space-x-2 mt-2">
		<div class="w-full">
			<textarea
				id="textarea-improved-answer"
				on:load={autosize(document.getElementById('textarea-improved-answer'))}
				bind:value={openAnswerDraftText}
				class="w-full h-12"
				placeholder="Improve your answer"
			/>
		</div>
		<button
			on:click={async () => {
				myOpenAnswerDraft = await saveOpenAnswerDraft(openAnswerDraftText, openAnswer.openQuestion);
			}}
			class="w-48 h-12">Save</button
		>
	</div>
{/if}

<Toast bind:this={toast} />
