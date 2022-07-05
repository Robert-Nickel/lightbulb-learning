<script>
	export let name;
	export let label;
	export let placeholder = '';
	export let value;
	export let type = 'text';
</script>

<label for={name}>
	{label}

	<div class="input">
		{#if type == 'text'}
			<input type="text" {name} {placeholder} bind:value />
		{:else if type == 'email'}
			<input type="email" {name} {placeholder} bind:value />
		{:else if type == 'password'}
			<input type="password" {name} {placeholder} autocomplete="on" bind:value />
		{/if}
	</div>
</label>

<style>
	
</style>
