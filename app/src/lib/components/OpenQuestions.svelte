<script lang="ts">
	import { DataStore } from '@aws-amplify/datastore';
	import { ChallengePool, OpenQuestion } from '../models';
	import OpenAnswers from './OpenAnswers.svelte';

	export let challengePool: ChallengePool;

	let openQuestions: Array<OpenQuestion> = [];

	fetchOpenQuestions();

	export async function fetchOpenQuestions() {
		openQuestions = await DataStore.query(OpenQuestion, (q) => q.challengepoolID('eq', challengePool.id));
	}
</script>

{#if openQuestions.length > 0}
	<h3 class="mt-10">Open Questions</h3>
{/if}
{#each openQuestions as openQuestion}
	<article>
		<h4>{openQuestion.questionText}</h4>

		<OpenAnswers bind:openQuestion />
	</article>
{/each}
