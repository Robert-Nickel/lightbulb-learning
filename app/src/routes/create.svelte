<script lang="ts">
	import { goto } from '$app/navigation';
	import { saveChallengePool } from '$lib/supabaseClient';

	let createChallengePoolDescription = '';
</script>

<h1>Create Challenge Pool</h1>
<div class="space-y-4">
	<div class="flex justify-between space-x-2">
		<div class="w-full">
			<input
				bind:value={createChallengePoolDescription}
				class="w-full"
				placeholder="Create new Challenge Pool"
			/>
		</div>
		<div>
			<button
				on:click={async () => {
					const challengePool = await saveChallengePool(createChallengePoolDescription);
					createChallengePoolDescription = '';
					goto('/challengepool/' + challengePool.id);
				}}
				class="w-32">Create</button
			>
		</div>
	</div>
</div>
