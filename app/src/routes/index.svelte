<script lang="ts">
	import { store } from '$lib/stores/auth';
	import StartPage from '$lib/components/StartPage.svelte';
	import ChallengePools from '$lib/components/ChallengePools.svelte';
	import { user } from '$lib/stores/user';
	import { goto } from '$app/navigation';
</script>

{#if $store != null}
	{#if $user && $user.groupID}
		<main class="container py-4 max-w-screen-sm"><ChallengePools /></main>
	{:else}
		<h1>Start here!</h1>
		<div class="mb-8">
			In most cases, you want to join a already existing group. In case you are a professor, you can create a
			new group and invite your students.
		</div>
		<button
			on:click={() => {
				goto('/joingroup');
			}}>Join Group</button
		>
		<button
			on:click={() => {
				goto('/creategroup');
			}}
			class="outline">Create Group</button
		>
	{/if}
{:else}
	<StartPage />
{/if}

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
