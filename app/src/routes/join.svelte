<script lang="ts">
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	import { joinChallengePool } from '$lib/supabaseClient';

	let inviteCode: string;
</script>

<h1>Join Challenge Pool</h1>
<div class="flex justify-between space-x-2">
	<div class="w-full">
		<input bind:value={inviteCode} type="text" placeholder="Invite Code to join existing Challenge Pool" />
	</div>
	<div>
		<button
			on:click={async () => {
				if (inviteCode) {
					const challengePoolId = await joinChallengePool(inviteCode);
					if (challengePoolId != 'false') {
						goto(routes.challengePool(challengePoolId));
					}
				}
			}}
			class="w-32">Join</button
		>
	</div>
</div>
