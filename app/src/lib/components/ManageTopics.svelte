<script context="module">
	import { withPageAuth } from '@supabase/auth-helpers-sveltekit';
	// TODO: get this from the path: export let courseId: string;
	const courseId = 'abc';
	export const load = async ({ session }) =>
		withPageAuth(
			{
				redirectTo: '/',
				user: session.user
			},
			async () => {
				const topics = await fetchTopics(courseId, session);
				return { props: { topics } };
			}
		);
</script>

<script lang="ts">
	import { fetchTopics, saveTopic, TopicType } from '$lib/supabaseQueries';

	export let topics: TopicType[];
	let newTopicName = '';

	async function createTopic() {
		for (let topic of topics) {
			if (topic.name == newTopicName) {
				alert('Topic already exists.');
				return;
			}
		}
		let savedTopic = await saveTopic(courseId, newTopicName);
		topics.push(savedTopic);
		topics = topics;
		newTopicName = '';
	}
</script>

<article>
	<h3>Topics</h3>

	<div class="mb-4">
		{#if topics}
			{#each topics as topic}
				<span class="inline-block border rounded p-2 mr-2 mb-2">{topic.name}</span>
			{/each}
		{/if}
	</div>
	<input placeholder="New Topic" bind:value={newTopicName} />
	<button class="w-32" hidden={newTopicName == ''} on:click={createTopic}>Create</button>
</article>
