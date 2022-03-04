<script lang="ts">
	import { fetchTopics, saveTopic, TopicType } from '$lib/supabaseClient';
	import { onMount } from 'svelte';

	export let challengePoolId: string;
	let topics: TopicType[] = [];
	let newTopicName = '';

	onMount(async () => {
		topics = await fetchTopics(challengePoolId);
	});

	async function createTopic() {
		topics.push(await saveTopic(challengePoolId, newTopicName));
        topics = topics;
		newTopicName = '';
	}
</script>

{#if topics && topics.length > 0}
	<article>
		<h3 class="">Topics</h3>

		<div class="mb-4">
			{#each topics as topic}
				<span class="inline-block border rounded p-2 mr-2 mb-2">{topic.name}</span>
			{/each}
		</div>
			<input placeholder="New Topic" bind:value={newTopicName} />
			<button class="outline w-32" hidden={newTopicName == ''} on:click={createTopic}>Create</button>
	</article>
{/if}

<style>
	.create-new:hover {
		border-color: var(--primary);
		color: var(--primary);
	}
</style>
