<script lang="ts" context="module">
	export const load = async ({ params }) => {
		const accessToken = params.slug;
		return { props: { accessToken } };
	};
</script>

<script lang="ts">
	import { goto } from '$app/navigation';

	import { supabaseClient } from '$lib/db';
	import { routes } from '$lib/routes';

	let newPassword: string;
	export let accessToken: string;
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
		} else {
			goto(routes.courses);
		}
	}}>Reset Password</button
>
