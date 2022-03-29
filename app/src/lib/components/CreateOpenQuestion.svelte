<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import Toast from './Toast.svelte';
	import {
		CourseType,
		OpenQuestionDraftType,
		saveOpenQuestionDraft,
		saveOpenQuestion,
		deleteOpenQuestionDraft,
		fetchMyOpenQuestionDraft,
		saveOpenQuestionTopics
	} from '$lib/supabaseClient';
	import autosize from '../../../node_modules/autosize';
	import SelectTopics from './SelectTopics.svelte';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	export let course: CourseType;

	let openQuestionDraft: OpenQuestionDraftType;
	let openQuestionDraftText = '';
	let toast;
	let selectedTopics;

	onMount(async () => {
		openQuestionDraft = await fetchMyOpenQuestionDraft(course.id);
	});
</script>

<div class="mt-4">
	{#if !openQuestionDraft}
		<h3 class="mt-8">New Open Question</h3>
		<textarea
			id="textarea-question"
			class="w-full h-12"
			placeholder="Create an open question"
			bind:value={openQuestionDraftText}
			on:load={autosize(document.getElementById('textarea-question'))}
		/>
		<button
			hidden={openQuestionDraftText.length == 0}
			on:click={async () => {
				openQuestionDraft = await saveOpenQuestionDraft(openQuestionDraftText, course.id);
				openQuestionDraftText = '';
			}}
			class="w-32 h-12">Save</button
		>
	{:else}
		<h3 class="mt-8">Draft</h3>
		<article>
			<div class="flex justify-between space-x-2">
				<p class="w-full" id="p-draft-question">{openQuestionDraft.questionText}</p>
				<button
					on:click={async () => {
						await deleteOpenQuestionDraft(openQuestionDraft.id);
						openQuestionDraft = null;
					}}
					class="w-24 outline secondary h-12 hover-red"
				>
					Delete
				</button>
			</div>

			<SelectTopics
				courseId={course.id}
				on:selectedTopicsChanged={(event) => {
					selectedTopics = event.detail.selectedTopics;
				}}
			/>
			<button
				id="button-publish"
				disabled={!openQuestionDraft.questionText}
				on:click={async () => {
					const openQuestion = await saveOpenQuestion(
						openQuestionDraft.questionText,
						openQuestionDraft.course
					);
					if (selectedTopics && selectedTopics.length > 0) {
						await saveOpenQuestionTopics(openQuestion.id, selectedTopics);
					}
					await deleteOpenQuestionDraft(openQuestionDraft.id);
					openQuestionDraft = null;
					selectedTopics = [];
					goto(routes.openQuestion(openQuestion.id));
				}}
				class="w-32 h-12 mb-0"
			>
				Publish
			</button>
		</article>
	{/if}
</div>

<Toast bind:this={toast} />
