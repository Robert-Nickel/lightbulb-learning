<script lang="ts">
	import Toast from './Toast.svelte';
	import { CourseType, saveOpenQuestion, saveOpenQuestionTopics } from '$lib/supabaseClient';
	import autosize from '../../../node_modules/autosize';
	import SelectTopics from './SelectTopics.svelte';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	export let course: CourseType;

	let openQuestionText;
	let toast;
	let selectedTopics;
</script>

<div class="mt-4">
	<h3 class="mt-8">New Open Question</h3>
	<textarea
		id="textarea-question"
		class="w-full h-12"
		placeholder="Create an open question"
		bind:value={openQuestionText}
		on:load={autosize(document.getElementById('textarea-question'))}
	/>
	{#if openQuestionText}
		<SelectTopics
			courseId={course.id}
			on:selectedTopicsChanged={(event) => {
				selectedTopics = event.detail.selectedTopics;
			}}
		/>
	{/if}
	<button
		id="button-publish"
		disabled={!openQuestionText}
		on:click={async () => {
			const openQuestion = await saveOpenQuestion(openQuestionText, course.id);
			if (selectedTopics && selectedTopics.length > 0) {
				await saveOpenQuestionTopics(openQuestion.id, selectedTopics);
			}
			selectedTopics = [];
			goto(routes.openQuestion(openQuestion.id));
		}}
		class="w-32 h-12 mb-0"
	>
		Publish
	</button>
</div>

<Toast bind:this={toast} />
