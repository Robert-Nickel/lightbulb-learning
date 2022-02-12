<script lang="ts" context="module">
	import { fetchProfile } from '$lib/supabaseClient';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';

	export const load: Load = async ({ session }) => {
		const { user } = session as Session;
		if (!user) return {};

		const profile = await fetchProfile(user.id);
		if (user && !profile) {
			return { status: 302, redirect: '/welcome' };
		}
		if (user && profile) {
			return { status: 302, redirect: '/challengepool' };
		}
	};
</script>

<script lang="ts">
	import StartPage from '$lib/components/StartPage.svelte';
</script>

<StartPage />

<!--Go here to see which toasts are possible: https://zerodevx.github.io/svelte-toast/-->
