<script lang="ts">
	import StartPage from '$lib/components/StartPage.svelte';
	import { session } from '$app/stores';
	import { goto } from '$app/navigation';
	import { routes } from '$lib/routes';

	$: {
		if ($session.user && $session.user.id) {
			console.log('$session.user exists -> goto courses');
			goto(routes.courses);
		}
	}
</script>

<StartPage />
