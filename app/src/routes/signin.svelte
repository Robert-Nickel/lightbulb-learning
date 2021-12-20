<script lang="ts">
	import { browser } from '$app/env';

	import { signIn, loginFormState } from '$lib/stores/auth';

	let promise; // nothing to start with

	function handleSubmit() {
		promise = signIn().then(() => {
			if (browser) window.open('/', "_self")
		});
	}
</script>

<div class="flex justify-center">
	<article class="max-w-sm">
		<header class="flex justify-between items-center">
			<h3 class="text-3xl mb-0">Sign In</h3>
			<a class="-mt-1" href="/signup"> Switch to Sign Up </a>
		</header>

		<form on:submit|preventDefault={handleSubmit}>
			<label>
				Email:
				<input type="email" bind:value={$loginFormState.email} />
			</label>
			<label>
				Password:
				<input type="password" bind:value={$loginFormState.password} />
			</label>

			<button type="submit" class="outline">Sign In</button>
		</form>

		{#await promise}
			<span aria-busy="true">Signing in ...</span>
		{:catch error}
			<span class="errorMessage">Something went wrong: {error.message}</span>
		{/await}
	</article>
</div>

<style>
	.errorMessage {
		background: papayawhip;
		color: red;
		padding: 1rem;
	}
</style>