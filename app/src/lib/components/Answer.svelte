<script lang="ts">
	export let answer;
</script>

{#if answer}
	<div class="w-full">
		<p id="answer-text" class="light-link">{answer.answerText}</p>
		<hr class="my-2 border-t-1" />
		<small id="amount-of-likes-small"
			>{answer.totalLikes} Like{#if answer.totalLikes != 1}s{/if}</small
		>
	</div>
{/if}
