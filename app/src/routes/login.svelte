<script lang="ts">
	import { user } from '$lib/stores/user';

	let loading = false;
	let email;

	const handleLogin = async () => {
		loading = true;
		const { error } = await user.signIn(email);
		if (error) {
			alert(error.message);
		} else {
			alert('Check your email for the login link!');
		}
		loading = false;
	};
</script>

<main class="container flex justify-center">
	<article>
		<header>
			<h3 class="text-3xl mb-0">Welcome</h3>
		</header>
		<form on:submit|preventDefault={handleLogin}>
			<div>
				<p>What's your email address?</p>
				<div>
					<input type="email" placeholder="learn@everyday.org" bind:value={email} />
					<input type="submit" value={'Login | Register'} disabled={loading || !email} />
				</div>
			</div>
		</form>
		<hr class="mb-4 border-t-1" />
		<button
			class="outline"
			on:click={async () => {
				loading = true;
				const { error } = await user.signInGitHub();
				if (error) {
					alert(error.message);
				}
				loading = false;
			}}>Sign in via GitHub</button
		>
	</article>
</main>
