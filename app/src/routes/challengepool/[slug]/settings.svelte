<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import Back from '$lib/components/Back.svelte';
	import {
		ChallengePoolType,
		fetchChallengePool,
		deleteChallengePool,
		saveInviteCode
	} from '$lib/supabaseClient';
	import { user } from '$lib/stores/user';
	import Members from '$lib/components/Members.svelte';
	import ManageTopics from '$lib/components/ManageTopics.svelte';
	import { routes } from '$lib/routes';

	let challengePoolId: string;
	let challengePool: ChallengePoolType;
	let inviteCode: string;

	onMount(() => {
		refresh();
	});

	async function refresh() {
		challengePoolId = $page.params.slug;
		challengePool = await fetchChallengePool(challengePoolId);
	}
</script>

<main class="container">
	{#if challengePool && $user.id == challengePool.owner}
		<h1>{challengePool.description}</h1>

		{#if $user.id == challengePool.owner}
			<header class="flex p-2 space-x-4 border-b-2 ">
				<nav
					on:click={() => {
						goto('/challengepool/' + challengePoolId);
					}}
				>
					Open Questions
				</nav>
				<nav class="activeNavElement">Settings</nav>
			</header>
		{/if}

		<Members {challengePoolId} />
		<ManageTopics {challengePoolId} />

		<button
			on:click={async () => {
				const randomTenCharString = Math.random().toString(16).substring(2, 12);
				inviteCode = (await saveInviteCode(challengePool.id, randomTenCharString)).code;
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

		<button
			on:click={async () => {
				if (
					confirm(
						'Everything within ' + challengePool.description + ' will be gone forever.\nAre you really sure?'
					)
				) {
					await deleteChallengePool(challengePool.id);
					goto(routes.root);
				}
			}}
			class="secondary outline w-auto mb-0 hover-red">Delete {challengePool.description}</button
		>
	{/if}

	<Back text="Back to all Challenge Pools" />
</main>

<style>
	header {
		border-color: var(--card-sectionning-background-color);
	}

	nav {
		color: var(--secondary);
	}

	nav:hover {
		color: var(--white);
		font-weight: 500;
		border-color: var(--primary);
	}

	.activeNavElement {
		color: var(--white);
		font-weight: 500;
		border-color: var(--primary);
	}
</style>
