<script lang="ts">
	import { signUp, signIn, confirmSignUp, loginFormState } from '$lib/stores/auth';

	export let mode = 'signup';
	let promise; // nothing to start with

	function handleSubmit() {
		if (mode === 'signup') {
			promise = signUp().then(() => {
				mode = 'confirm';
			});
		} else if (mode === 'confirm') {
			promise = confirmSignUp();
		} else {
			promise = signIn();
		}
	}
</script>

<div class="flex justify-center">
	<article class="max-w-sm">
		<header class="flex justify-between items-center">
			<h3 class="text-3xl mb-0">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h3>
			{#if mode === 'signin'}
				<a on:click={() => (mode = 'signup')} class="-mt-1" href="javascript:;">
					Switch to Sign Up
				</a>
			{:else}
				<a on:click={() => (mode = 'signin')} class="-mt-1" href="javascript:;">
					Switch to Sign In
				</a>
			{/if}
		</header>

		<form on:submit|preventDefault={handleSubmit}>
			{#if mode === 'signup' || mode === 'signin'}
				<label>
					Email:
					<input type="email" bind:value={$loginFormState.email} />
				</label>
				<label>
					Password:
					<input type="password" bind:value={$loginFormState.password} />
				</label>
			{:else if mode === 'confirm'}
				<label>
					Confirm signup (check your email):
					<input type="text" bind:value={$loginFormState.confirmCode} placeholder="e.g. 123456" />
				</label>
			{/if}
			<button type="submit">Submit</button>
		</form>

		{#await promise}
			<span aria-busy="true">Logging in...</span>
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
