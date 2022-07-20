<script>
	import LinkButton from './LinkButton.svelte';
	import Button from './Button.svelte';
	import Input from './Input.svelte';

	export let supabaseClient;
	export let setView;

	let 
		loading = false,
		email = '';

	async function submit() {
		loading = true;

		const { error: err } = await supabaseClient.auth.signIn({ email });

		if (err) alert(err.message);
		else alert('Check your email for the magic link.');

		loading = false;
	}
</script>

<form on:submit|preventDefault={submit}>
	<Input name="email" type="email" label="Email address" bind:value={email} />
	<Button primary {loading}>Send magic link</Button>

	<LinkButton on:click={() => setView('sign_in')}>Login with password</LinkButton>
</form>
