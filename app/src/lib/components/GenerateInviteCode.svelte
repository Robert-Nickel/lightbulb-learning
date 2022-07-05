<script lang="ts">
	import { saveInviteCode } from '$lib/supabaseQueries';
	export let courseId;
	export let inviteCode: string;
	let inviteCodeTooltip = 'Copy to Clipboard';
</script>

{#if inviteCode}
	<div class="mb-4">
		<!-- svelte-ignore a11y-missing-attribute -->
		Invite Code:
		<a
			on:click={() => {
				navigator.clipboard.writeText(inviteCode);
				inviteCodeTooltip = '☑️ Copied';
			}}
			data-tooltip={inviteCodeTooltip}>{inviteCode}</a
		>
	</div>
{:else}
	<button
		on:click={async () => {
			const randomTenCharString = Math.random().toString(16).substring(2, 12);
			inviteCode = (await saveInviteCode(courseId, randomTenCharString)).code;
			navigator.clipboard.writeText(inviteCode);
		}}
		class="secondary outline w-auto my-4"
		>Generate Invite Code
	</button>
{/if}
