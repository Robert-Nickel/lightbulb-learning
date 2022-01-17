<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		deleteOpenAnswerDraft,
		fetchMyOpenAnswerDraft,
		OpenAnswerDraftType,
		OpenAnswerType,
		saveOpenAnswer,
		saveOpenAnswerDraft
	} from '$lib/supabaseClient';
	import Toast from './Toast.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let openAnswer: OpenAnswerType;
	let myOpenAnswerDraft: OpenAnswerDraftType;
	let openAnswerDraftText;
	let toast;

	onMount(async () => {
		myOpenAnswerDraft = await fetchMyOpenAnswerDraft(openAnswer.openQuestion);
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
			class="w-48 secondary outline">Delete</button
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
			class="w-32">Publish</button
		>
	</div>
{:else}
	<div class="flex justify-between space-x-2 mt-2">
		<div class="w-full">
			<input bind:value={openAnswerDraftText} class="w-full" placeholder="Improve your answer" />
		</div>
		<button
			on:click={async () => {
				myOpenAnswerDraft = await saveOpenAnswerDraft(openAnswerDraftText, openAnswer.openQuestion);
			}}
			class="w-48 ">Save</button
		>
	</div>
{/if}

<Toast bind:this={toast} />
