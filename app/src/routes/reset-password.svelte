<script lang="ts">
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	let newPassword: string;
	let accessToken: string;

	onMount(() => {
		const pathname = $page.url.pathname.split('?');
		accessToken = pathname[pathname.length - 1].split('=')[1];
		console.log({ accessToken });
	});
</script>

<h1>Reset Password</h1>

<input bind:value={newPassword} placeholder="Choose a new password" type="password" />
<button
	class="primary w-64"
	on:click={async () => {
		const { error } = await supabaseClient.auth.api.updateUser(accessToken, { password: newPassword });
		if (error) {
			alert(error);
		}
	}}>Reset Password</button
>
