<script lang="ts">
	export let text = 'Back';
	export let route = '/';
</script>

<a class="back mt-8 text-sm block" href={route}>
	{text}
</a>

<style>
	.back {
		color: var(--primary);
	}

	.back:hover {
		color: var(--primary-hover);
	}
</style>
