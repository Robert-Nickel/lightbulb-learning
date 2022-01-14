<script lang="ts">
	import { user } from '$lib/stores/user';

	let loading = false;
	let email;
	let showCheckMail = false;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await user.signIn(email);
			if (error) throw error;
		} catch (error) {
			console.log(error.error_description || error.message);
		} finally {
			loading = false;
			showCheckMail = true;
		}
	};
</script>

<div class="flex justify-center">
	<article>
		<header>
			<h3 class="text-3xl mb-0">Login</h3>
		</header>
		<form on:submit|preventDefault={handleLogin}>
			<div>
				<p class="description">Login via magic link</p>
				<div>
					<input type="email" placeholder="learn@everyday.org" bind:value={email} />
					<input type="submit" value={'Send magic link'} disabled={loading} />
				</div>
				{#if showCheckMail}<b>Check your email for the login link!</b>{/if}
			</div>
		</form>
	</article>
</div>
