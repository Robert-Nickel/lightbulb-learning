<script lang="ts">
	import NewsletterSignUp from '$lib/components/NewsletterSignUp.svelte';
	import { routes } from '$lib/routes';
	import { onMount } from 'svelte';

	const learningIs = [
		'asking a question.',
		'answering questions.',
		'constructive feedback.',
		'fixing mistakes.',
		'changing your opinion.'
	];

	let show = '';

	onMount(async () => {
		let index = 0;
		while (true) {
			index++;
			index = index % learningIs.length;
			for (let letter of learningIs[index]) {
				show = show + letter;
				await delay(50);
			}
			await delay(2_000);
			show = '';
			await delay(200);
		}
	});

	function delay(ms: number) {
		return new Promise((resolve) => setTimeout(resolve, ms));
	}
</script>

<div class="bg-center bg-contain bg-no-repeat" style="background-image: url('/images/lightbulb.jpeg');">
	<p class="text-5xl max-w-screen-sm mx-auto px-8 leading-snug pt-32 pb-8 text-white font-bold">
		A learning evaluation system that scales.
	</p>
</div>

<main class="container mx-auto py-4 px-2 leading-normal">
	<div class="mx-auto max-w-screen-sm">
		<p>
			Lightbulb Learning is a learning evaluation system that scales for groups with many participants.
			Students challenge each other by asking and discussing questions, while you get insight into their
			current level of understanding and their learning curve - which is gold for your evaluation of their
			performance.
		</p>

		<div class="flex max-w-sm mb-8 mt-16">
			<p class="text-xl align-middle mt-3">Learning&nbsp;is&nbsp;</p>
			<input bind:value={show} class="text-xl" />
		</div>

		<h2>How does it work?</h2>

		<p>
			Learning is more than answering questions. Formulating a question means framing a problem, and is a more
			effective way of learning than just answering one. Giving constructive feedback means to have not only
			expertise, but also empathy - and is one of the most underrated skills in modern (working) life. That's
			why we believe that contemplating every contribution to the discussion gives a clearer view on learning
			performance.
		</p>

		<p>
			Watch your students thinking about and discussing interesting questions, while getting realtime insight
			into all aspects of their performance.
		</p>

		<h2>Who is it for?</h2>
		<p>Lightbulb Learning is for you, if...</p>
		<ul>
			<li>
				...you are a teacher or professor and want to get a more rational insight into your students learning
				adventure.
			</li>
			<li>
				...are tired of marking exam papers for days and need a more scalable and justifiable approach of
				defining grades.
			</li>
			<li>
				...are an author of an online course and want to reward those that reach a certain level with a
				certificate.
			</li>
		</ul>

		<a href={routes.login} sveltekit:prefetch>
			<button class="m-auto my-16 w-64">Start, it's all free.</button>
		</a>
	</div>
</main>
<NewsletterSignUp />
