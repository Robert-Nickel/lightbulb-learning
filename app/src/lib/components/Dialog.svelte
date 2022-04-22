<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	export let open = false;
	export let question = 'Question';
	export let secondary = 'No';
	export let primary = 'Yes, sure';
</script>

<div
	hidden={!open}
	class="backdrop-blur-sm h-screen w-screen absolute top-0 align-center"
	style="z-index: 30;"
>
	<dialog {open} class="backdrop-blur-sm">
		<p>{question}</p>
		<div class="flex">
			<button
				class="outline mr-4"
				on:click={() => {
					dispatch('secondaryClicked');
					open = false;
				}}>{secondary}</button
			>
			<button
				on:click={() => {
					dispatch('primaryClicked');
					open = false;
				}}>{primary}</button
			>
		</div>
	</dialog>
</div>

<style>
	dialog {
		width: 24em;
	}
</style>
