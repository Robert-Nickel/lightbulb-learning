<script lang="ts">
	import type { TopicType } from '$lib/supabaseQueries';
	import { onMount } from 'svelte';
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let topics: TopicType[];

	type FilterableTopicType = { id: string; name: string; filtered: boolean };
	export let filterableTopics: FilterableTopicType[] = [];

	onMount(async () => {
		topics.forEach((topic) => {
			filterableTopics.push({
				id: topic.id,
				name: topic.name,
				filtered: false
			});
		});
		filterableTopics = filterableTopics;
	});

	async function filterTopic(id: string, filtered = true) {
		filterableTopics.forEach((filterableTopic) => {
			if (filterableTopic.id == id) {
				filterableTopic.filtered = filtered;
			}
		});
		filterableTopics = filterableTopics;

		let filteredTopics: string[] = [];
		filterableTopics.forEach((filterableTopic) => {
			if (filterableTopic.filtered) {
				filteredTopics.push(filterableTopic.id);
			}
		});

		dispatch('filterTopicsChanged', { filteredTopics });
	}
</script>

{#if topics && topics.length > 0}
	{#each filterableTopics as filterableTopic}
		{#if filterableTopic.filtered}
			<span
				class="inline-block border rounded p-2 mr-2 mb-2 filtered"
				on:click={() => {
					filterTopic(filterableTopic.id, false);
				}}>{filterableTopic.name}</span
			>
		{:else}
			<span
				class="inline-block border rounded p-2 mr-2 mb-2 filterable"
				on:click={() => {
					filterTopic(filterableTopic.id);
				}}>{filterableTopic.name}</span
			>
		{/if}
	{/each}
{/if}

<style>
	.filterable:hover {
		border-color: var(--primary);
		color: var(--primary);
	}

	.filtered {
		border-color: var(--primary);
		color: var(--primary);
	}
</style>
