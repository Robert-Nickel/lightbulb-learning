<script lang="ts" context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session, params }) =>
		withPageAuth({ redirectTo: '/', user: session.user }, async () => {
			const questionId = params.slug;
			const question = await fetchQuestion(questionId, session);
			const courseDescription = await (await fetchCourse(question.course, session)).description;

			const answersOfOthersDB = await fetchAnswersOfOthers(questionId, session);
			const answersOfOthersIds = answersOfOthersDB?.map((answer) => answer.id);
			const myAnswerLikes = await fetchMyAnswerLikes(answersOfOthersIds, session);

			const myAnswerWithoutLikes = await fetchMyAnswer(questionId, session);
			const questionTopics: QuestionTopicType[] = await fetchTopicsForQuestion(question.id, session);
			const topics: TopicType[] = await fetchTopics(
				questionTopics.map((questionTopic) => questionTopic.topic),
				session
			);

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
					courseDescription,
					topics
				}
			};
		});
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import {
		fetchAnswersOfOthers,
		fetchQuestion,
		AnswerType,
		QuestionType,
		saveAnswer,
		fetchMyAnswer,
		fetchCourse,
		fetchAnswerLikes,
		fetchMyAnswerLikes,
		deleteAnswerLike,
		saveAnswerLike,
		updateQuestion,
		TopicType,
		fetchTopicsForQuestion,
		QuestionTopicType,
		fetchTopics
	} from '$lib/supabaseQueries';
	import autosize from '../../../node_modules/autosize';
	import { routes } from '$lib/routes';
	import Answer from '$lib/components/Answer.svelte';
	import { session } from '$app/stores';
	import SelectableTopic from '$lib/components/SelectableTopic.svelte';

	export let question: QuestionType;
	export let myAnswer: AnswerType;
	export let answersOfOthers;
	export let courseDescription: string;
	export let topics: TopicType[];

	let answerText;
	let editing = false;

	function save() {
		updateQuestion(question);
		editing = false;
	}
</script>

<main class="container">
	{#if question}
		<Back text="Back to {courseDescription}" route="/course/{question.course}" />

		{#if question.owner == $session.user.id}
			{#if editing}
				<textarea
					id="textarea-edit-question"
					bind:value={question.questionText}
					class="w-full h-12"
					placeholder="Edit your question"
					on:load={autosize(document.getElementById('textarea-edit-question'))}
				/>
				<button class="outline w-32" on:click={save}>Save</button>
			{:else}
				<h1 class="yours pl-4">{question.questionText}</h1>
				{#each topics as topic} <SelectableTopic {topic} selectable={false} />{/each}

				{#if answersOfOthers.length == 0}<button class="outline w-32" on:click={() => (editing = true)}
						>Edit</button
					>{/if}
			{/if}
		{:else}
			<h1>{question.questionText}</h1>
			{#each topics as topic} <SelectableTopic {topic} selectable={false} />{/each}
		{/if}

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
				hidden={!answerText}>Publish</button
			>
		{/if}

		{#if answersOfOthers}
			{#each answersOfOthers as answerOfOther}
				<a href={routes.answer(answerOfOther.id)} class="light-link" sveltekit:prefetch>
					<article class="hoverable flex justify-between">
						<Answer answer={answerOfOther} />
						{#if answerOfOther.isLiked}
							<button
								class="outline h-12 ml-4 mb-0 p-2 w-16"
								on:click|preventDefault={async () => {
									await deleteAnswerLike(answerOfOther.id, $session.user.id);
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
									await saveAnswerLike(answerOfOther.id, $session.user.id);
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
