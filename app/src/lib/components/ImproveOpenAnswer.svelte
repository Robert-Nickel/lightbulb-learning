<script lang="ts">
	import { OpenAnswer, OpenAnswerDraft } from '$lib/models';
	import { DataStore } from 'aws-amplify';
	import { user } from '$lib/stores/user';
import Toast from './Toast.svelte';

	export let openAnswer: OpenAnswer;
	let openAnswerDraft: OpenAnswerDraft;
	let openAnswerDraftText = '';
	let toast;

    fetchOpenAnswerDraft();

	async function fetchOpenAnswerDraft() {
		let openAnswerDrafts = await DataStore.query(OpenAnswerDraft, (a) =>
			a.openquestionID('eq', openAnswer.openquestionID)
		);
		openAnswerDraft = openAnswerDrafts[0];
	}

	async function deleteMyOpenAnswerDraft() {
		await DataStore.delete(await DataStore.query(OpenAnswerDraft, openAnswerDraft.id));
        openAnswerDraftText = "";
        fetchOpenAnswerDraft()
	}

	async function saveOpenAnswerDraft() {
		await DataStore.save(
			new OpenAnswerDraft({
				answerText: openAnswerDraftText,
				openquestionID: openAnswer.openquestionID
			})
		);
		fetchOpenAnswerDraft();
	}

	async function publishImprovedOpenAnswer() {
		deleteMyOpenAnswerDraft();
		let currentVersion = openAnswer.version ? openAnswer.version : 0;
		let myImprovedOpenAnswer: OpenAnswer = new OpenAnswer({
			answerText: openAnswerDraft.answerText,
			version: currentVersion + 1,
			openquestionID: openAnswerDraft.openquestionID,
			owner: $user.id
		});
		await DataStore.save(myImprovedOpenAnswer);
        toast.showSuccessToast('Open Answer improved!');
	}
</script>

{#if openAnswerDraft}
	<div class="flex justify-between space-x-2 mt-2">
		<div class="w-full">{openAnswerDraft.answerText}</div>
		<button on:click={deleteMyOpenAnswerDraft} class="w-48 secondary outline">Delete</button>
	</div>
	<div>
		<button on:click={publishImprovedOpenAnswer} class="w-32">Publish</button>
	</div>
{:else}
	<div class="flex justify-between space-x-2 mt-2">
		<div class="w-full">
			<input bind:value={openAnswerDraftText} class="w-full" placeholder="Improve your answer" />
		</div>
		<button on:click={saveOpenAnswerDraft} class="w-48 ">Save</button>
	</div>
{/if}

<Toast bind:this={toast} />
