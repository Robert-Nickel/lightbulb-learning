<script lang="ts">
	import { supabaseClient } from '$lib/db';
	import { page } from '$app/stores';

	let newPassword: string;
	$: accessToken = $page.url.pathname.split('?')[1].split('=')[1];
</script>

<h1>Reset Password</h1>

<input bind:value={newPassword} placeholder="Choose a new password" type="password" />
<button
	class="primary w-64"
	on:click={async () => {
		console.log({ accessToken });
		const { error } = await supabaseClient.auth.api.updateUser(accessToken, { password: newPassword });
		if (error) {
			alert(error);
		}
	}}>Reset Password</button
>
