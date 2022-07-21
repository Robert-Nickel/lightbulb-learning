<script lang="ts" context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';

	export const load = async ({ session, params }) =>
		withPageAuth(
			{
				redirectTo: '/login',
				user: session.user
			},
			async () => {
				const answerId = params.slug;
				const answer = await fetchAnswer(answerId, session);
				const latestAnswer = await fetchLatestAnswer(answer.question, session);
				const question = await fetchQuestion(answer.question, session);

				return { props: { question, answer, latestAnswer } };
			}
		);
</script>

<script lang="ts">
	import Back from '$lib/components/Back.svelte';
	import {
		fetchAnswer,
		fetchQuestion,
		AnswerType,
		QuestionType,
		fetchLatestAnswer
	} from '$lib/supabaseQueries';
	import { session } from '$app/stores';

	export let question: QuestionType;
	export let answer: AnswerType;

</script>

<main class="container">
	{#if answer && question}
		<Back text="Back to Question" route="/question/{question?.id}" />

		{#if question.owner == $session.user?.id}
			<div class="mb-4 yours pl-4">Your Question: {question.questionText}</div>
		{:else}
			<div class="mb-4">Question: {question.questionText}</div>
		{/if}

		{#if answer.owner == $session.user.id}
			<h1 class="yours pl-4">Your Answer: {answer.answerText}</h1>
		{:else}
			<h1>{answer.answerText}</h1>
		{/if}
	{/if}
</main>

<style>
	.yours {
		border-left: 4px solid var(--primary);
	}
</style>
