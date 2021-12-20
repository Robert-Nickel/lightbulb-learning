<script lang="ts">
	import NewsletterSignUp from '$lib/components/NewsletterSignUp.svelte';
	import WhatWeDo from '$lib/components/WhatWeDo.svelte';
</script>

<div
	class="bg-center bg-contain bg-no-repeat bg-black"
	style="background-image: url('/images/lightbulb.jpeg');"
>
	<p class="text-7xl max-w-screen-sm mx-auto px-8 leading-snug pt-32 pb-8 text-white font-bold">
		Learning for the long run.
	</p>
</div>

<main class="container mx-auto py-4 px-2 max-w-screen-sm">
	<WhatWeDo />
</main>
<NewsletterSignUp />
