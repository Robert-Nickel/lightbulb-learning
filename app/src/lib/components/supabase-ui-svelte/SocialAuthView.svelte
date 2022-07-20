<script>
	import { goto } from '$app/navigation';

	import Button from './Button.svelte';

	export let supabaseClient;
	export let providers;
	export let socialLayout;
	export let view;
	export let redirectAfterLogin;

	let loading = false;

	$: hasProviders = providers && providers.length > 0;

	async function handleProviderSignIn(provider) {
		loading = true;

		const { error: signInError } = await supabaseClient.auth.signIn({ provider });
		if (signInError) {
			alert(signInError.message);
		} else {
			goto(redirectAfterLogin);
		}

		loading = false;
	}
</script>

{#if hasProviders}
	<div class="providers" class:horizontal={socialLayout == 'horizontal'}>
		{#each providers as provider}
			<Button primary={false} on:click={() => handleProviderSignIn(provider)}>
				{#if socialLayout == 'vertical'}{view == 'sign_up' ? 'Sign up' : 'Login'} with {provider}{/if}
			</Button>
		{/each}
	</div>
	<div role="separator" class="divider">
		<span>or continue with</span>
	</div>
{/if}

<style>
	.providers {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.providers.horizontal {
		flex-direction: row;
	}

	.divider {
		color: rgb(187, 187, 187);
		margin: 1rem 0;
		width: 100%;
		display: flex;
		align-items: center;
		white-space: nowrap;
		font-size: 0.9rem;
	}

	.divider span {
		margin: 1rem;
	}

	.divider::before,
	.divider::after {
		border-bottom-style: solid;
		border-bottom-width: 1px;
		top: 50%;
		content: '';
		position: relative;
		display: inline-block;
		width: 50%;
	}
</style>
