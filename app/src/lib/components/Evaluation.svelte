<script lang="ts">
	let latestEvaluation: number = 0;
	let evaluationInput: string = '0';
	let changing = true;
</script>

{#if changing}
	<div class="flex">
		<input
			style="max-width: 3.5em; font-size: 1.2rem; font-weight: bold;"
			class="mr-1"
			bind:value={evaluationInput}
		/>
		<p class="mr-4 ml-0" style="font-size: 1.2rem;font-weight: bold; margin-top: 0.6em;">%</p>
		<button
			class="w-24"
			on:click={() => {
				let evaluationInputAsNumber = Number(evaluationInput);
				if (!evaluationInputAsNumber) {
					alert('Please enter a number.');
				}
				if (evaluationInputAsNumber >= 0 && evaluationInputAsNumber <= 120) {
					latestEvaluation = evaluationInputAsNumber;
					changing = false;
				} else {
                    alert(evaluationInputAsNumber +' isn\'t between 0 and 120.');
				}
			}}>Save</button
		>
	</div>
{:else}
	<div class="flex">
		<p class="mr-4" style="font-size: 1.2rem;font-weight: bold; margin-top: 0.6em;">{latestEvaluation}%</p>
		<button
			class="w-24 h-12 outline"
			on:click={() => {
				changing = true;
			}}>Change</button
		>
	</div>{/if}
