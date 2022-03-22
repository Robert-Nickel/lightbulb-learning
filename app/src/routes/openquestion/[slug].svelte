<script lang="ts" context="module">
	export const load: Load = async ({ session, params }) => {
		const { user } = session as Session;
		if (!user) return { status: 302, redirect: '/login' };

		const questionId = params.slug;
		const openAnswersOfOthersWithNonLatest = await fetchOpenAnswersOfOthers(questionId, user.id);
		const openQuestion = await fetchOpenQuestion(questionId);
		const courseDescription = await (await fetchCourse(openQuestion.course)).description;

		return {
			props: {
				user,
				openQuestion,
				correctOpenAnswer: await fetchCorrectOpenAnswer(questionId, user.id),
				myOpenAnswerDraft: await fetchMyOpenAnswerDraft(questionId, user.id),
				myOpenAnswer: await fetchLatestOpenAnswer(questionId, user.id),
				openAnswersOfOthers: await filterNonLatest(openAnswersOfOthersWithNonLatest),
				courseDescription
			}
		};
	};

	async function filterNonLatest(openAnswersOfOthers) {
		// O(n^2) <- thats though, isn't there a better way?
		// It filters out the non-latest open answers
		let openAnswers = openAnswersOfOthers;
		let indizesToRemove: number[] = [];
		for (let i = 0; i < openAnswers.length; i++) {
			let openAnswer = openAnswers[i];
			for (let otherOpenAnswer of openAnswers) {
				if (openAnswer.owner == otherOpenAnswer.owner) {
					if (openAnswer.version < otherOpenAnswer.version) {
						indizesToRemove.push(i);
						break;
					}
				}
			}
		}
		indizesToRemove
			.sort((a, b) => 0 - (a > b ? 1 : -1)) // sort descending
			.forEach((index) => {
				openAnswers.splice(index, 1);
			});
		return openAnswers;
	}
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import Toast from '$lib/components/Toast.svelte';
	import {
		deleteOpenAnswerDraft,
		fetchMyOpenAnswerDraft,
		fetchOpenAnswersOfOthers,
		fetchOpenQuestion,
		OpenAnswerDraftType,
		OpenAnswerType,
		OpenQuestionType,
		saveOpenAnswer,
		saveOpenAnswerDraft,
		supabase,
		fetchLatestOpenAnswer,
		CorrectOpenAnswerType,
		fetchCorrectOpenAnswer,
		fetchCourse
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';
	import autosize from '../../../node_modules/autosize';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	import { routes } from '$lib/routes';

	export let openQuestion: OpenQuestionType;
	export let correctOpenAnswer: CorrectOpenAnswerType;
	export let myOpenAnswerDraft: OpenAnswerDraftType;
	export let myOpenAnswer: OpenAnswerType;
	export let openAnswersOfOthers: OpenAnswerType[] = [];
	export let courseDescription: string;

	let openAnswerDraftText = '';
	let toast;
</script>

<main class="container">
	{#if openQuestion}
		<Back text="Back to {courseDescription}" route="/course/{openQuestion.course}" />

		{#if openQuestion.owner == $user.id}
			<h1 class="yours pl-4">{openQuestion.questionText}</h1>
			{#if correctOpenAnswer}
				<div class="mb-4"><i>Correct answer: </i>{correctOpenAnswer.answerText}</div>
			{/if}
			<div class="mb-4">
				{#if openAnswersOfOthers.length == 0}
					<i>No one has answered your question yet.</i>
				{:else}
					<i>People answered:</i>
				{/if}
			</div>
		{:else}
			<h1>{openQuestion.questionText}</h1>

			{#if myOpenAnswer}
				<a href={routes.openAnswer(myOpenAnswer.id)} class="light-link" sveltekit:prefetch>
					<article class="yours hoverable">
						<i>Your answer: </i>{myOpenAnswer.answerText}
					</article>
				</a>
			{:else if myOpenAnswerDraft}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">{myOpenAnswerDraft.answerText}</div>
					<button
						on:click={async () => {
							await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
							myOpenAnswerDraft = null;
						}}
						class="w-48 h-12 secondary outline">Delete</button
					>
				</div>
				<div>
					<button
						on:click={async () => {
							myOpenAnswer = await saveOpenAnswer(
								myOpenAnswerDraft.answerText,
								myOpenAnswerDraft.openQuestion
							);

							await deleteOpenAnswerDraft(myOpenAnswerDraft.id);
							myOpenAnswerDraft = null;
							toast.showSuccessToast('Open Answer created!');
						}}
						class="w-32 mt-4">Publish</button
					>
				</div>
			{:else}
				<div class="flex justify-between space-x-2 mt-2">
					<div class="w-full">
						<textarea
							id="textarea-answer"
							bind:value={openAnswerDraftText}
							class="w-full h-12"
							placeholder="Answer this question"
							on:load={autosize(document.getElementById('textarea-answer'))}
						/>
					</div>
					<button
						on:click={async () => {
							myOpenAnswerDraft = await saveOpenAnswerDraft(openAnswerDraftText, openQuestion.id);
						}}
						class="w-48 h-12">Save</button
					>
				</div>
			{/if}
		{/if}

		<!-- This shows the old and the new versions of the answers! -->
		{#each openAnswersOfOthers as openAnswerOfOther}
			<a href={routes.openAnswer(openAnswerOfOther.id)} class="light-link" sveltekit:prefetch>
				<article class="hoverable">
					{openAnswerOfOther.answerText}
				</article>
			</a>
		{/each}
	{/if}
</main>

<Toast bind:this={toast} />

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.hoverable:hover {
		background: var(--card-sectionning-background-color);
	}
</style>
