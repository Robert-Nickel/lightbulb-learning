<script lang="ts">
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let newPassword: string;
	let accessToken: string;

	onMount(() => {
		const pathSegments = $page.url.pathname.split('/');
		accessToken = pathSegments[pathSegments.length - 1];
	});
</script>

<h1>Reset Password</h1>

<input bind:value={newPassword} placeholder="Choose a new password" type="password" />
<button
	class="primary w-64"
	on:click={async () => {
		await supabaseClient.auth.api.updateUser(accessToken, { password: newPassword });
	}}>Reset Password</button
>
