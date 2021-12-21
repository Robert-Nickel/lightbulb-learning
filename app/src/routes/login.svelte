<script lang="ts">
	import { goto } from '$app/navigation';
	import { signIn, loginFormState } from '$lib/stores/auth';

	let promise; // nothing to start with

	function handleSubmit() {
		promise = signIn().then(() => goto('/'));
	}
</script>

<div class="flex justify-center">
	<article class="max-w-sm">
		<header class="flex justify-between items-center">
			<h3 class="text-3xl mb-0">Login</h3>
			<a class="-mt-1" href="/register">Register</a>
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
			<button type="submit" class="outline">Login</button>
		</form>

		{#await promise}
			<span aria-busy="true">Logging in...</span>
		{:catch error}
			<mark class="errorMessage">Something went wrong: {error.message}</mark>
		{/await}
	</article>
</div>
