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

<div>
	{#await promise}
		<p>Logging in...</p>
	{:catch error}
		<p class="errorMessage">Something went wrong: {error.message}</p>
	{/await}
	<div class="flex justify-between mb-8">
		<div class="inline-block">
			<p class="text-3xl">Sign Up</p>
		</div>
		<div class="flex justify-end">
			<h3 class="text-3xl mb-0">Sign Up</h3>
			{#if !confirmStep}<a class="-mt-1" href="/signin"> Switch to Sign In </a>{/if}
		</div>
	</div>
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
		<button type="submit">Sign Up</button>
	</form>
</div>
