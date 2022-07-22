<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let topic;
	export let selectable = true;
</script>

{#if selectable}
	<span
		class={topic.selected ? 'topic selected' : 'topic selectable'}
		on:click={() => {
			topic.selected = !topic.selected;
			dispatch('topicSelected', topic.selected);
		}}>{topic.name}</span
	>
{:else}
	<span class={topic.selected ? 'topic selected' : 'topic'}>{topic.name}</span>
{/if}

<style>
	.topic {
		@apply inline-block border rounded p-2 mr-2 mb-2;
	}

	.selectable:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.selected {
		border-color: var(--primary);
		color: var(--primary);
	}
</style>
