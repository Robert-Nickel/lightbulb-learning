<script>
	import Faq from '$lib/components/FAQ.svelte';
	import { routes } from '$lib/routes';
</script>

<h1>Even the bravest and strongest...</h1>

<div>
	...sometimes need someone to talk to. If you have feedback, questions, problems, wishes, ideas, job
	offerings, an opinion, found a bug or want to delete your data, invest your ressources or talk to someone
	because it's been a while, please contact me - I am super nice. <br /><br />
	<p>Discord: <kbd>Robert Nickel#6909</kbd></p>
	<p>E-Mail: <kbd>lightbulb@robertnickel.online</kbd></p>
</div>

<div>
	<h3>FAQ</h3>
	<Faq />

	<h5>What was the invite code to that example course again?</h5>
	<p>
		It's <a href={routes.joinCourse('GNRLWISDOM')}>GNRLWISDOM</a>. Feel free to interact and get a feeling for
		Lightbulb Learning.
	</p>
</div>
