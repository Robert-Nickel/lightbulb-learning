<script lang="ts">
	import { goto } from '$app/navigation';

	export let text = 'Back';
	export let route = '/';
</script>

<div class="back mt-8 text-sm" on:click={() => goto(route)}>
	{text}
</div>

<style>
	.back {
		color: var(--primary);
	}

	.back:hover {
		color: var(--primary-hover);
	}
</style>
