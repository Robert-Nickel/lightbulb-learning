<script lang="ts" context="module">
	import { fetchProfile } from '$lib/supabaseClient';
	import type { Load } from '@sveltejs/kit';
	import type { Session } from '@supabase/supabase-js';

	export const load: Load = async ({ session }) => {
		const { user } = session as Session;
		if (!user) {
			return { status: 302, redirect: '/login' };
		}
		console.log({user})
		const profile = await fetchProfile(user.id);
		console.log({profile})
		if (user && !profile) {
			return { status: 302, redirect: '/welcome' };
		}
		if (user && profile) {
			return { status: 302, redirect: '/course' };
		}
	};
</script>
