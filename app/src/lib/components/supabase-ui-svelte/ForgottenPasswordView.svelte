<script>
	import LinkButton from './LinkButton.svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	export let supabaseClient;
	export let setView;

	let loading = false,
		email = '';

	async function submit() {
		loading = true;

		const { error: err } = await supabaseClient.auth.api.resetPasswordForEmail(email);

		if (err) {
			alert(err.message);
		} else {
			('Check your email for the password reset link');
		}
		loading = false;
	}
</script>

<form on:submit|preventDefault={submit}>
	<Input name="email" type="email" label="Email address" bind:value={email} />
	<Button primary {loading}>Reset password</Button>

	<LinkButton on:click={() => setView('sign_in')}>Back to login</LinkButton>
</form>
