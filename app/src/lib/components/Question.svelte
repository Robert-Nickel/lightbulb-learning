<script lang="ts">
	export let question;
</script>

{#if question}
	<div class="w-full">
		<p id="question-text" class="light-link">{question.questionText}</p>
		<hr class="my-2 border-t-1" />
		<small id="amount-of-answers-small"
			>{question.amountOfAnswers} Answer{#if question.amountOfAnswers != 1}s{/if}</small
		>
		-
		<small id="amount-of-likes-small"
			>{question.totalLikes} Like{#if question.totalLikes != 1}s{/if}</small
		>
	</div>
{/if}
