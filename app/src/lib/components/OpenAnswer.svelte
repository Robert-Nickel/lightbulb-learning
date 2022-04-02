<script lang="ts">
	export let openAnswer;
</script>

{#if openAnswer}
	<div class="w-full">
		<p id="open-answer-text" class="light-link">{openAnswer.answerText}</p>
		<hr class="my-2 border-t-1" />
		<small id="amount-of-likes-small"
			>{openAnswer.totalLikes} Like{#if openAnswer.totalLikes != 1}s{/if}</small
		>
	</div>
{/if}
