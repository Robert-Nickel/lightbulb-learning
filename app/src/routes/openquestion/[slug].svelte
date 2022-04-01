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
		fetchOpenAnswersOfOthers,
		fetchOpenQuestion,
		OpenAnswerType,
		OpenQuestionType,
		saveOpenAnswer,
		fetchLatestOpenAnswer,
		fetchCourse
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';
	import autosize from '../../../node_modules/autosize';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';
	import { routes } from '$lib/routes';

	export let openQuestion: OpenQuestionType;
	export let myOpenAnswer: OpenAnswerType;
	export let openAnswersOfOthers: OpenAnswerType[] = [];
	export let courseDescription: string;

	let openAnswerText;
	let toast;
</script>

<main class="container">
	{#if openQuestion}
		<Back text="Back to {courseDescription}" route="/course/{openQuestion.course}" />

		<h1 class={openQuestion.owner == $user.id ? 'yours pl-4' : ''}>{openQuestion.questionText}</h1>

		{#if myOpenAnswer}
			<a href={routes.openAnswer(myOpenAnswer.id)} class="light-link" sveltekit:prefetch>
				<article class="yours hoverable">
					<i>Your answer: </i>{myOpenAnswer.answerText}
				</article>
			</a>
		{:else}
			<textarea
				id="textarea-answer"
				bind:value={openAnswerText}
				class="w-full h-12"
				placeholder="Answer this question"
				on:load={autosize(document.getElementById('textarea-answer'))}
			/>

			<button
				on:click={async () => {
					myOpenAnswer = await saveOpenAnswer(openAnswerText, openQuestion.id);
					toast.showSuccessToast('Open Answer created!');
				}}
				class="w-32 mt-4">Publish</button
			>
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
