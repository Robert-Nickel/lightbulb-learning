<script lang="ts">
	import { browser } from '$app/env';

	import { signUp, confirmSignUp, loginFormState } from '$lib/stores/auth';

	export let confirmStep = false;
	let promise; // nothing to start with

	function handleSubmit() {
		if (!confirmStep) {
			promise = signUp().then(() => {
				confirmStep = true;
			});
		} else {
			promise = confirmSignUp().then(() => {
				if (browser) window.open('/', '_self');
			});
		}
	}
</script>

<div class="flex justify-center">
	<article class="max-w-sm">
		<header class="flex justify-between items-center">
			<h3 class="text-3xl mb-0">Sign Up</h3>
			{#if !confirmStep}<a class="-mt-1" href="/signin"> Switch to Sign In </a>{/if}
		</header>

		<form on:submit|preventDefault={handleSubmit}>
			{#if !confirmStep}
				<label>
					Email:
					<input type="email" bind:value={$loginFormState.email} />
				</label>
				<label>
					Password:
					<input type="password" bind:value={$loginFormState.password} />
				</label>
			{:else}
				<label>
					Confirm signup (check your email):
					<input type="text" bind:value={$loginFormState.confirmCode} placeholder="e.g. 123456" />
				</label>
			{/if}
			<button type="submit" class="outline">Sign Up</button>
		</form>

		{#await promise}
			<span aria-busy="true">Signing up ...</span>
		{:catch error}
			<span class="errorMessage">Something went wrong: {error.message}</span>
		{/await}
	</article>
</div>
