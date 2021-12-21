<script lang="ts">
	import { goto } from '$app/navigation';
	import { signUp, confirmSignUp, loginFormState } from '$lib/stores/auth';

	export let confirmStep = false;
	let promise; // nothing to start with

	function handleSubmit() {
		if (!confirmStep) {
			promise = signUp().then(() => (confirmStep = true));
		} else {
			promise = confirmSignUp().then(() => goto('/'));
		}
	}
</script>

<div class="flex justify-center">
	<article class="max-w-sm">
		<header class="flex justify-between items-center">
			<h3 class="text-3xl mb-0">Register</h3>
			{#if !confirmStep}<a class="-mt-1" href="/login">Login</a>{/if}
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
					Confirm Registration (check your email):
					<input type="text" bind:value={$loginFormState.confirmCode} placeholder="e.g. 123456" />
				</label>
			{/if}
			<button type="submit" class="outline">Register</button>
		</form>

		{#await promise}
			<span aria-busy="true">Registering...</span>
		{:catch error}
			<mark>Something went wrong: {error.message}</mark>
		{/await}
	</article>
</div>
