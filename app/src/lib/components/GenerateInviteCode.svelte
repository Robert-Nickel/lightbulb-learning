<script lang="ts">
	import { saveInviteCode } from '$lib/supabaseQueries';
	import { session } from '$app/stores';
	export let courseId;
	let inviteCode: string;
</script>

<button
	on:click={async () => {
		const randomTenCharString = Math.random().toString(16).substring(2, 12);
		inviteCode = (await saveInviteCode(courseId, randomTenCharString, $session.user.id)).code;
		navigator.clipboard.writeText(inviteCode);
	}}
	class="secondary outline w-auto my-4"
	>Generate Invite Code
</button>
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
