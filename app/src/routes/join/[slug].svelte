<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { joinChallengePool } from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';

	let inviteCode: string;
	let description = 'Join a Challenge Pool with an invite link';
	let itWorked = false;

	onMount(async () => {
		if (!$user) {
			goto('/');
		}
		// TODO: forward to this page after login would be nice to have
		inviteCode = $page.params.slug;
		join();
	});

	async function join() {
		if (inviteCode) {
			itWorked = await joinChallengePool(inviteCode);
			description = itWorked ? 'That worked. You joined the Challenge Pool.' : 'Failed to join.';
		}
	}
</script>

<h1>{description}</h1>
{#if itWorked}
	<button
		class="w-48"
		on:click={() => {
			goto('/');
		}}>Go there</button
	>
{/if}
<!-- If it worked, forwarding (e.g. via button or automatically) to that challenge pool would be cool. -->
