<script lang="ts">
	import { fetchTopics, TopicType } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	export let challengePoolId: string;

	type SelectableTopicType = { id: string; name: string; selected: boolean };
	let selectableTopics: SelectableTopicType[] = [];

	onMount(async () => {
		let topics = await fetchTopics(challengePoolId);
		topics.forEach((topic) => {
			selectableTopics.push({
				id: topic.id,
				name: topic.name,
				selected: false
			});
		});
		selectableTopics = selectableTopics;
	});

	async function selectTopic(id: string, selected = true) {
		selectableTopics.forEach((selectedTopic) => {
			if (selectedTopic.id == id) {
				selectedTopic.selected = selected;
			}
		});
		selectableTopics = selectableTopics;
	}

	export function getSelectedTopics(): string[] {
		let selectedTopics = [];
		selectableTopics.forEach((selectableTopic) => {
			if (selectableTopic.selected) {
				selectedTopics.push(selectableTopic.id);
			}
		});
		return selectedTopics;
	}
</script>

{#if selectableTopics && selectableTopics.length > 0}
	<div class="mb-4">
		Topics: &nbsp;
		{#each selectableTopics as selectableTopic}
			{#if selectableTopic.selected}
				<span
					class="inline-block border rounded p-2 mr-2 mb-2 selected"
					on:click={() => {
						selectTopic(selectableTopic.id, false);
					}}>{selectableTopic.name}</span
				>
			{:else}
				<span
					class="inline-block border rounded p-2 mr-2 mb-2 selectable"
					on:click={() => {
						selectTopic(selectableTopic.id);
					}}>{selectableTopic.name}</span
				>
			{/if}
		{/each}
	</div>
{/if}

<style>
	.selectable:hover {
		@apply border-dashed;
		border-color: var(--primary);
		color: var(--primary);
	}

	.selected {
		border-color: var(--primary);
		color: var(--primary);
	}
</style>
