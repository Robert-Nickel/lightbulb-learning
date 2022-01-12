<script lang="ts">
	import {
		deleteOpenAnswerDraft,
		fetchMyOpenAnswerDraft,
		OpenAnswerDraftType,
		OpenAnswerType,
		saveOpenAnswer,
		saveOpenAnswerDraft
	} from '$lib/supabaseClient';
	import { onMount } from 'svelte';
	import Toast from './Toast.svelte';

	export let openAnswer: OpenAnswerType;
	let myOpenAnswerDraft: OpenAnswerDraftType;
	let openAnswerDraftText = '';
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
				await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
				myOpenAnswerDraft = null;

				await saveOpenAnswer(
					myOpenAnswerDraft.answerText,
					myOpenAnswerDraft.openQuestion,
					openAnswer.version++
				);
				toast.showSuccessToast('Open Answer improved!');
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
