<script lang="ts">
	import { supabase } from '$lib/supabaseClient';

	let loading = false;
	let email;

	const handleLogin = async () => {
		try {
			loading = true;
			const { error } = await supabase.auth.signIn({ email });
			if (error) throw error;
			alert('Check your email for the login link!');
		} catch (error) {
			alert(error.error_description || error.message);
		} finally {
			loading = false;
		}
	};
</script>

<div class="flex justify-center">
	<article class="max-w-sm">
		<header class="flex justify-between items-center">
			<h3 class="text-3xl mb-0">Login</h3>
		</header>
		<form class="row flex flex-center" on:submit|preventDefault={handleLogin}>
			<div class="col-6 form-widget">
				<p class="description">Login via magic link</p>
				<div>
					<input class="inputField" type="email" placeholder="Your email" bind:value={email} />
				</div>
				<div>
					<input
						type="submit"
						class="button block"
						value={loading ? 'Loading' : 'Send magic link'}
						disabled={loading}
					/>
				</div>
			</div>
		</form>
	</article>
</div>
