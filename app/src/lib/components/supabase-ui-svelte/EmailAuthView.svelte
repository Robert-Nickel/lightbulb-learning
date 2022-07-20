<script>
	import LinkButton from './LinkButton.svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';
	import { goto } from '$app/navigation';

	export let supabaseClient;
	export let view;
	export let setView;
	export let redirectAfterLogin;

	let loading = false,
		email = '',
		password = '';

	async function submit() {
		loading = true;

		if (view == 'sign_up') {
			const { error: signUpError } = await supabaseClient.auth.signUp({
				email,
				password
			});

			if (!signUpError) {
				alert('Check your email to confirm your signup!');
			} else {
				alert(signUpError.message);
			}
		} else if (view == 'sign_in') {
			const { error: signInError } = await supabaseClient.auth.signIn({
				email,
				password
			});

			if (signInError) {
				alert(signInError.message);
			} else {
				goto(redirectAfterLogin);
			}
		}

		loading = false;
	}
</script>

<form on:submit|preventDefault={submit}>
	<Input name="email" type="email" label="Email address" bind:value={email} />
	<Input name="password" type="password" label="Password" bind:value={password} />

	{#if view == 'sign_up'}
		<Button primary {loading}>Sign up</Button>
		<div class="links">
			<LinkButton on:click={() => setView('magic_link')}>Login with magic link</LinkButton>
			<LinkButton on:click={() => setView('sign_in')}>Do you have an account? Login</LinkButton>
		</div>
	{:else}
		<Button primary {loading}>Login</Button>
		<div class="links">
			<LinkButton on:click={() => setView('sign_up')}>Sign up</LinkButton>
			<LinkButton on:click={() => setView('forgotten_password')}>Forgot your password?</LinkButton>
		</div>
	{/if}
</form>

<style>
</style>
