<script lang="ts">
	import { AnswerType, saveAnswer } from '$lib/supabaseQueries';
	import autosize from '../../../node_modules/autosize';
	import { createEventDispatcher } from 'svelte';
	import { session } from '$app/stores';
	const dispatch = createEventDispatcher();

	export let answer: AnswerType;
	let improvedAnswerText;
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
			$session.user.id,
			answer.version + 1
		);
		improvedAnswerText = null;

		dispatch('answerImproved', improvedAnswer.id);
	}}
	class="w-32 mt-4"
	disabled={!improvedAnswerText}>Publish</button
>
