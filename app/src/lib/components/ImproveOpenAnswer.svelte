<script lang="ts">
	import {
		openAnswerDraftsTable,
		OpenAnswerDraftType,
		openAnswersTable,
		OpenAnswerType,
		supabase
	} from '$lib/supabaseClient';

	import Toast from './Toast.svelte';

	export let openAnswer: OpenAnswerType;
	let openAnswerDraft: OpenAnswerDraftType;
	let openAnswerDraftText = '';
	let toast;

	fetchOpenAnswerDraft();

	async function fetchOpenAnswerDraft() {
		openAnswerDraft = await (
			await supabase
				.from<OpenAnswerDraftType>(openAnswerDraftsTable)
				.select()
				.eq('openQuestion', openAnswer.openQuestion)
				.eq('owner', supabase.auth.user().id)
				.single()
		).data;
	}

	async function deleteMyOpenAnswerDraft() {
		await supabase.from<OpenAnswerDraftType>(openAnswerDraftsTable).delete().eq('id', openAnswerDraft.id);
		openAnswerDraftText = '';
		fetchOpenAnswerDraft();
	}

	async function saveOpenAnswerDraft() {
		await supabase.from<OpenAnswerDraftType>(openAnswerDraftsTable).insert({
			answerText: openAnswerDraftText,
			openQuestion: openAnswer.openQuestion,
			owner: supabase.auth.user().id,
			originalOpenAnswer: openAnswer.id
		});
		fetchOpenAnswerDraft();
	}

	async function publishImprovedOpenAnswer() {
		deleteMyOpenAnswerDraft();
		let improvedVersion = openAnswer.version++;

		await supabase.from<OpenAnswerType>(openAnswersTable).insert({
			answerText: openAnswerDraft.answerText,
			version: improvedVersion,
			openQuestion: openAnswerDraft.openQuestion,
			owner: supabase.auth.user().id,
			originalOpenAnswer: openAnswerDraft.originalOpenAnswer
		});
		fetchOpenAnswerDraft();
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
