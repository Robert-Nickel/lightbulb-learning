<script>
	import LinkButton from './LinkButton.svelte';
	import Text from './Text.svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	export let supabaseClient;
	export let view;
	export let setView;

	let error = '',
		message = '',
		loading = false,
		email = '',
		password = '';

	async function submit() {
		error = '';
		message = '';
		loading = true;

		if (view == 'sign_up') {
			const { error: signUpError } = await supabaseClient.auth.signUp({
				email,
				password
			});

			if (signUpError) error = signUpError.message;
		} else if (view == 'sign_in') {
			const { error: signInError } = await supabaseClient.auth.signIn({
				email,
				password
			});

			if (signInError) error = signInError.message;
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

	{#if message}
		<Text>{message}</Text>
	{/if}

	{#if error}
		<Text type="danger">{error}</Text>
	{/if}
</form>

<style>
	
</style>
