<script lang="ts">
	import {
		OpenAnswerType,
		saveOpenAnswer,
	} from '$lib/supabaseClient';
	import Toast from './Toast.svelte';
	import autosize from '../../../node_modules/autosize';
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let openAnswer: OpenAnswerType;
	let improvedAnswerText;
	let toast;
</script>

<div class="w-full">
	<textarea
		id="textarea-improved-answer"
		on:load={autosize(document.getElementById('textarea-improved-answer'))}
		bind:value={improvedAnswerText}
		class="w-full h-12"
		placeholder="Improve your answer"
	/>
</div>
<button
	on:click={async () => {
		const improvedOpenAnswer = await saveOpenAnswer(
			improvedAnswerText,
			openAnswer.question,
			openAnswer.version + 1
		);
		improvedAnswerText = null;

		toast.showSuccessToast('Open Answer improved!');
		dispatch('openAnswerImproved', improvedOpenAnswer.id);
	}}
	class="w-32 mt-4" disabled={!improvedAnswerText}>Publish</button
>

<Toast bind:this={toast} />
