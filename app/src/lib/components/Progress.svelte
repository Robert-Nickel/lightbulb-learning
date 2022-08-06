<script lang="ts">
	import { saveProgress } from '$lib/supabaseQueries';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();
	export let courseUserId: string;
	export let latestProgress: number = 0;
	$: progressInput = latestProgress.toString();
	let changing = false;

	async function save(courseUserId: string, percentage: number) {
		const savedProgress = await saveProgress(courseUserId, percentage);
		latestProgress = savedProgress.percentage;
		dispatch('progressAdded', savedProgress);
	}
</script>

{#if changing}
	<div class="flex">
		<input
			id="progress-input"
			style="max-width: 3.5em; font-size: 1.2rem; font-weight: bold;"
			class="mr-1"
			bind:value={progressInput}
		/>
		<p class="mr-4 ml-0" style="font-size: 1.2rem;font-weight: bold; margin-top: 0.6em;">%</p>
		<button
			class="w-24"
			on:click={() => {
				const progressInputAsNumber = +progressInput;
				if (progressInputAsNumber >= 0 && progressInputAsNumber <= 200) {
					save(courseUserId, progressInputAsNumber);
					changing = false;
				} else {
					alert(progressInputAsNumber + " isn't a number between 0 and 200.");
				}
			}}>Save</button
		>
	</div>
{:else}
	<div class="flex">
		<p id="latest-progress" class="mr-4" style="font-size: 1.2rem;font-weight: bold; margin-top: 0.6em;">
			{latestProgress}%
		</p>
		<button
			class="w-24 h-12 outline"
			on:click={() => {
				changing = true;
			}}>Change</button
		>
	</div>{/if}
