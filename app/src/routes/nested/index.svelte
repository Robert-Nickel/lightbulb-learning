<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';

	let test = 'not laoded yet';
	onMount(async () => {
		test = 'is now loaded';
	});
</script>

huhu {test}

<div>
	slug is: {$page.params.slug}
</div>
