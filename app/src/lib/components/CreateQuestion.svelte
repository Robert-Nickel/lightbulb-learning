<script lang="ts">
	import { CourseType, saveQuestion, saveQuestionTopics } from '$lib/supabaseQueries';
	import autosize from '../../../node_modules/autosize';
	import SelectTopics from './SelectTopics.svelte';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';
	import { session } from '$app/stores';

	export let course: CourseType;

	let questionText;
	let selectedTopics;
</script>

<div class="mt-4">
	<h3 class="mt-8">New Question</h3>
	<textarea
		id="textarea-question"
		class="w-full h-12"
		placeholder="Create a question"
		bind:value={questionText}
		on:load={autosize(document.getElementById('textarea-question'))}
	/>
	{#if questionText}
		<SelectTopics
			courseId={course.id}
			on:selectedTopicsChanged={(event) => {
				selectedTopics = event.detail.selectedTopics;
			}}
		/>
	{/if}
	<button
		id="button-publish"
		disabled={!questionText}
		on:click={async () => {
			const question = await saveQuestion(questionText, course.id, $session.user.id);
			if (selectedTopics && selectedTopics.length > 0) {
				await saveQuestionTopics(question.id, selectedTopics);
			}
			selectedTopics = [];
			goto(routes.question(question.id));
		}}
		class="w-32 h-12 mb-0"
	>
		Publish
	</button>
</div>
