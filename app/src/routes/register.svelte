<script lang="ts">
	import { goto } from '$app/navigation';
	import { user } from '$lib/stores/user';

	// TODO

	let loading = false;
	let email;
	let password;
	let usePassword = false;

	const handleLogin = async () => {
		loading = true;
		const { error } = await user.signIn(email, password);
		if (error) {
			alert(error.message);
		} else {
			alert('Check your email for the login link!');
		}
		loading = false;
	};
</script>

<main class="container flex justify-center">
	<article style="width: 32em;">
		<header>
			<h3 class="text-3xl mb-0">Login</h3>
		</header>
		<form on:submit|preventDefault={handleLogin}>
			<div>
				<input type="email" placeholder="learn@everyday.org" bind:value={email} />
				{#if usePassword}
					<input type="password" placeholder="f4ncyP4ssw0rd9000" bind:value={password} />
					<input type="submit" value={'Login'} disabled={loading || !email || !password} />
					<a on:click={resetPassword}>Reset password</a>
				{:else}
					<input type="submit" value={'Send magic link'} disabled={loading || !email} />{/if}
			</div>
		</form>

		<hr class="mb-4 border-t-1" />
		{#if !usePassword}<button class="outline" on:click|preventDefault={() => (usePassword = true)}
				>Sign in via password</button
			>
		{:else}
			<button class="outline mt-4" on:click|preventDefault={() => (usePassword = false)}
				>Sign in via magic link</button
			>
		{/if}
		<button class="outline" on:click={() => goto('register')}>Sign up</button>
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
