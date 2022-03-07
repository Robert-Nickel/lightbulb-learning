<script lang="ts">
	import { saveInviteCode } from '$lib/supabaseClient';
	export let challengePoolId;
	let inviteCode: string;
</script>

<button
	on:click={async () => {
		const randomTenCharString = Math.random().toString(16).substring(2, 12);
		inviteCode = (await saveInviteCode(challengePoolId, randomTenCharString)).code;
		navigator.clipboard.writeText(inviteCode);
	}}
	class="secondary outline w-auto my-4"
	>Generate Invite Code
	{#if inviteCode}
		<div class="mb-4">
			Invite Code: <a
				on:click={() => {
					navigator.clipboard.writeText(inviteCode);
				}}
				data-tooltip="Copy to Clipboard">{inviteCode}</a
			>
		</div>
	{/if}
</button>
