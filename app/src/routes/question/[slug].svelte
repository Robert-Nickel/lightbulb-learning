<script lang="ts" context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session, params }) =>
		withPageAuth({ redirectTo: '/', user: session.user }, async () => {
			const questionId = params.slug;
			const question = await fetchQuestion(questionId, session);
			const courseDescription = await (await fetchCourse(question.course, session)).description;

			const answersOfOthersWithNonLatest = await fetchAnswersOfOthers(questionId, session);
			const answersOfOthersDB = await filterNonLatest(answersOfOthersWithNonLatest);
			const answersOfOthersIds = answersOfOthersDB?.map((answer) => answer.id);
			const myAnswerLikes = await fetchMyAnswerLikes(answersOfOthersIds, session);

			const myAnswerWithoutLikes = await fetchLatestAnswer(questionId, session);

			const allAnswerIds = myAnswerWithoutLikes
				? answersOfOthersIds.concat(myAnswerWithoutLikes.id)
				: answersOfOthersIds;
			const answerLikes = await fetchAnswerLikes(allAnswerIds, session);

			const myAnswer = myAnswerWithoutLikes
				? {
						...myAnswerWithoutLikes,
						...{ totalLikes: countLikes(myAnswerWithoutLikes.id) }
				  }
				: null;

			type Answer = AnswerType & { isLiked: boolean; totalLikes: number };

			const answersOfOthers: Answer[] = answersOfOthersDB?.map((answer) => {
				const totalLikes = countLikes(answer.id);
				return {
					...answer,
					...{
						isLiked: isLiked(answer.id),
						totalLikes
					}
				};
			});

			function isLiked(answerId: string): boolean {
				if (myAnswerLikes) {
					for (let myAnswerLike of myAnswerLikes) {
						if (answerId == myAnswerLike.answer) {
							return true;
						}
					}
				}
				return false;
			}

			function countLikes(answerId: string): number {
				return answerLikes?.filter((answerLike) => {
					return answerLike.answer == answerId;
				})?.length;
			}

			return {
				props: {
					question,
					myAnswer,
					answersOfOthers,
					courseDescription
				}
			};
		});

	async function filterNonLatest(answersOfOthers) {
		// O(n^2) <- thats though, isn't there a better way?
		// It filters out the non-latest answers
		let answers = answersOfOthers;
		let indizesToRemove: number[] = [];
		for (let i = 0; i < answers?.length; i++) {
			let answer = answers[i];
			for (let otherAnswer of answers) {
				if (answer.owner == otherAnswer.owner) {
					if (answer.version < otherAnswer.version) {
						indizesToRemove.push(i);
						break;
					}
				}
			}
		}
		indizesToRemove
			.sort((a, b) => 0 - (a > b ? 1 : -1)) // sort descending
			.forEach((index) => {
				answers.splice(index, 1);
			});
		return answers;
	}
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import {
		fetchAnswersOfOthers,
		fetchQuestion,
		AnswerType,
		QuestionType,
		saveAnswer,
		fetchLatestAnswer,
		fetchCourse,
		fetchAnswerLikes,
		fetchMyAnswerLikes,
		deleteAnswerLike,
		saveAnswerLike
	} from '$lib/supabaseQueries';
	import autosize from '../../../node_modules/autosize';
	import { routes } from '$lib/routes';
	import Answer from '$lib/components/Answer.svelte';
	import { session } from '$app/stores';

	export let question: QuestionType;
	export let myAnswer: AnswerType;
	export let answersOfOthers;
	export let courseDescription: string;

	let answerText;
</script>

<main class="container">
	{#if question}
		<Back text="Back to {courseDescription}" route="/course/{question.course}" />

		<h1 class={question.owner == $session.user.id ? 'yours pl-4' : ''}>{question.questionText}</h1>

		{#if myAnswer}
			<a href={routes.answer(myAnswer.id)} class="light-link" sveltekit:prefetch>
				<article class="yours hoverable">
					<Answer answer={myAnswer} />
				</article>
			</a>
		{:else}
			<textarea
				id="textarea-answer"
				bind:value={answerText}
				class="w-full h-12"
				placeholder="Answer this question"
				on:load={autosize(document.getElementById('textarea-answer'))}
			/>

			<button
				on:click={async () => {
					const myAnswerWithoutLikes = await saveAnswer(answerText, question.id, $session.user.id);
					myAnswer = {
						...myAnswerWithoutLikes,
						...{ totalLikes: 0 }
					};
				}}
				class="w-32"
				disabled={!answerText}>Publish</button
			>
		{/if}

		<!-- This shows the old and the new versions of the answers! -->
		{#if answersOfOthers}
			{#each answersOfOthers as answerOfOther}
				<a href={routes.answer(answerOfOther.id)} class="light-link" sveltekit:prefetch>
					<article class="hoverable flex justify-between">
						<Answer answer={answerOfOther} />
						{#if answerOfOther.isLiked}
							<button
								class="outline h-12 ml-4 mb-0 p-2 w-16"
								on:click|preventDefault={async () => {
									await deleteAnswerLike(answerOfOther.id);
									answersOfOthers?.map((oa) => {
										if (oa.id == answerOfOther.id) {
											oa.isLiked = false;
											oa.totalLikes--;
										}
										return oa;
									});
									answersOfOthers = answersOfOthers;
								}}>Unlike</button
							>{:else}<button
								class="outline h-12 ml-4 mb-0 p-2 w-16"
								on:click|preventDefault={async () => {
									await saveAnswerLike(answerOfOther.id);
									answersOfOthers?.map((oa) => {
										if (oa.id == answerOfOther.id) {
											oa.isLiked = true;
											oa.totalLikes++;
										}
										return oa;
									});
									answersOfOthers = answersOfOthers;
								}}>Like!</button
							>
						{/if}
					</article>
				</a>
			{/each}
		{/if}
	{/if}
</main>

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}

	.hoverable:hover {
		background: var(--card-sectionning-background-color);
	}
</style>
