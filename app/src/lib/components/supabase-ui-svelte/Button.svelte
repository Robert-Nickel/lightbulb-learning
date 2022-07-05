<script>

	let block = true;
	export let primary = false;
	export let loading = false;
</script>

<button class:block class={!primary ? 'outline' : ''} on:click disabled={loading}>
	<span><slot /></span>
</button>

<style>
	button {
		display: flex;
		justify-content: center;
	}
</style>
