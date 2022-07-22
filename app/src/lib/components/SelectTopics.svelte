<script lang="ts">
	import type { TopicType } from '$lib/supabaseQueries';
	import { createEventDispatcher } from 'svelte';
	import SelectableTopic from './SelectableTopic.svelte';
	const dispatch = createEventDispatcher();

	export let topics: TopicType[];

	type SelectableTopicType = { id: string; name: string; selected: boolean };
	export let selectableTopics: SelectableTopicType[] = topics.map((topic) => {
		return { id: topic.id, name: topic.name, selected: false };
	});

	async function selectTopic(id: string, selected = true) {
		selectableTopics.forEach((selectableTopic) => {
			if (selectableTopic.id == id) {
				selectableTopic.selected = selected;
			}
		});
		selectableTopics = selectableTopics;

		let selectedTopics: string[] = [];
		selectableTopics.forEach((selectableTopic) => {
			if (selectableTopic.selected) {
				selectedTopics.push(selectableTopic.id);
			}
		});

		dispatch('selectedTopicsChanged', { selectedTopics });
	}
</script>

{#if selectableTopics && selectableTopics.length > 0}
	<div class="mb-4">
		Belongs to: &nbsp;
		{#each selectableTopics as selectableTopic}
			<SelectableTopic
				topic={selectableTopic}
				on:topicSelected={(e) => selectTopic(selectableTopic.id, e.detail)}
			/>
		{/each}
	</div>
{/if}