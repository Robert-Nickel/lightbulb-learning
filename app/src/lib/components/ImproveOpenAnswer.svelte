<script lang="ts">
	import {
		AnswerType,
		saveAnswer,
	} from '$lib/supabaseClient';
	import Toast from './Toast.svelte';
	import autosize from '../../../node_modules/autosize';
	import { createEventDispatcher, onMount } from 'svelte';
	const dispatch = createEventDispatcher();

	export let answer: AnswerType;
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
		const improvedAnswer = await saveAnswer(
			improvedAnswerText,
			answer.question,
			answer.version + 1
		);
		improvedAnswerText = null;

		toast.showSuccessToast('Answer improved!');
		dispatch('answerImproved', improvedAnswer.id);
	}}
	class="w-32 mt-4" disabled={!improvedAnswerText}>Publish</button
>

<Toast bind:this={toast} />
