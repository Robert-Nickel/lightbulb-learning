<script lang="ts">
	export let openQuestion;
</script>

{#if openQuestion}
	<div class="w-full">
		<p id="open-question-text" class="light-link">{openQuestion.questionText}</p>
		<hr class="my-2 border-t-1" />
		<small id="amount-of-answers-small"
			>{openQuestion.amountOfAnswers} Answer{#if openQuestion.amountOfAnswers != 1}s{/if}</small
		>
		-
		<small id="amount-of-likes-small"
			>{openQuestion.totalLikes} Like{#if openQuestion.totalLikes != 1}s{/if}</small
		>
	</div>
{/if}
